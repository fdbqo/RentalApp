import {create} from 'zustand';

interface Property {
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

interface PropertyState {
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

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],

  name: '',
  description: '',
  image: null,
  availability: '',
  propertyType: 'room',
  rooms: null,
  bathrooms: null,
  distanceFromUniversity: null,
  price: '',

  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setImage: (image) => set({ image }),
  setAvailability: (availability) => set({ availability }),
  setPropertyType: (propertyType) => set({ propertyType }),
  setRooms: (rooms) => set({ rooms }),
  setBathrooms: (bathrooms) => set({ bathrooms }),
  setDistanceFromUniversity: (distance) => set({ distanceFromUniversity: distance }),
  setPrice: (price) => set({ price }),

  fetchProperties: async () => {
    try {
      const response = await fetch('http://<your-backend-ip>:3000/properties');
      const data = await response.json();
      set({ properties: data });
    } catch (error) {
      console.error('Error fetching properties:', (error as Error).message);
    }
  },

  listProperty: async () => {
    const {
      name,
      description,
      image,
      availability,
      propertyType,
      rooms,
      bathrooms,
      distanceFromUniversity,
      price,
    } = get();

    const propertyData = {
      name,
      description,
      image: image || '',
      availability,
      propertyType,
      rooms: rooms || 0,
      bathrooms: bathrooms || 0,
      distanceFromUniversity: distanceFromUniversity || 0,
      price: Number(price),
    };

    try {
      const response = await fetch('http://<your-backend-ip>:3000/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        throw new Error('Failed to list property');
      }

      get().fetchProperties();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error listing property:', error.message);
      } else {
        console.error('Error listing property:', error);
      }
    }
  },
}));