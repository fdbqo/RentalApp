import { Property } from './Property';

export interface PropertyState {
  properties: Property[];
  name: string;
  description: string;
  image: string | null;
  availability: string;
  propertyType: 'room' | 'whole house';
  rooms: number | null;
  bathrooms: number | null;
  distanceFromUniversity: number | null;
  price: string;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setImage: (image: string | null) => void;
  setAvailability: (availability: string) => void;
  setPropertyType: (propertyType: 'room' | 'whole house') => void;
  setRooms: (rooms: number | null) => void;
  setBathrooms: (bathrooms: number | null) => void;
  setDistanceFromUniversity: (distance: number | null) => void;
  setPrice: (price: string) => void;
  fetchProperties: () => Promise<void>;
  listProperty: () => Promise<void>;
}

// This interface defines the global state structure managed by Zustand.