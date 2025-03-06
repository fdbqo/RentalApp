import { useState, useCallback } from 'react'
import { FilterState } from '../store/interfaces/Property'

const initialFilters: FilterState = {
  searchQuery: '',
  searchType: 'location',
  minPrice: '',
  maxPrice: '',
  beds: '',
  propertyType: '',
}

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => {
      // If changing search type, clear the search query
      if (newFilters.searchType && newFilters.searchType !== prevFilters.searchType) {
        return {
          ...prevFilters,
          ...newFilters,
          searchQuery: '',
        }
      }
      return {
        ...prevFilters,
        ...newFilters,
      }
    })
  }, [])

  return { filters, updateFilters }
}