import React from "react";
import { Image, GestureResponderEvent, Platform } from "react-native";
import { Card, Text, YStack, XStack, Button, Separator } from "tamagui";
import {
  Home,
  Bed,
  Bath,
  MapPin,
  Calendar,
  Euro,
  Subtitles,
  Bold,
} from "@tamagui/lucide-icons";
import { Property } from "@/store/interfaces/Property";
import { rentalAppTheme } from "@/constants/Colors";

interface PropertyCardProps {
  item: Property;
  onPress: () => void;
}

export default function PropertyCard({ item, onPress }: PropertyCardProps) {
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";
  const handlePress = (e: GestureResponderEvent) => {
    if ((e.target as any).closest?.(".filter-dropdown")) {
      e.stopPropagation();
      return;
    }
    onPress();
  };

  const isRecentlyUpdated = () => {
    const lastUpdatedDate = new Date(item.lastUpdated!);
    const currentDate = new Date();
    const diffTime = Math.abs(
      currentDate.getTime() - lastUpdatedDate.getTime()
    );
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const renderAvailability = () => {
    let color = rentalAppTheme.primaryLight;
    let content;

    switch (item.availability) {
      case "available_from":
        content = isMobile ? (
          <YStack>
            <Text fontSize={12} color={color} fontWeight="500">
              Available from
            </Text>
            <Text fontSize={12} color={color} fontWeight="500">
              {formatDate(item.availableFrom!)}
            </Text>
          </YStack>
        ) : (
          <Text fontSize={12} color={color} fontWeight="500">
            Available from {formatDate(item.availableFrom!)}
          </Text>
        );
        break;
      case "immediately":
        content = isMobile ? (
          <YStack>
            <Text fontSize={12} color={color} fontWeight="500">
              Available
            </Text>
            <Text fontSize={12} color={color} fontWeight="500">
              Immediately
            </Text>
          </YStack>
        ) : (
          <Text fontSize={12} color={color} fontWeight="500">
            Available Immediately
          </Text>
        );
        break;
      case "not_available":
      default:
        content = (
          <Text fontSize={12} color={color} fontWeight="500">
            Not Available
          </Text>
        );
    }

    return (
      <XStack alignItems="center" space="$2">
        <Calendar size={16} color={color} />
        {content}
      </XStack>
    );
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
    });
    return formattedDate.length > 8
      ? `${formattedDate.slice(0, 8)}...`
      : formattedDate;
  };

  const capitaliseFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Card
      elevate
      size="$4"
      bordered
      marginBottom="$4"
      onPress={handlePress}
      shadowColor={rentalAppTheme.textDark}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      borderRadius="$4"
    >
      <Image
        source={{ uri: item.images[0].uri }}
        style={{ width: "100%", height: 200 }}
        resizeMode="cover"
        accessibilityLabel={`Image of ${item.shortDescription}`}
      />
      <YStack padding="$4" space="$3">
        <YStack space="$2">
          <Text fontSize={16} fontWeight="600" color="$gray12">
            {item.houseAddress.addressLine1},{" "}
            {item.houseAddress.addressLine2 || ""}, {item.houseAddress.townCity}
          </Text>
          <Text fontSize={14} color="$gray10">
            {item.houseAddress.county}, {item.houseAddress.eircode}
          </Text>
          <XStack alignItems="center">
            <Euro size={16} color={rentalAppTheme.primaryDark} />
            <Text
              fontSize={16}
              fontWeight="500"
              color={rentalAppTheme.primaryDark}
            >
              {item.price}/month
            </Text>
            {isRecentlyUpdated() && (
              <Text
                fontSize={12}
                fontWeight="1000"
                color="$red10"
                marginLeft="$2"
              >
                Recently updated!
              </Text>
            )}
          </XStack>
        </YStack>

        <Separator />

        <Text fontSize={14} color="$gray11" numberOfLines={2}>
          {item.shortDescription}
        </Text>

        <XStack flexWrap="wrap" justifyContent="space-between">
          <PropertyFeature
            icon={Home}
            text={capitaliseFirstLetter(item.propertyType)}
          />
          <PropertyFeature
            icon={Bed}
            text={`${(item.singleBedrooms || 0) + (item.doubleBedrooms || 0)} ${
              (item.singleBedrooms || 0) + (item.doubleBedrooms || 0) === 1
                ? "Bedroom"
                : "Bedrooms"
            }`}
          />

          <PropertyFeature
            icon={Bath}
            text={`${item.bathrooms} ${
              item.bathrooms > 1 ? "Bathrooms" : "Bathroom"
            }`}
          />
        </XStack>

        <Separator />

        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" space="$2">
            {renderAvailability()}
          </XStack>
          <Button
            fontWeight="bold"
            size="$3"
            theme="active"
            onPress={(e: GestureResponderEvent) => {
              e.stopPropagation();
              onPress();
            }}
            icon={MapPin}
            backgroundColor={rentalAppTheme.primaryDark}
            color="white"
            pressStyle={{ backgroundColor: rentalAppTheme.primaryDarkPressed }}
          >
            View Details
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}

function PropertyFeature({
  icon: Icon,
  text,
}: {
  icon: typeof Home;
  text: string;
}) {
  return (
    <XStack alignItems="center" space="$1" paddingVertical="$1">
      <Icon size={14} color="$gray10" />
      <Text fontSize={13} color="$gray10">
        {text}
      </Text>
    </XStack>
  );
}
