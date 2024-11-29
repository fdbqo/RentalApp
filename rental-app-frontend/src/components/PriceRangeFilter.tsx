import React from 'react'
import { XStack, Input, Text } from 'tamagui'

interface PriceRangeFilterProps {
  minPrice: string | undefined
  maxPrice: string | undefined
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  style?: any
}

export const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  style,
}) => {
  return (
    <XStack {...style} alignItems="center" gap="$2">
      <XStack flex={1} alignItems="center">
        <Text paddingLeft="$3" color="$gray11">€&nbsp;</Text>
        <Input
          flex={1}
          value={minPrice || ''}
          onChangeText={onMinPriceChange}
          placeholder="Min"
          keyboardType="numeric"
          borderWidth={0}
          fontSize={14}
          color="$gray12"
          placeholderTextColor="$gray9"
          paddingLeft="$1"
        />
      </XStack>
      <Text color="$gray11" paddingHorizontal="$1">-</Text>
      <XStack flex={1} alignItems="center">
        <Text paddingLeft="$3" color="$gray11">€&nbsp;</Text>
        <Input
          flex={1}
          value={maxPrice || ''}
          onChangeText={onMaxPriceChange}
          placeholder="Max"
          keyboardType="numeric"
          borderWidth={0}
          fontSize={14}
          color="$gray12"
          placeholderTextColor="$gray9"
          paddingLeft="$1"
          paddingRight="$3"
        />
      </XStack>
    </XStack>
  )
}

