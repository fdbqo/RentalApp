import React from 'react'
import { Image, GestureResponderEvent } from 'react-native'
import { Card, Text, YStack, XStack, Button, Separator } from 'tamagui'
import { Home, Bed, Bath, MapPin, Calendar, Euro, Subtitles } from '@tamagui/lucide-icons'
import { Property } from '@/Types/types'

interface PropertyCardProps {
  item: Property
  onPress: () => void
}

export default function PropertyCard({ item, onPress }: PropertyCardProps) {
  const handlePress = (e: GestureResponderEvent) => {
    if ((e.target as any).closest?.('.filter-dropdown')) {
      e.stopPropagation()
      return
    }
    onPress()
  }

  return (
    <Card
      elevate
      size="$4"
      bordered
      marginBottom="$4"
      onPress={handlePress}
      backgroundColor="white"
      borderRadius={16}
      overflow="hidden"
    >
      <Image
        source={{ uri: item.images[0].uri }}
        style={{ width: '100%', height: 200 }}
        resizeMode="cover"
        accessibilityLabel={`Image of ${item.shortDescription}`}
      />
      <YStack padding="$4" space="$3">
        <YStack space="$2">
          <Text fontSize={16} fontWeight="600" color="$gray12">{item.houseAddress.addressLine1}, {item.houseAddress.addressLine2}, {item.houseAddress.townCity}</Text>
          <Text fontSize={14} color="$gray10">{item.houseAddress.county}, {item.houseAddress.eircode}</Text>
          <XStack alignItems="center" space="$2">
            <Euro size={18} color="$blue9" />
            <Text fontSize={16} fontWeight="500" color="$blue9">{item.price}/month</Text>
          </XStack>
        </YStack>
        
        <Separator />
        
        <Text fontSize={14} color="$gray11" numberOfLines={2}>{item.shortDescription}</Text>
        
        <XStack flexWrap="wrap" justifyContent="space-between">
          <PropertyFeature icon={Home} text={item.propertyType} />
          <PropertyFeature icon={Bed} text={`${item.roomsAvailable} ${item.roomsAvailable > 1 ? 'rooms' : 'room'}`} />
          <PropertyFeature icon={Bath} text={`${item.bathrooms} ${item.bathrooms > 1 ? 'bathrooms' : 'bathroom'}`} />
          <PropertyFeature icon={MapPin} text={`${item.distanceFromUniversity.toFixed(1)} km from university`} />
        </XStack>
        
        <Separator />
        
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" space="$2">
            <Calendar size={16} color={item.availability ? "$green9" : "$red9"} />
            <Text fontSize={14} color={item.availability ? "$green9" : "$red9"} fontWeight="500">
              {item.availability ? "Available" : "Not Available"}
            </Text>
          </XStack>
          <Button 
            size="$3" 
            theme="active" 
            onPress={(e: GestureResponderEvent) => {
              e.stopPropagation()
              onPress()
            }} 
            icon={MapPin} 
            backgroundColor="$blue8"
            color="white"
            pressStyle={{ backgroundColor: '$blue9' }}
          >
            View Details
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}

function PropertyFeature({ icon: Icon, text }: { icon: typeof Home; text: string }) {
  return (
    <XStack alignItems="center" space="$1" paddingVertical="$1">
      <Icon size={14} color="$gray10" />
      <Text fontSize={13} color="$gray10">{text}</Text>
    </XStack>
  )
}

