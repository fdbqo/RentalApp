import { create } from "zustand";
import axios from "axios";
import { Property, NearestUniversities } from "./interfaces/Property";
import { PropertyState } from "./interfaces/PropertyState";
import { useUserStore } from "./user.store";
import { env } from "../../env";

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,

  formData: {
    price: "",
    isRented: true,
    availability: "immediately",
    availableFrom: null as string | null,
    description: "",
    shortDescription: "",
    propertyType: "shared living",
    singleBedrooms: null,
    doubleBedrooms: null,
    bathrooms: null,
    nearestUniversities: null,
    images: [],
    houseAddress: {
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      county: "",
      eircode: "",
    },
  },

  // New function to handle image upload
  uploadImage: async (imageUri: string) => {
    try {
      // Create form data
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      // Get the auth token
      const token = useUserStore.getState().token;

      // Upload to S3 through backend
      const response = await axios.post(`${env.EXPO_PUBLIC_API_URL}/upload?folder=properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Actions
  fetchProperties: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      );

      const response = await axios.get(`${env.EXPO_PUBLIC_API_URL}/listings`, {
        params: cleanFilters,
      });

      console.log("API Response Data:", response.data); // Debugging

      set({ properties: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch properties",
        isLoading: false,
      });
    }
  },

  fetchLandlordProperties: async () => {
    set({ isLoading: true, error: null });
  
    const userId = useUserStore.getState().user?._id;
  
    if (!userId) {
      set({ isLoading: false, error: "User not logged in" });
      return;
    }
  
    try {
      const response = await axios.get(`${env.EXPO_PUBLIC_API_URL}/listings`, {
        params: { lenderId: userId },
      });

      console.log("API Response Data:", response.data); // Debugging
  
      set({ properties: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch properties",
        isLoading: false,
      });
    }
  },
  

  // Modified createProperty function
  createProperty: async () => {
    set({ isLoading: true, error: null });

    const userId = useUserStore.getState().user?._id;

    if (!userId) {
      set({ isLoading: false, error: "User not logged in" });
      return;
    }

    try {
      const { formData } = get();

      // Upload all images first
      const uploadedImages = await Promise.all(
        formData.images.map(async (img) => {
          if (img.uri.startsWith('http')) {
            // Image is already uploaded, return as is
            return { uri: img.uri };
          }
          // Upload new image
          const uploadResult = await get().uploadImage(img.uri);
          return { uri: uploadResult.url };
        })
      );

      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        isRented: formData.isRented,
        availability: formData.availability,
        availableFrom:
          formData.availability === "available_from"
            ? formData.availableFrom
            : undefined,
        singleBedrooms: formData.singleBedrooms ?? 0,
        doubleBedrooms: formData.doubleBedrooms ?? 0,
        lenderId: userId,
        lastUpdated: new Date().toISOString(),
        nearestUniversities: formData.nearestUniversities ?? null,
        images: uploadedImages,
      };

      const response = await axios.post(`${env.EXPO_PUBLIC_API_URL}/listings`, propertyData);

      await get().fetchLandlordProperties();
      get().resetForm();
      set({ isLoading: false });

      return response.data;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create property",
        isLoading: false,
      });
      throw error;
    }
  },

  resetForm: () => {
    set({
      formData: {
        price: "",
        isRented: false,
        availability: "",
        availableFrom: null,
        description: "",
        shortDescription: "",
        propertyType: "shared living",
        singleBedrooms: null,
        doubleBedrooms: null,
        bathrooms: null,
        images: [],
        houseAddress: {
          addressLine1: "",
          addressLine2: "",
          townCity: "",
          county: "",
          eircode: "",
        },
        nearestUniversities: null,
      },
    });
  },

  fetchPropertyById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${env.EXPO_PUBLIC_API_URL}/listings/${id}`);
      set({ selectedProperty: response.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch property",
        isLoading: false,
      });
    }
  },

  setSelectedProperty: (property) => set({ selectedProperty: property }),

  // Form setters
  setPrice: (price) =>
    set((state) => ({
      formData: { ...state.formData, price },
    })),

  setIsRented: (isRented) =>
    set((state) => ({
      formData: { ...state.formData, isRented },
    })),

  setAvailability: (availability) =>
    set((state) => ({
      formData: { ...state.formData, availability },
    })),

  setAvailableFrom: (availableFrom) =>
    set((state) => ({
      formData: { ...state.formData, availableFrom },
    })),

  setDescription: (description) =>
    set((state) => ({
      formData: { ...state.formData, description },
    })),

  setShortDescription: (shortDescription) =>
    set((state) => ({
      formData: { ...state.formData, shortDescription },
    })),

  setPropertyType: (propertyType) =>
    set((state) => ({
      formData: { ...state.formData, propertyType },
    })),

  setSingleBedrooms: (singleBedrooms) =>
    set((state) => ({
      formData: { ...state.formData, singleBedrooms },
    })),

  setDoubleBedrooms: (doubleBedrooms) =>
    set((state) => ({
      formData: { ...state.formData, doubleBedrooms },
    })),

  setBathrooms: (bathrooms) =>
    set((state) => ({
      formData: { ...state.formData, bathrooms },
    })),

  setNearestUniversities: (nearestUniversities: NearestUniversities | null) =>
    set((state) => ({
      formData: { ...state.formData, nearestUniversities },
    })),

  setImages: (images) =>
    set((state) => ({
      formData: { ...state.formData, images },
    })),

  setHouseAddress: (address) =>
    set((state) => ({
      formData: {
        ...state.formData,
        houseAddress: { ...state.formData.houseAddress, ...address },
      },
    })),

  // setNearestUniversity: (nearestUniversity: NearestUniversity | null) =>
  //     set((state) => ({
  //       formData: {
  //         ...state.formData,
  //         nearestUniversity,
  //       },
  //     })),

  updateProperty: async (id: string, propertyData: Partial<Property>) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.put(
        `${env.EXPO_PUBLIC_API_URL}/listings/${id}`,
        propertyData
      );

      const updatedProperties = get().properties.map((prop) =>
        prop._id === id ? response.data : prop
      );

      set({
        properties: updatedProperties,
        selectedProperty: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update property",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProperty: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await axios.delete(`${env.EXPO_PUBLIC_API_URL}/listings/${id}`);

      const updatedProperties = get().properties.filter(
        (prop) => prop._id !== id
      );

      set({
        properties: updatedProperties,
        selectedProperty: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete property",
        isLoading: false,
      });
      throw error;
    }
  },
}));
