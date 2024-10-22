import React, { useState } from "react";
import { FlatList, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import PropertyCard from "../../components/PropertyCard";
import { YStack, XStack, Text, Input, Button, Theme } from "tamagui";
import { router } from "expo-router";

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

const propertyData = [
  {
    id: "1",
    name: "Dublin Apt",
    price: 1200,
    image:
      "https://archipro.com.au/assets/article/building/Form-Apartments-Port-Coogee-by-Stiebel-Eltron--v2.jpg?raw=1",
    availability: "Available now",
    description: "Modern apartment in the heart of Dublin",
    propertyType: "Whole apartment",
    rooms: 2,
    bathrooms: 1,
    distanceFromUniversity: 0.5,
  },
  {
    id: "2",
    name: "Cork House",
    price: 1500,
    image:
      "https://www.thespruce.com/thmb/BpZG-gG2ReQwYpzrQg302pezLr0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Stocksy_txp3d216bb1tUq300_Medium_4988078-56c96ac19def4bf8ba430cf5063b6b38.jpg",
    availability: "Available from July",
    description: "Spacious house with garden in Cork",
    propertyType: "Whole house",
    rooms: 3,
    bathrooms: 2,
    distanceFromUniversity: 1.2,
  },
  {
    id: "3",
    name: "Galway Studio",
    price: 900,
    image:
      "https://housingireland.ie/wp-content/uploads/2019/05/Apartment_Living_1.jpg",
    availability: "Available now",
    description: "Cozy studio apartment in Galway city center",
    propertyType: "Studio",
    rooms: 1,
    bathrooms: 1,
    distanceFromUniversity: 0.3,
  },
  {
    id: "4",
    name: "Limerick Loft",
    price: 1100,
    image:
      "https://b740574.smushcdn.com/740574/wp-content/uploads/2023/03/Linea-45.jpg?lossy=1&strip=1&webp=1",
    availability: "Available from August",
    description: "Stylish loft apartment in Limerick",
    propertyType: "Whole apartment",
    rooms: 2,
    bathrooms: 1,
    distanceFromUniversity: 0.8,
  },
];
export default function ListingsScreen() {
  const [filteredData, setFilteredData] = useState(propertyData);
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  return (
    <Theme name="light">
      <YStack
        flex={1}
        backgroundColor={rentalAppTheme.backgroundLight}
        padding="$4"
      >
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text fontSize={24} fontWeight="bold" color="black">
            Listings
          </Text>
          <Button variant="outlined" padding="$2" borderWidth={0}>
            <Feather name="bell" size={24} color="black" />
          </Button>
        </XStack>

        {/* Search Bar */}
        <XStack
          alignItems="center"
          backgroundColor="white"
          borderRadius="$6"
          padding="$1"
          paddingHorizontal="$3"
          marginBottom="$4"
          borderWidth={1}
          borderColor="#cccccc"
        >
          <Feather name="search" size={20} color="gray" mr="$2" />
          <Input
            flex={1}
            fontSize={16}
            placeholder="Search properties..."
            placeholderTextColor="gray"
            backgroundColor="transparent"
            borderWidth={0}
            focusStyle={{ borderWidth: 0 }}
          />
        </XStack>

        {/* Property List */}
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <YStack marginBottom="$4">
              <PropertyCard
                item={item}
                isWeb={isWeb}
                onPress={() =>
                  router.push({ pathname: "/screens/PropertyDetailScreen", params: item })
                }
              />
            </YStack>
          )}
          keyExtractor={(item) => item.id}
          numColumns={isWeb ? 3 : 1}
          key={isWeb ? "web" : "mobile"}
          columnWrapperStyle={
            isWeb
              ? { justifyContent: "space-between", marginBottom: 16 }
              : undefined
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </YStack>
    </Theme>
  );
}
