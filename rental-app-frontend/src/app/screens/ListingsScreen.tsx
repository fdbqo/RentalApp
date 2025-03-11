import React, { useMemo, useEffect } from "react";
import {
  FlatList,
  useWindowDimensions,
  Platform,
  Image,
  RefreshControl,
} from "react-native";
import {
  YStack,
  XStack,
  Text,
  Button,
  Theme,
  ScrollView,
  Spinner,
} from "tamagui";
import { Bell, Search } from "@tamagui/lucide-icons";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FilterSystem } from "@/components/FilterSystem";
import PropertyCard from "@/components/PropertyCard";
import { useFilters } from "@/hooks/useFilters";
import { useUserStore } from "@/store/user.store";
import { usePropertyStore } from "@/store/property.store";
import { Property } from "@/store/interfaces/Property";
import { rentalAppTheme } from "@/constants/Colors";
import { NotificationPopover } from "@/components/NotificationPopover";

export default function ListingsScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const router = useRouter();
  const { filters, updateFilters } = useFilters();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [refreshing, setRefreshing] = React.useState(false);

  const { properties, isLoading, error, fetchProperties } = usePropertyStore();

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProperties(filters);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProperties, filters]);

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  // Filter properties based on search criteria
  const filteredProperties = useMemo(() => {
    if (!properties) return [];
    
    let filtered = [...properties];

    // Apply search filters
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      
      if (filters.searchType === 'university') {
        // Filter properties that have the searched university nearby
        filtered = filtered.filter(property => 
          property.nearestUniversities.some(uni => 
            uni.name.toLowerCase() === searchLower
          )
        );
      } else {
        // Filter by location (county or town/city)
        filtered = filtered.filter(property => 
          property.houseAddress.county.toLowerCase().includes(searchLower) ||
          property.houseAddress.townCity.toLowerCase().includes(searchLower)
        );
      }
    }

    // Apply price filters
    if (filters.minPrice) {
      filtered = filtered.filter(property => 
        property.price >= parseInt(filters.minPrice || '0')
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(property => 
        property.price <= parseInt(filters.maxPrice || '999999999')
      );
    }

    // Apply beds filter
    if (filters.beds) {
      const requiredBeds = parseInt(filters.beds);
      filtered = filtered.filter(property => 
        (property.singleBedrooms + property.doubleBedrooms) >= requiredBeds
      );
    }

    return filtered;
  }, [properties, filters]);

  useEffect(() => {
    // Prefetch images when properties are loaded
    if (filteredProperties.length > 0) {
      filteredProperties.forEach((property) => {
        if (property.images && property.images.length > 0) {
          const imageUri = property.images[0].uri;
          if (imageUri) {
            Image.prefetch(imageUri).catch((err) =>
              console.error("Error prefetching image:", err)
            );
          }
        }
      });
    }
  }, [filteredProperties]);

  const getNumColumns = useMemo(() => {
    if (!isWeb) return 1;
    if (width >= 1400) return 4;
    if (width >= 768) return 2;
    return 1;
  }, [isWeb, width]);

  const getCardWidth = useMemo(() => {
    if (!isWeb || width < 768) return "100%";
    if (width >= 1400) return `calc(25% - 16px)`;
    return `calc(50% - 16px)`;
  }, [isWeb, width]);

  const renderItem = useMemo(
    () =>
      ({ item }: { item: Property }) => {
        const roomsAvailable =
          (item.singleBedrooms ?? 0) + (item.doubleBedrooms ?? 0);
        return (
          <PropertyCard
            item={item}
            onPress={() =>
              router.push({
                pathname: "/screens/PropertyDetailScreen",
                params: {
                  id: item._id,
                  shortDescription: item.shortDescription ?? "",
                  price: item.price?.toString() ?? "",
                  images: JSON.stringify(item.images) ?? "[]",
                  availability: item.availability ?? "",
                  description: item.description ?? "",
                  propertyType: item.propertyType ?? "",
                  roomsAvailable: roomsAvailable.toString(),
                  bathrooms: item.bathrooms?.toString() ?? "",
                  nearestUniversities: JSON.stringify(
                    item.nearestUniversities ?? {}
                  ),
                  houseAddress: JSON.stringify(item.houseAddress) ?? "{}",
                  lenderId: item.lenderId ?? "",
                },
              })
            }
          />
        );
      },
    [router]
  );

  const keyExtractor = useMemo(
    () => (item: Property) => item._id || Math.random().toString(),
    []
  );

  const PropertyList = useMemo(() => {
    if (isLoading && !refreshing) {
      return (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$8"
        >
          <Spinner size="large" color={rentalAppTheme.primaryDark} />
        </YStack>
      );
    }

    if (error) {
      return <Text color={rentalAppTheme.accentDarkRed}>Error: {error}</Text>;
    }

    if (filteredProperties.length === 0) {
      return (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$8"
          space="$4"
        >
          <Search size={48} color={rentalAppTheme.textLight} />
          <YStack alignItems="center" space="$2">
            <Text
              color={rentalAppTheme.textDark}
              fontSize={20}
              fontWeight="bold"
              textAlign="center"
            >
              No Properties Found
            </Text>
            <Text
              color={rentalAppTheme.textLight}
              fontSize={16}
              textAlign="center"
            >
              Try adjusting your filters to see more results
            </Text>
          </YStack>
        </YStack>
      );
    }

    if (isWeb) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={rentalAppTheme.primaryDark}
              colors={[rentalAppTheme.primaryDark]}
            />
          }
        >
          <XStack flexWrap="wrap" gap="$4">
            {filteredProperties.map((item) => (
              <YStack key={item._id} width={getCardWidth}>
                {renderItem({ item })}
              </YStack>
            ))}
          </XStack>
        </ScrollView>
      );
    }

    return (
      <FlatList
        data={filteredProperties}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, padding: 12 }}
        numColumns={getNumColumns}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={rentalAppTheme.primaryDark}
            colors={[rentalAppTheme.primaryDark]}
          />
        }
      />
    );
  }, [
    isLoading,
    error,
    filteredProperties,
    isWeb,
    getCardWidth,
    getNumColumns,
    renderItem,
    keyExtractor,
    refreshing,
    onRefresh,
  ]);

  return (
    <Theme name="light">
      <YStack
        flex={1}
        backgroundColor={rentalAppTheme.backgroundLight}
        padding="$4"
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text fontSize={24} fontWeight="bold" color={rentalAppTheme.textDark}>
            Listings
          </Text>
          {isAuthenticated ? (
            <NotificationPopover />
          ) : (
            <Button
              onPress={() => router.push("/screens/LoginScreen")}
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{ backgroundColor: rentalAppTheme.primaryDarkPressed }}
              padding="$2"
              borderRadius="$4"
              flexDirection="row"
              alignItems="center"
            >
              <Feather name="log-in" size={20} color="white" />
              <Text color="white" fontWeight="bold" fontSize={16}>
                Login
              </Text>
            </Button>
          )}
        </XStack>

        <YStack position="relative" zIndex={100} pointerEvents="auto">
          <FilterSystem
            filters={filters}
            onFilterChange={updateFilters}
            properties={properties}
          />
        </YStack>

        <YStack flex={1} zIndex={1}>
          {PropertyList}
        </YStack>
      </YStack>
    </Theme>
  );
}
