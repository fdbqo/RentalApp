import React from 'react'
import { Image } from "react-native"
import { Card, Text, YStack, XStack, Stack } from "tamagui"
import { MapPin, Euro, Building2, BedDouble, Bath } from "@tamagui/lucide-icons"
import type { Property } from "@/store/interfaces/Property"
import { rentalAppTheme } from "@/constants/Colors"

interface PropertyCardProps {
  item: Property
  onPress: () => void
}

export default function PropertyCard({ item, onPress }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`
    }
    return `${distance}m`
  }

  const getAvailabilityColor = () => {
    switch (item.availability) {
      case "immediately":
        return "$green9"
      case "available_from":
        return "$yellow9"
      default:
        return "$red9"
    }
  }

  const getAvailabilityText = () => {
    switch (item.availability) {
      case "immediately":
        return "Available Now"
      case "available_from":
        return `Available ${new Date(item.availableFrom!).toLocaleDateString("en-IE", { month: "short", day: "numeric" })}`
      default:
        return "Not Available"
    }
  }

  const formatNumberWithCommas = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card
      elevate
      bordered={false}
      marginHorizontal="$2"
      marginVertical="$2"
      onPress={onPress}
      backgroundColor="$gray1"
      borderRadius="$6"
      overflow="hidden"
      animation="lazy"
      scale={0.98}
      pressStyle={{
        scale: 0.96,
      }}
    >
      {/* Image Container */}
      <Stack position="relative" height={200}>
        <Image
          source={{ uri: item.images[0].uri }}
          style={{
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
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
            {/* {formatPrice(item.price)} */}{formatNumberWithCommas(item.price)}
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
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$4"
        >
          <Text color="white" fontSize={12} fontWeight="500">
            {getAvailabilityText()}
          </Text>
        </XStack>
      </Stack>

      <YStack padding="$4" space="$4">
        {/* Location */}
        <YStack space="$2">
          <Text fontSize={16} fontWeight="600" color="$gray12" numberOfLines={1}>
            {item.houseAddress.addressLine1}
            {item.houseAddress.addressLine2 ? `, ${item.houseAddress.addressLine2}` : ""}
          </Text>
          <Text fontSize={14} color="$gray11" numberOfLines={1}>
            {item.houseAddress.townCity}, {item.houseAddress.county}, {item.houseAddress.eircode}
          </Text>
        </YStack>

        {/* Features */}
        <XStack justifyContent="space-between" flexWrap="wrap">
          <PropertyFeature icon={Building2} label="Type" value={item.propertyType} />
          <PropertyFeature icon={BedDouble} label="Beds" value={String(item.singleBedrooms + item.doubleBedrooms)} />
          <PropertyFeature icon={Bath} label="Baths" value={String(item.bathrooms)} />
        </XStack>

        {/* University Info */}
        {item.nearestUniversity && (
          <XStack backgroundColor="$gray3" borderRadius="$4" padding="$3" alignItems="center" space="$2">
            <MapPin size={18} color={rentalAppTheme.primaryDark} />
            <YStack>
              <Text fontSize={14} fontWeight="500" color="$gray12">
                {item.nearestUniversity.name}
              </Text>
              <Text fontSize={13} color="$gray11">
                {formatDistance(item.nearestUniversity.distance)} away
              </Text>
            </YStack>
          </XStack>
        )}
      </YStack>
    </Card>
  )
}

function PropertyFeature({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2
  label: string
  value: string
}) {
  return (
    <XStack
      alignItems="center"
      space="$2"
      backgroundColor="$gray3"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius="$4"
    >
      <Icon size={16} color="$gray11" />
      <YStack>
        <Text fontSize={12} color="$gray10">
          {label}
        </Text>
        <Text fontSize={14} color="$gray12" fontWeight="500">
          {value}
        </Text>
      </YStack>
    </XStack>
  )
}

