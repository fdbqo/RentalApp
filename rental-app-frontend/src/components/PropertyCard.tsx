import React, { useState } from "react";
import { Image, Pressable, Platform } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { MaterialIcons } from "@expo/vector-icons";

type PropertyCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  availability: string;
  description: string;
  propertyType: string;
  rooms: number;
  bathrooms: number;
  distanceFromUniversity: number;
};

export default function PropertyCard({
  item,
  isWeb,
  onPress,
}: {
  item: PropertyCardProps;
  isWeb: boolean;
  onPress?: () => void;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      style={{
        transform: [{ scale: isPressed ? 0.98 : 1 }],
        borderRadius: 12,
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 16,
        width: isWeb ? "32%" : "100%",
        ...Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          },
          android: {
            elevation: 6,
          },
          web: {
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
          },
        }),
      }}
    >
      <Image
        source={{ uri: item.image || "https://example.com/default-image.jpg" }}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 8,
        }}
      />
      <YStack paddingTop="$4">
        <Text fontSize={18} fontWeight="bold" marginBottom="$2">
          {item.name}
        </Text>
        <Text fontSize={14} color="#4a4a4a" marginBottom="$2">
          {item.description}
        </Text>
        <Text fontSize={14} color="#4a4a4a" fontWeight="bold" marginBottom="$2">
          {item.propertyType}
        </Text>
        <Text fontSize={16} color="#4a4a4a" marginBottom="$2">
          €{item.price}/month
        </Text>
        <Text fontSize={14} color="#00a699" marginBottom="$4">
          {item.availability}
        </Text>

        <XStack justifyContent="space-between">
          <XStack alignItems="center">
            <MaterialIcons name="king-bed" size={16} color="#4a4a4a" />
            <Text fontSize={12} color="#4a4a4a" marginLeft="$2">
              {item.rooms} rooms
            </Text>
          </XStack>
          <XStack alignItems="center">
            <MaterialIcons name="bathtub" size={16} color="#4a4a4a" />
            <Text fontSize={12} color="#4a4a4a" marginLeft="$2">
              {item.bathrooms} bathrooms
            </Text>
          </XStack>
          <XStack alignItems="center">
            <MaterialIcons name="location-pin" size={16} color="#4a4a4a" />
            <Text fontSize={12} color="#4a4a4a" marginLeft="$2">
              {item.distanceFromUniversity} km
            </Text>
          </XStack>
        </XStack>
      </YStack>
    </Pressable>
  );
}
