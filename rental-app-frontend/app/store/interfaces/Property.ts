export interface Property {
    id: string;
    name: string;
    description: string;
    image: string;
    availability: string;
    propertyType: 'room' | 'whole house';
    rooms: number;
    bathrooms: number;
    distanceFromUniversity: number;
    price: number;
  }

// This interface defines the shape of a single property. It represents a single entry in the list of properties