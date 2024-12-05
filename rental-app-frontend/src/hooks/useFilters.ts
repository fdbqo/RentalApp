import { useState, useCallback } from 'react'
import { FilterState } from '@/store/interfaces/Property'

const initialFilters: FilterState = {
  searchQuery: '',
  distance: '',
  minPrice: '',
  maxPrice: '',
  beds: '',
  propertyType: '',
}

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }))
  }, [])

  return { filters, updateFilters }
}