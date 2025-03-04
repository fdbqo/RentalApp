import React, { useMemo, useEffect } from "react";
import { FlatList, useWindowDimensions, Platform, Image } from "react-native";
import { YStack, XStack, Text, Button, Theme, ScrollView } from "tamagui";
import { Bell } from "@tamagui/lucide-icons";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FilterSystem } from "@/components/FilterSystem";
import PropertyCard from "@/components/PropertyCard";
import { useFilters } from "@/hooks/useFilters";
import { useUserStore } from "@/store/user.store";
import { usePropertyStore } from "@/store/property.store";
import { Property } from "@/store/interfaces/Property";
import { rentalAppTheme } from "@/constants/Colors";

export default function ListingsScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const router = useRouter();
  const { filters, updateFilters } = useFilters();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const { properties, isLoading, error, fetchProperties } = usePropertyStore();

  useEffect(() => {
    fetchProperties(filters);
  }, [filters]);

  useEffect(() => {
    // Prefetch images when properties are loaded
    if (properties.length > 0) {
      properties.forEach(property => {
        if (property.images && property.images.length > 0) {
          const imageUri = property.images[0].uri;
          if (imageUri) {
            Image.prefetch(imageUri).catch(err => 
              console.error('Error prefetching image:', err)
            );
          }
        }
      });
    }
  }, [properties]);

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

  const renderItem = useMemo(() => 
    ({ item }: { item: Property }) => {
      const roomsAvailable = (item.singleBedrooms ?? 0) + (item.doubleBedrooms ?? 0);
      return (
        <PropertyCard
          item={item}
          onPress={() =>
            router.push({
              pathname: "/screens/PropertyDetailScreen",
              params: {
                id: item._id,
                shortDescription: item.shortDescription ?? '',
                price: item.price?.toString() ?? '',
                images: JSON.stringify(item.images) ?? '[]',
                availability: item.availability ?? '',
                description: item.description ?? '',
                propertyType: item.propertyType ?? '',
                roomsAvailable: roomsAvailable.toString(),
                bathrooms: item.bathrooms?.toString() ?? '',
                nearestUniversities: JSON.stringify(item.nearestUniversities ?? {}), 
                houseAddress: JSON.stringify(item.houseAddress) ?? '{}',
                lenderId: item.lenderId ?? '',
              },
            })
          }
        />
      );
    }, [router]);

  const keyExtractor = useMemo(() => 
    (item: Property) => item._id || Math.random().toString(),
    []
  );

  const PropertyList = useMemo(() => {
    if (isLoading) {
      return <Text>Loading properties...</Text>;
    }

    if (error) {
      return <Text color={rentalAppTheme.accentDarkRed}>Error: {error}</Text>;
    }

    if (properties.length === 0) {
      return <Text>No properties found.</Text>;
    }

    if (isWeb) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <XStack flexWrap="wrap" gap="$4">
            {properties.map((item) => (
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
        data={properties}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, padding: 12 }}
        numColumns={getNumColumns}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        initialNumToRender={5}
      />
    );
  }, [isLoading, error, properties, isWeb, getCardWidth, getNumColumns, renderItem, keyExtractor]);

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight} padding="$4">
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <Text fontSize={24} fontWeight="bold" color={rentalAppTheme.textDark}>
            Listings
          </Text>
          {isAuthenticated ? (
            <Button variant="outlined" padding="$2" borderWidth={0}>
              <Bell size={24} color={rentalAppTheme.textDark} />
            </Button>
          ) : (
            <Button
              onPress={() => router.push("/screens/LoginScreen")}
              backgroundColor={rentalAppTheme.primaryDark}
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

        <FilterSystem filters={filters} onFilterChange={updateFilters} />
        {PropertyList}
      </YStack>
    </Theme>
  );
}

