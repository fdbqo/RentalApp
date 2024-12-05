import { useState, useEffect } from 'react'
import { FilterState } from '@/store/interfaces/Property'
import { Property} from '@/store/interfaces/Property'

const API_URL = undefined // Set this to undefined to test the fallback behavior

const hardcodedProperty: Property = {
  _id: 'hardcoded1',
  price: 1200,
  isRented: false,
  availability: 'available_from',
  availableFrom: '2023-12-01',
  description: "This is a spacious and modern apartment located in the heart of the city. It features a fully equipped kitchen, a comfortable living room, and a private balcony with a stunning view.",
  shortDescription: "Modern City Center Apartment",
  propertyType: "apartment",
  singleBedrooms: 2,
  doubleBedrooms: 0,
  bathrooms: 1,
  distanceFromUniversity: 1.5,
  images: [
    {
      id: 'img1',
      uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      name: 'Living Room',
      type: 'image/avif'
    },
    {
      id: 'img2',
      uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
      name: 'Kitchen',
      type: 'image/avif'
    }
  ],
  houseAddress: {
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    townCity: "Dublin",
    county: "Dublin",
    eircode: "D01 AB12"
  },
  lenderId: 'lender1',
  lastUpdated: new Date().toISOString()
}

const additionalHardcodedProperties: Property[] = [
  {
    _id: 'hardcoded2',
    price: 800,
    isRented: false,
    availability: 'immediately',
    description: "Cozy studio apartment perfect for students. Located in a quiet neighborhood with easy access to public transportation. The apartment includes a kitchenette and a modern bathroom.",
    shortDescription: "Cozy Student Studio",
    propertyType: "studio",
    singleBedrooms: 0,
    doubleBedrooms: 1,
    bathrooms: 1,
    distanceFromUniversity: 0.8,
    images: [
      {
        id: 'img3',
        uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        name: 'Studio',
        type: 'image/avif'
      }
    ],
    houseAddress: {
      addressLine1: "45 College Green",
      addressLine2: "Unit 2C",
      townCity: "Dublin",
      county: "Dublin",
      eircode: "D02 XY45"
    },
    lenderId: 'lender2',
    lastUpdated: new Date().toISOString()
  },
  {
    _id: 'hardcoded3',
    price: 1500,
    isRented: true,
    availability: 'available_from',
    availableFrom: '2024-01-15',
    description: "Spacious family home in a suburban area. Features a large garden, three bedrooms, and a modern open-plan kitchen and living area. Close to schools and parks.",
    shortDescription: "Family Home with Garden",
    propertyType: "house",
    singleBedrooms: 1,
    doubleBedrooms: 2,
    bathrooms: 2,
    distanceFromUniversity: 4.2,
    images: [
      {
        id: 'img4',
        uri: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80',
        name: 'Garden',
        type: 'image/avif'
      },
      {
        id: 'img5',
        uri: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
        name: 'Kitchen',
        type: 'image/avif'
      }
    ],
    houseAddress: {
      addressLine1: "78 Willow Avenue",
      addressLine2: "House 3",
      townCity: "Swords",
      county: "Dublin",
      eircode: "K67 F4H2"
    },
    lenderId: 'lender3',
    lastUpdated: '2024-01-15'
  },
  {
    _id: 'hardcoded4',
    price: 950,
    isRented: false,
    availability: 'not_available',
    description: "Modern one-bedroom apartment in a newly built complex. Features a balcony with city views, a fully equipped kitchen, and access to a shared gym and rooftop garden.",
    shortDescription: "Modern 1-Bed with Amenities",
    propertyType: "apartment",
    singleBedrooms: 1,
    doubleBedrooms: 0,
    bathrooms: 1,
    distanceFromUniversity: 2.0,
    images: [
      {
        id: 'img6',
        uri: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1980&q=80',
        name: 'Balcony',
        type: 'image/avif'
      }
    ],
    houseAddress: {
      addressLine1: "The Docklands",
      addressLine2: "Apartment 507",
      townCity: "Dublin",
      county: "Dublin",
      eircode: "D01 F6H9"
    },
    lenderId: 'lender4',
    lastUpdated: new Date().toISOString()
  },
  {
    _id: 'hardcoded18',
    price: 800,
    isRented: false,
    availability: 'immediately',
    description: "Cozy studio apartment perfect for students. Located in a quiet neighborhood with easy access to public transportation. The apartment includes a kitchenette and a modern bathroom.",
    shortDescription: "Cozy Student Studio",
    propertyType: "studio",
    singleBedrooms: 0,
    doubleBedrooms: 1,
    bathrooms: 1,
    distanceFromUniversity: 0.8,
    images: [
      {
        id: 'img3',
        uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        name: 'Studio',
        type: 'image/avif'
      }
    ],
    houseAddress: {
      addressLine1: "45 College Green",
      addressLine2: "Unit 2C",
      townCity: "Dublin",
      county: "Dublin",
      eircode: "D02 XY45"
    },
    lenderId: 'lender2',
    lastUpdated: new Date().toISOString()
  },
  {
    _id: 'hardcoded9',
    price: 800,
    isRented: false,
    availability: 'immediately',
    description: "Cozy studio apartment perfect for students. Located in a quiet neighborhood with easy access to public transportation. The apartment includes a kitchenette and a modern bathroom.",
    shortDescription: "Cozy Student Studio",
    propertyType: "studio",
    singleBedrooms: 0,
    doubleBedrooms: 1,
    bathrooms: 1,
    distanceFromUniversity: 0.8,
    images: [
      {
        id: 'img3',
        uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        name: 'Studio',
        type: 'image/avif'
      }
    ],
    houseAddress: {
      addressLine1: "45 College Green",
      addressLine2: "Unit 2C",
      townCity: "Dublin",
      county: "Dublin",
      eircode: "D02 XY45"
    },
    lenderId: 'lender2',
    lastUpdated: new Date().toISOString()
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
    if (filters.beds && (property.singleBedrooms + property.doubleBedrooms * 2) < parseInt(filters.beds)) {
      return false;
    }
    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }
    return true;
  });
};

export const useProperties = (filters: FilterState) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      setError(null);

      if (!API_URL) {
        console.warn('API URL is not set. Using hardcoded properties.');
        const allHardcodedProperties = [hardcodedProperty, ...additionalHardcodedProperties];
        const filteredProperties = applyFilters(allHardcodedProperties, filters);
        setProperties(filteredProperties);
        setIsLoading(false);
        return;
      }

      try {
        const queryParams = new URLSearchParams(filters as Record<string, string>);
        const response = await fetch(`${API_URL}?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data: Property[] = await response.json();

        const filteredProperties = applyFilters(data, filters);

        if (filteredProperties.length === 0) {
          console.warn('No properties found after applying filters. Using hardcoded properties.');
          const allHardcodedProperties = [hardcodedProperty, ...additionalHardcodedProperties];
          const filteredHardcodedProperties = applyFilters(allHardcodedProperties, filters);
          setProperties(filteredHardcodedProperties);
        } else {
          setProperties(filteredProperties);
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        const allHardcodedProperties = [hardcodedProperty, ...additionalHardcodedProperties];
        const filteredHardcodedProperties = applyFilters(allHardcodedProperties, filters);
        setProperties(filteredHardcodedProperties);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [filters]);

  return { properties, isLoading, error };
};