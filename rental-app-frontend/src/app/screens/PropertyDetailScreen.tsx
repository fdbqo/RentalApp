import React from "react";
import { ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { YStack, XStack, Text, Button, Image, Theme } from "tamagui";
import { useRouter, useLocalSearchParams } from "expo-router";

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

export default function PropertyDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    name,
    price,
    image,
    availability,
    description,
    propertyType,
    rooms,
    bathrooms,
    distanceFromUniversity,
  } = params;

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight} padding="$4">
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" marginBottom="$4">
          <Text fontSize={24} fontWeight="bold" color="black">
            {name}
          </Text>
          <Button variant="outlined" padding="$2" borderWidth={0}>
            <Feather name="bell" size={24} color="black" />
          </Button>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
          {/* Property Image */}
          <Image
            source={{ uri: Array.isArray(image) ? image[0] : image }}
            style={{ width: "100%", height: 300, borderRadius: 12, marginBottom: 16 }}
            resizeMode="cover"
          />

          {/* Property Details */}
          <YStack space="$4">
            <Text fontSize={18} fontWeight="bold" color={rentalAppTheme.textDark}>
              €{price}/month
            </Text>

            <Text fontSize={16} color="gray">
              {description}
            </Text>

            <XStack space="$3" marginTop="$4">
              <Text fontSize={16} color={rentalAppTheme.primaryDark}>
                {propertyType}
              </Text>
              <Text fontSize={16} color={rentalAppTheme.primaryDark}>
                {rooms} rooms
              </Text>
              <Text fontSize={16} color={rentalAppTheme.primaryDark}>
                {bathrooms} bathrooms
              </Text>
            </XStack>

            <Text fontSize={16} color="gray">
              Distance from University: {distanceFromUniversity} km
            </Text>

            <Text fontSize={16} color={availability === "Available now" ? rentalAppTheme.primaryLight : rentalAppTheme.accentDarkRed}>
              {availability}
            </Text>
          </YStack>

          {/* Action Buttons */}
          <YStack marginTop="$6" space="$3">
            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
              borderRadius="$4"
              onPress={() => alert("Schedule a Viewing")}
            >
              <Text fontSize={16} fontWeight="bold" color="white">
                Schedule a Viewing
              </Text>
            </Button>

            <Button
              backgroundColor={rentalAppTheme.accentDarkRed}
              pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
              borderRadius="$4"
              onPress={() => alert("Contact Landlord")}
            >
              <Text fontSize={16} fontWeight="bold" color="white">
                Contact Landlord
              </Text>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}