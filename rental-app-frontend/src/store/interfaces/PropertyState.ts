import { Property } from './Property';

export interface PropertyState {
  // List of properties
  properties: Property[];
  isLoading: boolean;
  error: string | null;

  // Form state for creating/editing property
  formData: {
    price: string;
    availability: boolean;
    description: string;
    shortDescription: string;
    propertyType: string;
    roomsAvailable: number | null;
    bathrooms: number | null;
    distanceFromUniversity: number | null;
    images: string[];
    houseAddress: {
      addressLine1: string;
      addressLine2: string;
      townCity: string;
      county: string;
      eircode: string;
    };
  };

  // Actions
  fetchProperties: () => Promise<void>;
  createProperty: () => Promise<void>;
  resetForm: () => void;
  
  // Form setters
  setPrice: (price: string) => void;
  setAvailability: (availability: boolean) => void;
  setDescription: (description: string) => void;
  setShortDescription: (shortDescription: string) => void;
  setPropertyType: (propertyType: string) => void;
  setRoomsAvailable: (rooms: number | null) => void;
  setBathrooms: (bathrooms: number | null) => void;
  setDistanceFromUniversity: (distance: number | null) => void;
  setImages: (images: string[]) => void;
  setHouseAddress: (address: Partial<PropertyState['formData']['houseAddress']>) => void;
}
