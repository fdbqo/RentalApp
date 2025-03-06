import React from "react";
import { Image } from "react-native";
import { Card, Text, YStack, XStack, Stack } from "tamagui";
import {
  MapPin,
  Euro,
  Building2,
  BedDouble,
  Bath,
} from "@tamagui/lucide-icons";
import type { Property } from "@/store/interfaces/Property";
import { rentalAppTheme } from "@/constants/Colors";

interface PropertyCardProps {
  item: Property;
  onPress: () => void;
}

export default function PropertyCard({ item, onPress }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${distance}m`;
  };

  const getAvailabilityColor = () => {
    switch (item.availability) {
      case "immediately":
        return "$green9";
      case "available_from":
        return "$yellow9";
      default:
        return "$red9";
    }
  };

  const getAvailabilityText = () => {
    switch (item.availability) {
      case "immediately":
        return "Available Now";
      case "available_from":
        return `Available ${new Date(item.availableFrom!).toLocaleDateString(
          "en-IE",
          { month: "short", day: "numeric" }
        )}`;
      default:
        return "Not Available";
    }
  };

  const formatNumberWithCommas = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card
      elevate
      bordered={false}
      marginVertical="$1.5"
      onPress={onPress}
      backgroundColor="white"
      borderRadius="$6"
      overflow="hidden"
      animation="lazy"
      scale={0.98}
      pressStyle={{
        scale: 0.96,
      }}
      shadowColor={rentalAppTheme.textDark}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
    >
      {/* Image Container */}
      <Stack position="relative" height={200}>
        <Image
          source={{
            uri:
              item.images && item.images.length > 0 && item.images[0].uri
                ? item.images[0].uri
                : "https://via.placeholder.com/400x300?text=No+Image",
            cache: "force-cache",
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
          onError={(e) => {
            console.error("Image loading error:", e.nativeEvent.error);
          }}
        />
        {/* Price Tag */}
        <XStack
          position="absolute"
          bottom="$3"
          left="$3"
          backgroundColor="rgba(0,0,0,0.75)"
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$4"
          alignItems="center"
          space="$1"
        >
          <Euro size={16} color="white" />
          <Text color="white" fontSize={18} fontWeight="600">
            {formatNumberWithCommas(item.price)}
          </Text>
          <Text color="$gray8" fontSize={14}>
            /mo
          </Text>
        </XStack>

        {/* Availability Badge */}
        <XStack
          position="absolute"
          top="$3"
          right="$3"
          backgroundColor={getAvailabilityColor()}
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$4"
        >
          <Text color="white" fontSize={13} fontWeight="600">
            {getAvailabilityText()}
          </Text>
        </XStack>
      </Stack>

      <YStack padding="$4" space="$3.5">
        {/* Location */}
        <YStack space="$1.5">
          <Text
            fontSize={18}
            fontWeight="600"
            color="$gray12"
            numberOfLines={1}
          >
            {item.shortDescription || item.houseAddress.addressLine1}
          </Text>
          <XStack space="$2" alignItems="center">
            <MapPin size={14} color="$gray11" />
            <Text fontSize={14} color="$gray11" numberOfLines={1}>
              {item.houseAddress.townCity}, {item.houseAddress.county}
            </Text>
          </XStack>
        </YStack>

        {/* Features */}
        <XStack space="$2" flexWrap="wrap">
          <PropertyFeature
            icon={Building2}
            label="Type"
            value={
              item.propertyType.charAt(0).toUpperCase() +
              item.propertyType.slice(1)
            }
          />
          <PropertyFeature
            icon={BedDouble}
            label="Beds"
            value={String(item.singleBedrooms + item.doubleBedrooms)}
          />
          <PropertyFeature
            icon={Bath}
            label="Baths"
            value={String(item.bathrooms)}
          />
        </XStack>

        {/* University Info */}
        {item.nearestUniversities?.length > 0 && (
          <Card backgroundColor="$gray2" borderRadius="$4" padding="$3">
            <XStack alignItems="center" space="$2">
              <MapPin size={18} color={rentalAppTheme.primaryDark} />
              <YStack>
                <Text fontSize={14} fontWeight="500" color="$gray12">
                  {item.nearestUniversities[0].name}
                </Text>
                <Text fontSize={13} color="$gray11">
                  {formatDistance(item.nearestUniversities[0].distance)} away
                </Text>
              </YStack>
            </XStack>
          </Card>
        )}
      </YStack>
    </Card>
  );
}

function PropertyFeature({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2;
  label: string;
  value: string;
}) {
  return (
    <Card
      backgroundColor="$gray2"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$4"
    >
      <XStack alignItems="center" space="$2">
        <Icon size={16} color={rentalAppTheme.primaryDark} />
        <YStack>
          <Text fontSize={12} color="$gray11">
            {label}
          </Text>
          <Text fontSize={14} color="$gray12" fontWeight="500">
            {value}
          </Text>
        </YStack>
      </XStack>
    </Card>
  );
}
