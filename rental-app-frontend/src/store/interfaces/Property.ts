export interface Property {
    id: string;
    name: string;
    description: string;
    image: string;
    availability: string;
    propertyType: 'room' | 'whole house' | 'apartment';
    rooms: number;
    bathrooms: number;
    distanceFromUniversity: number;
    price: number;
  }