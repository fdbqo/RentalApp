import React, { useCallback, useState } from 'react'
import { XStack, YStack, Button, Text, useMedia, Sheet, ScrollView } from 'tamagui'
import { ChevronDown, Menu } from '@tamagui/lucide-icons'
import { FilterState } from '@/Types/types'
import { SearchInput } from './SearchInput'
import { FilterSelect } from './FilterSelect'
import { PriceRangeFilter } from './PriceRangeFilter'

const distanceOptions = [
  { label: '+0km', value: '0' },
  { label: '+5km', value: '5' },
  { label: '+10km', value: '10' },
  { label: '+20km', value: '20' },
  { label: '+50km', value: '50' },
]

const bedOptions = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
]

interface FilterSystemProps {
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
}

const commonStyles = {
  height: 48,
  backgroundColor: 'white',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '$gray5',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
}

export const FilterSystem: React.FC<FilterSystemProps> = React.memo(({ filters, onFilterChange }) => {
  const media = useMedia()
  const [open, setOpen] = useState(false)
  const isMobile = media.sm

  const handleSearchChange = useCallback(
    (text: string) => {
      onFilterChange({ searchQuery: text })
    },
    [onFilterChange]
  )

  const handleDistanceChange = useCallback(
    (value: string) => {
      onFilterChange({ distance: value })
    },
    [onFilterChange]
  )

  const handleMinPriceChange = useCallback(
    (value: string) => {
      onFilterChange({ minPrice: value })
    },
    [onFilterChange]
  )

  const handleMaxPriceChange = useCallback(
    (value: string) => {
      onFilterChange({ maxPrice: value })
    },
    [onFilterChange]
  )

  const handleBedsChange = useCallback(
    (value: string) => {
      onFilterChange({ beds: value })
    },
    [onFilterChange]
  )

  const renderFilters = () => (
    <YStack space="$4" width="100%" padding={isMobile ? "$4" : 0}>
      <FilterSelect
        options={distanceOptions}
        value={filters.distance}
        onValueChange={handleDistanceChange}
        placeholder="+0km"
        style={commonStyles}
      />
      <PriceRangeFilter
        minPrice={filters.minPrice || ''}
        maxPrice={filters.maxPrice || ''}
        onMinPriceChange={handleMinPriceChange}
        onMaxPriceChange={handleMaxPriceChange}
        style={commonStyles}
      />
      <FilterSelect
        options={bedOptions}
        value={filters.beds}
        onValueChange={handleBedsChange}
        placeholder="Beds"
        style={commonStyles}
      />
    </YStack>
  )

  if (isMobile) {
    return (
      <YStack space="$2" marginBottom="$4">
        <SearchInput
          value={filters.searchQuery || ''}
          onChangeText={handleSearchChange}
          placeholder="County, City, Town or Area"
          style={{ ...commonStyles, minWidth: '100%' }}
        />
        <Button
          {...commonStyles}
          onPress={() => setOpen(true)}
          icon={Menu}
          paddingHorizontal="$3"
          flexDirection="row"
          alignItems="center"
          gap="$2"
        >
          <Text color="$gray12">Filters</Text>
        </Button>
        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          snapPoints={[60]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay />
          <Sheet.Frame>
            <Sheet.Handle />
            <YStack padding="$4">
              <Text fontSize={20} fontWeight="600" marginBottom="$4">Filters</Text>
              {renderFilters()}
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </YStack>
    )
  }

  return (
    <YStack space="$2" marginBottom="$4">
      <SearchInput
        value={filters.searchQuery || ''}
        onChangeText={handleSearchChange}
        placeholder="County, City, Town or Area"
        style={{ ...commonStyles, minWidth: '100%' }}
      />
      <XStack space="$2" alignItems="center">
        <FilterSelect
          options={distanceOptions}
          value={filters.distance}
          onValueChange={handleDistanceChange}
          placeholder="+0km"
          style={{ ...commonStyles, width: 100 }}
        />
        <PriceRangeFilter
          minPrice={filters.minPrice || ''}
          maxPrice={filters.maxPrice || ''}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          style={{ ...commonStyles, width: 220 }}
        />
        <FilterSelect
          options={bedOptions}
          value={filters.beds}
          onValueChange={handleBedsChange}
          placeholder="Beds"
          style={{ ...commonStyles, width: 100 }}
        />
        <Button
          {...commonStyles}
          paddingHorizontal="$3"
          flexDirection="row"
          alignItems="center"
          gap="$2"
          width={100}
        >
          <Text color="$gray12">Filters</Text>
          <ChevronDown size={16} color="$gray12" />
        </Button>
      </XStack>
    </YStack>
  )
})

