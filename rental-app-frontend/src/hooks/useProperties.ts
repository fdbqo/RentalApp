import { useState, useEffect } from 'react'
import { FilterState, Property } from '@/Types/types'

// Uncomment and use the appropriate URL based on your setup
// const API_URL = 'http://10.0.2.2:3000/api/properties' // Android emulator localhost
// const API_URL = 'http://localhost:3000/api/properties' // iOS simulator
// const API_URL = 'http://YOUR_IP:3000/api/properties' // Physical device

const API_URL = undefined // Set this to undefined to test the fallback behavior

const hardcodedProperty: Property = {
  _id: 'hardcoded1',
  id: 'hardcoded1',
  price: 1200,
  availability: true,
  description: "This is a spacious and modern apartment located in the heart of the city. It features a fully equipped kitchen, a comfortable living room, and a private balcony with a stunning view.",
  shortDescription: "Modern City Center Apartment",
  propertyType: "apartment",
  roomsAvailable: 2,
  bathrooms: 1,
  distanceFromUniversity: 1.5,
  images: [
    {
      id: 'img1',
      uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    },
    {
      id: 'img2',
      uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80'
    }
  ],
  houseAddress: {
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    townCity: "Dublin",
    county: "Dublin",
    eircode: "D01 AB12"
  },
  lenderId: 'lender1'
}

const additionalHardcodedProperties: Property[] = [
  {
    _id: 'hardcoded2',
    id: 'hardcoded2',
    price: 800,
    availability: true,
    description: "Cozy studio apartment perfect for students. Located in a quiet neighborhood with easy access to public transportation. The apartment includes a kitchenette and a modern bathroom.",
    shortDescription: "Cozy Student Studio",
    propertyType: "studio",
    roomsAvailable: 1,
    bathrooms: 1,
    distanceFromUniversity: 0.8,
    images: [
      {
        id: 'img3',
        uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      }
    ],
    houseAddress: {
      addressLine1: "45 College Green",
      addressLine2: "Unit 2C",
      townCity: "Dublin",
      county: "Dublin",
      eircode: "D02 XY45"
    },
    lenderId: 'lender2'
  },
  {
    _id: 'hardcoded3',
    id: 'hardcoded3',
    price: 1500,
    availability: false,
    description: "Spacious family home in a suburban area. Features a large garden, three bedrooms, and a modern open-plan kitchen and living area. Close to schools and parks.",
    shortDescription: "Family Home with Garden",
    propertyType: "house",
    roomsAvailable: 3,
    bathrooms: 2,
    distanceFromUniversity: 4.2,
    images: [
      {
        id: 'img4',
        uri: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80'
      },
      {
        id: 'img5',
        uri: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
      }
    ],
    houseAddress: {
      addressLine1: "78 Willow Avenue",
      townCity: "Swords",
      county: "Dublin",
      eircode: "K67 F4H2"
    },
    lenderId: 'lender3'
  },
  {
    _id: 'hardcoded4',
    id: 'hardcoded4',
    price: 950,
    availability: true,
    description: "Modern one-bedroom apartment in a newly built complex. Features a balcony with city views, a fully equipped kitchen, and access to a shared gym and rooftop garden.",
    shortDescription: "Modern 1-Bed with Amenities",
    propertyType: "apartment",
    roomsAvailable: 1,
    bathrooms: 1,
    distanceFromUniversity: 2.0,
    images: [
      {
        id: 'img6',
        uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80'
      }
    ],
    houseAddress: {
      addressLine1: "The Docklands",
      addressLine2: "Apartment 507",
      townCity: "Dublin",
      county: "Dublin",
      eircode: "D01 F6H9"
    },
    lenderId: 'lender4'
  }
]

const applyFilters = (properties: Property[], filters: FilterState): Property[] => {
  return properties.filter(property => {
    if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        const addressLower = `${property.houseAddress.addressLine1} ${property.houseAddress.addressLine2 || ''} ${property.houseAddress.townCity} ${property.houseAddress.county} ${property.houseAddress.eircode}`.toLowerCase();
        if (!addressLower.includes(searchLower)) {
          return false;
        }
    }
    if (filters.distance && property.distanceFromUniversity > parseFloat(filters.distance)) {
      return false;
    }
    if (filters.minPrice && property.price < parseFloat(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && property.price > parseFloat(filters.maxPrice)) {
      return false;
    }
    if (filters.beds && property.roomsAvailable < parseInt(filters.beds)) {
      return false;
    }
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }
    return true;
  });
};

export const useProperties = (filters: FilterState) => {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true)
      setError(null)

      if (!API_URL) {
        console.warn('API URL is not set. Using hardcoded properties.')
        const allHardcodedProperties = [hardcodedProperty, ...additionalHardcodedProperties]
        const filteredProperties = applyFilters(allHardcodedProperties, filters)
        setProperties(filteredProperties)
        setIsLoading(false)
        return
      }

      try {
        const queryParams = new URLSearchParams(filters as Record<string, string>)
        const response = await fetch(`${API_URL}?${queryParams}`)
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        const data: Property[] = await response.json()
        
        const filteredProperties = applyFilters(data, filters)
        
        if (filteredProperties.length === 0) {
          console.warn('No properties found after applying filters. Using hardcoded properties.')
          const allHardcodedProperties = [hardcodedProperty, ...additionalHardcodedProperties]
          const filteredHardcodedProperties = applyFilters(allHardcodedProperties, filters)
          setProperties(filteredHardcodedProperties)
        } else {
          setProperties(filteredProperties)
        }
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        const allHardcodedProperties = [hardcodedProperty, ...additionalHardcodedProperties]
        const filteredHardcodedProperties = applyFilters(allHardcodedProperties, filters)
        setProperties(filteredHardcodedProperties)
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()
  }, [filters])

  return { properties, isLoading, error }
}

