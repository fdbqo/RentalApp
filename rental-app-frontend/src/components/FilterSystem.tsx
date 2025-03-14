import React, { useCallback, useState } from 'react'
import { XStack, YStack, Button, Text, useMedia, Sheet, ScrollView } from 'tamagui'
import { ChevronDown, Menu } from '@tamagui/lucide-icons'
import { FilterState, Property } from '@/store/interfaces/Property'
import { SearchInput } from './SearchInput'
import { FilterSelect } from './FilterSelect'
import { PriceRangeFilter } from './PriceRangeFilter'

const bedOptions = [
  { label: 'Any', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
]

const searchTypeOptions = [
  { label: 'Location', value: 'location' },
  { label: 'University', value: 'university' },
]

interface FilterSystemProps {
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
  properties: Property[]
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

export const FilterSystem: React.FC<FilterSystemProps> = React.memo(
  ({ filters, onFilterChange, properties }) => {
    const media = useMedia()
    const [open, setOpen] = useState(false)
    const isMobile = media.sm
    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Get unique locations from properties
    const getLocations = useCallback(() => {
      const locations = new Set<string>()
      
      try {
        properties.forEach((property) => {
          if (property && property.houseAddress) {
            if (typeof property.houseAddress.county === 'string' && property.houseAddress.county.trim() !== '') {
              locations.add(property.houseAddress.county.trim())
            }
            if (typeof property.houseAddress.townCity === 'string' && property.houseAddress.townCity.trim() !== '') {
              locations.add(property.houseAddress.townCity.trim())
            }
          }
        })
      } catch (error) {
        console.error('Error getting locations:', error)
      }
      
      return Array.from(locations).sort()
    }, [properties])

    // Get unique universities from properties
    const getUniversities = useCallback(() => {
      const universities = new Set<string>()
      
      try {
        properties.forEach((property) => {
          if (property && property.nearestUniversities && Array.isArray(property.nearestUniversities)) {
            property.nearestUniversities.forEach((uni) => {
              if (uni && typeof uni.name === 'string' && uni.name.trim() !== '') {
                universities.add(uni.name.trim())
              }
            })
          }
        })
      } catch (error) {
        console.error('Error getting universities:', error)
      }
      
      return Array.from(universities).sort()
    }, [properties])

    // Filter suggestions based on search type and input
    const filterSuggestions = useCallback(
      (searchText: string) => {
        if (!searchText) return []
        
        const searchLower = searchText.toLowerCase()
        try {
          if (filters.searchType === 'university') {
            const universities = getUniversities()
            return universities.filter((uni) =>
              uni.toLowerCase().includes(searchLower)
            )
          } else {
            const locations = getLocations()
            return locations.filter((location) =>
              location.toLowerCase().includes(searchLower)
            )
          }
        } catch (error) {
          console.error('Error filtering suggestions:', error)
          return []
        }
      },
      [filters.searchType, getLocations, getUniversities]
    )

    const handleSearchChange = useCallback(
      (text: string) => {
        try {
          // Ensure text is a string
          const safeText = typeof text === 'string' ? text : '';
          
          // Update the filter state
          onFilterChange({ searchQuery: safeText });
          
          // Get suggestions based on the search text
          const suggestions = filterSuggestions(safeText);
          
          // Update the suggestions state
          setSearchSuggestions(suggestions || []);
          setShowSuggestions((suggestions?.length > 0) && (safeText.length > 0));
        } catch (error) {
          console.error('Error handling search change:', error);
          // Still update the search query even if suggestions fail
          onFilterChange({ searchQuery: typeof text === 'string' ? text : '' });
          setSearchSuggestions([]);
          setShowSuggestions(false);
        }
      },
      [onFilterChange, filterSuggestions]
    );

    const handleSearchTypeChange = useCallback(
      (value: string) => {
        onFilterChange({
          searchType: value as 'location' | 'university',
          searchQuery: '',
        })
        setSearchSuggestions([])
        setShowSuggestions(false)
      },
      [onFilterChange]
    )

    const handleSuggestionSelect = useCallback(
      (suggestion: string) => {
        onFilterChange({ searchQuery: suggestion })
        setShowSuggestions(false)
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

    const getSearchPlaceholder = () => {
      return filters.searchType === 'university'
        ? 'Search by university name...'
        : 'Search by county, city or town...'
    }

    const renderSearchWithSuggestions = () => (
      <YStack zIndex={100}>
        <XStack space="$2">
          <YStack flex={1} position="relative">
            <SearchInput
              value={filters.searchQuery || ''}
              onChangeText={handleSearchChange}
              placeholder={getSearchPlaceholder()}
              style={{ ...commonStyles, width: '100%' }}
            />
            {showSuggestions && (
              <YStack
                position="absolute"
                top={commonStyles.height + 4}
                left={0}
                right={0}
                backgroundColor="white"
                borderRadius={8}
                borderWidth={1}
                borderColor="$gray5"
                shadowColor="black"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={3}
                zIndex={9999}
                maxHeight={200}
                overflow="hidden"
              >
                <ScrollView>
                  {searchSuggestions.map((suggestion, index) => (
                    <XStack
                      key={suggestion}
                      padding="$3"
                      backgroundColor={index % 2 === 0 ? 'white' : '$gray1'}
                      pressStyle={{ backgroundColor: '$gray2' }}
                      onPress={() => handleSuggestionSelect(suggestion)}
                      cursor="pointer"
                    >
                      <Text>{suggestion}</Text>
                    </XStack>
                  ))}
                </ScrollView>
              </YStack>
            )}
          </YStack>
          <FilterSelect
            options={searchTypeOptions}
            value={filters.searchType || 'location'}
            onValueChange={handleSearchTypeChange}
            placeholder="Search Type"
            style={{ ...commonStyles, width: 120 }}
          />
        </XStack>
      </YStack>
    )

    const renderFilters = () => (
      <YStack space="$4" width="100%" padding={isMobile ? "$2" : 0} zIndex={200002}>
        <PriceRangeFilter
          minPrice={filters.minPrice || ''}
          maxPrice={filters.maxPrice || ''}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
          style={{
            ...commonStyles,
            zIndex: 200003,
            backgroundColor: 'white',
            borderColor: '$gray5',
          }}
        />
        <FilterSelect
          options={bedOptions}
          value={filters.beds}
          onValueChange={handleBedsChange}
          placeholder="Beds"
          style={{
            ...commonStyles,
            zIndex: 200003,
            backgroundColor: 'white',
            borderColor: '$gray5',
          }}
        />
      </YStack>
    )

    if (isMobile) {
      return (
        <YStack space="$2" marginBottom="$4" position="relative">
          {renderSearchWithSuggestions()}
          <Button
            {...commonStyles}
            onPress={() => setOpen(true)}
            icon={Menu}
            paddingHorizontal="$3"
            flexDirection="row"
            alignItems="center"
            gap="$2"
            zIndex={50}
            backgroundColor="white"
            borderColor="$gray5"
            pressStyle={{ backgroundColor: '$gray2' }}
          >
            <Text color="$gray12">Filters</Text>
          </Button>
          <Sheet
            modal
            open={open}
            onOpenChange={setOpen}
            snapPoints={[60]}
            dismissOnSnapToBottom
            zIndex={200000}
            animation="medium"
            position={0}
            disableDrag={false}
          >
            <Sheet.Overlay 
              animation="lazy" 
              enterStyle={{ opacity: 0 }} 
              exitStyle={{ opacity: 0 }}
              opacity={0.5}
              zIndex={199999}
            />
            <Sheet.Frame
              padding="$4"
              backgroundColor="white"
              borderTopLeftRadius={16}
              borderTopRightRadius={16}
              zIndex={200000}
            >
              <Sheet.Handle />
              <YStack padding="$2" zIndex={200001}>
                <Text fontSize={20} fontWeight="600" marginBottom="$4">
                  Filters
                </Text>
                {renderFilters()}
                <Button 
                  marginTop="$4" 
                  backgroundColor="$blue10" 
                  color="white"
                  onPress={() => setOpen(false)}
                  zIndex={200004}
                >
                  <Text color="white" fontWeight="bold">Apply Filters</Text>
                </Button>
              </YStack>
            </Sheet.Frame>
          </Sheet>
        </YStack>
      )
    }

    return (
      <YStack space="$2" marginBottom="$4" position="relative">
        {renderSearchWithSuggestions()}
        <XStack space="$2" alignItems="center" zIndex={50}>
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
  }
)

