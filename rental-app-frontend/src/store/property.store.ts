import { create } from 'zustand';
import { PropertyState } from './interfaces/PropertyState';
import axios from 'axios';

const API_URL = "http://localhost:3000";
const HARDCODED_LENDER_ID = "6734ce60fc13ae56ffef7d50";

axios.interceptors.request.use(request => {
  return request;
});

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export const usePropertyStore = create<PropertyState>((set, get) => ({
  // State
  properties: [],
  isLoading: false,
  error: null,

  formData: {
    price: '',
    availability: true,
    description: '',
    shortDescription: '',
    propertyType: 'shared living',
    roomsAvailable: null,
    bathrooms: null,
    distanceFromUniversity: null,
    images: [],
    houseAddress: {
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      county: '',
      eircode: '',
    },
  },

  // Actions
  fetchProperties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.get(`${API_URL}/listings`, {
        params: { lenderId: HARDCODED_LENDER_ID }
      });
      
      set({ properties: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch properties',
        isLoading: false 
      });
    }
  },

  createProperty: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { formData } = get();
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        lenderId: HARDCODED_LENDER_ID
      };
      
      const response = await axios.post(`${API_URL}/listings`, propertyData);
      
      await get().fetchProperties();
      get().resetForm();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create property',
        isLoading: false 
      });
    }
  },

  resetForm: () => {
    set({
      formData: {
        price: '',
        availability: true,
        description: '',
        shortDescription: '',
        propertyType: 'shared living',
        roomsAvailable: null,
        bathrooms: null,
        distanceFromUniversity: null,
        images: [],
        houseAddress: {
          addressLine1: '',
          addressLine2: '',
          townCity: '',
          county: '',
          eircode: '',
        },
      }
    });
  },

  // Form setters
  setPrice: (price) => set((state) => ({
    formData: { ...state.formData, price }
  })),
  
  setAvailability: (availability) => set((state) => ({
    formData: { ...state.formData, availability }
  })),
  
  setDescription: (description) => set((state) => ({
    formData: { ...state.formData, description }
  })),
  
  setShortDescription: (shortDescription) => set((state) => ({
    formData: { ...state.formData, shortDescription }
  })),
  
  setPropertyType: (propertyType) => set((state) => ({
    formData: { ...state.formData, propertyType }
  })),
  
  setRoomsAvailable: (roomsAvailable) => set((state) => ({
    formData: { ...state.formData, roomsAvailable }
  })),
  
  setBathrooms: (bathrooms) => set((state) => ({
    formData: { ...state.formData, bathrooms }
  })),
  
  setDistanceFromUniversity: (distanceFromUniversity) => set((state) => ({
    formData: { ...state.formData, distanceFromUniversity }
  })),
  
  setImages: (images) => set((state) => ({
    formData: { ...state.formData, images }
  })),
  
  setHouseAddress: (address) => set((state) => ({
    formData: {
      ...state.formData,
      houseAddress: { ...state.formData.houseAddress, ...address }
    }
  })),
}));