import { create } from "zustand";
import axios from "axios";
import { Property, NearestUniversities } from "./interfaces/Property";
import { PropertyState } from "./interfaces/PropertyState";
import { useUserStore } from "./user.store";
import { env } from "../../env";

const API_URL = env.EXPO_PUBLIC_API_URL;

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
      const response = await axios.post(`${API_URL}/upload?folder=properties`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Image upload response:', response.data);
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

      const response = await axios.get(`${API_URL}/listings`, {
        params: cleanFilters,
      });

      console.log("API Response Data:", response.data); // Debugging

      // Process images to ensure they have valid URLs
      const processedProperties = await Promise.all(response.data.map(async (property) => {
        if (property.images && property.images.length > 0) {
          // Process each image to ensure it has a valid URL
          const processedImages = await Promise.all(property.images.map(async (img) => {
            // If the URI is already a full URL, use it
            if (img.uri && (img.uri.startsWith('http://') || img.uri.startsWith('https://'))) {
              return img;
            }
            
            // Otherwise, get a signed URL from the backend
            try {
              const signedUrlResponse = await axios.get(`${API_URL}/upload/${encodeURIComponent(img.uri)}`);
              return { ...img, uri: signedUrlResponse.data.url };
            } catch (error) {
              console.error('Error getting signed URL:', error);
              return img; // Return original image if we can't get a signed URL
            }
          }));
          
          return { ...property, images: processedImages };
        }
        return property;
      }));

      set({ properties: processedProperties, isLoading: false });
    } catch (error) {
      console.error('Error fetching properties:', error);
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
      const response = await axios.get(`${API_URL}/listings`, {
        params: { lenderId: userId },
      });

      console.log("API Response Data:", response.data); // Debugging
  
      // Process images to ensure they have valid URLs
      const processedProperties = await Promise.all(response.data.map(async (property) => {
        if (property.images && property.images.length > 0) {
          // Process each image to ensure it has a valid URL
          const processedImages = await Promise.all(property.images.map(async (img) => {
            // If the URI is already a full URL, use it
            if (img.uri && (img.uri.startsWith('http://') || img.uri.startsWith('https://'))) {
              return img;
            }
            
            // Otherwise, get a signed URL from the backend
            try {
              const signedUrlResponse = await axios.get(`${API_URL}/upload/${encodeURIComponent(img.uri)}`);
              return { ...img, uri: signedUrlResponse.data.url };
            } catch (error) {
              console.error('Error getting signed URL:', error);
              return img; // Return original image if we can't get a signed URL
            }
          }));
          
          return { ...property, images: processedImages };
        }
        return property;
      }));

      set({ properties: processedProperties, isLoading: false });
    } catch (error) {
      console.error('Error fetching landlord properties:', error);
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
          // Make sure we're using the signed URL, not just the key
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

      const response = await axios.post(`${API_URL}/listings`, propertyData);

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
      // First check if we already have this property in our properties array
      const existingProperty = get().properties.find(p => p._id === id);
      if (existingProperty) {
        set({ selectedProperty: existingProperty, isLoading: false });
        return;
      }

      const response = await axios.get(`${API_URL}/listings/${id}`);
      
      // Process images to ensure they have valid URLs
      const property = response.data;
      if (property.images && property.images.length > 0) {
        // Process each image to ensure it has a valid URL
        const processedImages = await Promise.all(property.images.map(async (img) => {
          // If the URI is already a full URL, use it
          if (img.uri && (img.uri.startsWith('http://') || img.uri.startsWith('https://'))) {
            return img;
          }
          
          // Otherwise, get a signed URL from the backend
          try {
            const signedUrlResponse = await axios.get(`${API_URL}/upload/${encodeURIComponent(img.uri)}`);
            return { ...img, uri: signedUrlResponse.data.url };
          } catch (error) {
            console.error('Error getting signed URL:', error);
            return img; // Return original image if we can't get a signed URL
          }
        }));
        
        property.images = processedImages;
      }
      
      // Update both selectedProperty and add to properties array for caching
      set(state => ({
        selectedProperty: property,
        properties: [...state.properties.filter(p => p._id !== id), property],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error fetching property by ID:', error);
      set({
        error: error instanceof Error ? error.message : "Failed to fetch property",
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
      // If there are images in the property data, make sure they have proper URLs
      if (propertyData.images && propertyData.images.length > 0) {
        const processedImages = await Promise.all(propertyData.images.map(async (img) => {
          // If the image is already a full URL, use it
          if (img.uri && (img.uri.startsWith('http://') || img.uri.startsWith('https://'))) {
            return img;
          }
          
          // If it's a local file, upload it first
          if (img.uri && !img.uri.startsWith('properties/')) {
            try {
              const uploadResult = await get().uploadImage(img.uri);
              return { uri: uploadResult.url };
            } catch (error) {
              console.error('Error uploading image during update:', error);
              return img;
            }
          }
          
          // Otherwise, get a signed URL from the backend
          try {
            const signedUrlResponse = await axios.get(`${API_URL}/upload/${encodeURIComponent(img.uri)}`);
            return { ...img, uri: signedUrlResponse.data.url };
          } catch (error) {
            console.error('Error getting signed URL during update:', error);
            return img;
          }
        }));
        
        propertyData.images = processedImages;
      }

      const response = await axios.put(
        `${API_URL}/listings/${id}`,
        propertyData
      );

      // Process the returned property to ensure images have valid URLs
      const updatedProperty = response.data;
      if (updatedProperty.images && updatedProperty.images.length > 0) {
        const processedImages = await Promise.all(updatedProperty.images.map(async (img) => {
          if (img.uri && (img.uri.startsWith('http://') || img.uri.startsWith('https://'))) {
            return img;
          }
          
          try {
            const signedUrlResponse = await axios.get(`${API_URL}/upload/${encodeURIComponent(img.uri)}`);
            return { ...img, uri: signedUrlResponse.data.url };
          } catch (error) {
            console.error('Error getting signed URL for updated property:', error);
            return img;
          }
        }));
        
        updatedProperty.images = processedImages;
      }

      // Update the properties list with the updated property
      const updatedProperties = get().properties.map((prop) =>
        prop._id === id ? updatedProperty : prop
      );

      set({
        properties: updatedProperties,
        selectedProperty: updatedProperty,
        isLoading: false,
      });

      return updatedProperty;
    } catch (error) {
      console.error('Error updating property:', error);
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
      await axios.delete(`${API_URL}/listings/${id}`);

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
