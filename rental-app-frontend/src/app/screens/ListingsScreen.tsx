import React, { useMemo } from "react";
import { FlatList, useWindowDimensions, Platform, Image, Pressable } from "react-native";
import { YStack, XStack, Text, Button, Theme, ScrollView } from "tamagui";
import { Bell, AlertTriangle } from "@tamagui/lucide-icons";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FilterSystem } from "@/components/FilterSystem";
import PropertyCard from "@/components/PropertyCard";
import { useFilters } from "@/hooks/useFilters";
import { useProperties } from "@/hooks/useProperties";
import { useUserStore } from "@/store/user.store";
import { Property } from "@/store/interfaces/Property";

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

export default function ListingsScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const router = useRouter();
  const { filters, updateFilters } = useFilters();
  const { properties, isLoading, error } = useProperties(filters);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

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

  const renderItem = ({ item }: { item: Property }) => (
    <PropertyCard
      item={item}
      onPress={() =>
        router.push({
          pathname: "/screens/PropertyDetailScreen",
          params: {
            id: item._id,
            _id: item._id,
            shortDescription: item.shortDescription,
            price: item.price.toString(),
            images: JSON.stringify(item.images),
            availability: item.availability,
            availableFrom: item.availableFrom!,
            description: item.description,
            propertyType: item.propertyType,
            singleBedrooms: item.singleBedrooms.toString(),
            doubleBedrooms: item.doubleBedrooms.toString(),
            bathrooms: item.bathrooms.toString(),
            distanceFromUniversity: item.distanceFromUniversity.toString(),
            houseAddress: JSON.stringify(item.houseAddress),
            lenderId: item.lenderId,
          },
        })
      }
      // style={{ width: isWeb ? getCardWidth : '100%' }}
    />
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

    const isHardcodedProperty = properties.length === 1 && properties[0]._id === "hardcoded1";

    if (!isWeb) {
      return (
        <FlatList
          ListHeaderComponent={
            isHardcodedProperty ? (
              <XStack
                alignItems="center"
                marginBottom="$4"
                backgroundColor="$yellow2"
                padding="$2"
                borderRadius="$2"
              >
                <AlertTriangle color="$yellow10" size={20} />
                <Text marginLeft="$2" color="$yellow10">
                  No properties found. Showing a sample property.
                </Text>
              </XStack>
            ) : null
          }
          data={properties}
          renderItem={renderItem}
          keyExtractor={(item) => item._id ?? ''}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          numColumns={1}
        />
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {isHardcodedProperty && (
          <XStack
            alignItems="center"
            marginBottom="$4"
            backgroundColor="$yellow2"
            padding="$2"
            borderRadius="$2"
          >
            <AlertTriangle color="$yellow10" size={20} />
            <Text marginLeft="$2" color="$yellow10">
              No properties found. Showing a sample property.
            </Text>
          </XStack>
        )}
        <XStack flexWrap="wrap" gap="$4">
          {properties.map((item) => (
            <YStack key={item._id} width={getCardWidth}>
              {renderItem({ item })}
            </YStack>
          ))}
        </XStack>
      </ScrollView>
    );
  }, [isLoading, error, properties, isWeb, getCardWidth]);

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

