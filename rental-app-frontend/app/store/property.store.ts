import { create } from 'zustand';
import { Property } from './interfaces/Property';
import { PropertyState } from './interfaces/PropertyState';

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [
    {
      id: '1',
      name: 'Dublin Apt',
      description: 'A cozy apartment in Dublin.',
      image: 'https://example.com/image.jpg',
      availability: 'Available now',
      propertyType: 'room',
      rooms: 2,
      bathrooms: 1,
      distanceFromUniversity: 3,
      price: 1200,
    },
  ],

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
      const response = await fetch('http://localhost:3000/properties');
      const data = await response.json();

      set((state) => ({
        properties: [...data],
      }));
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
      id: Math.random().toString(36).substr(2, 9),
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
      const response = await fetch('http://localhost:3000/properties', {
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