import { create } from "zustand";
import axios from "axios";
import { Property, NearestUniversities } from "./interfaces/Property";
import { PropertyState } from "./interfaces/PropertyState";
import { useUserStore } from "./user.store";
import { env } from "../../env";

const API_URL = env.API_URL;
const AXIOS_TIMEOUT = 30000;
const URL_REFRESH_THRESHOLD = 3600000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isUrlExpired = (url: string): boolean => {
  try {
    const expiresParam = new URL(url).searchParams.get('X-Amz-Expires');
    const dateParam = new URL(url).searchParams.get('X-Amz-Date');
    
    if (!expiresParam || !dateParam) return true;

    const expiresIn = parseInt(expiresParam);
    const dateStr = dateParam;
    
    const signedDate = Date.parse(
      `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${dateStr.slice(9, 11)}:${dateStr.slice(11, 13)}:${dateStr.slice(13, 15)}Z`
    );
    
    const expirationTime = signedDate + (expiresIn * 1000);
    const currentTime = Date.now();
    
    return (expirationTime - currentTime) < URL_REFRESH_THRESHOLD;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return true;
  }
};

// Helper function to get signed URL
const getSignedUrl = async (imageUri: string): Promise<string> => {
  try {

    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      return imageUri;
    }

    const token = useUserStore.getState().token;
    if (!token) {
      console.warn("No authentication token available for signed URL request");
      return imageUri;
    }

    const response = await axios.get(
      `${API_URL}/upload/${encodeURIComponent(imageUri)}`,
      {
        timeout: AXIOS_TIMEOUT,
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return response.data.url || imageUri;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return imageUri;
  }
};

// Helper function to process images without preloading
const processImages = async (images: any[]) => {
  if (!Array.isArray(images)) return [];

  return await Promise.all(
    images.map(async (img) => {
      if (!img || !img.uri) return img;
      const signedUrl = await getSignedUrl(img.uri);
      return { ...img, uri: signedUrl };
    })
  );
};

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
      const formData = new FormData();
      const filename = imageUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const token = useUserStore.getState().token;

      const response = await axios.post(
        `${API_URL}/upload?folder=properties`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          timeout: AXIOS_TIMEOUT,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // Actions
  fetchProperties: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      );

      // If searching by university, modify the query
      if (cleanFilters.searchType === 'university' && cleanFilters.searchQuery) {
        delete cleanFilters.searchType; 
        cleanFilters.university = cleanFilters.searchQuery;
        delete cleanFilters.searchQuery;
      }

      const response = await axios.get(`${API_URL}/listings`, {
        params: cleanFilters,
        timeout: AXIOS_TIMEOUT,
      });

      const processedProperties = await Promise.all(
        response.data.map(async (property) => {
          if (property.images && property.images.length > 0) {
            const processedImages = await processImages(property.images);
            return { ...property, images: processedImages };
          }
          return property;
        })
      );

      set({ properties: processedProperties, isLoading: false });
    } catch (error) {
      console.error("Error fetching properties:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch properties",
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
        timeout: AXIOS_TIMEOUT,
      });
      
      const processedProperties = await Promise.all(
        response.data.map(async (property) => {
          if (property.images && property.images.length > 0) {
            const processedImages = await processImages(property.images);
            return { ...property, images: processedImages };
          }
          return property;
        })
      );

      set({ properties: processedProperties, isLoading: false });
    } catch (error) {
      console.error("Error fetching landlord properties:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch properties",
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
          if (img.uri.startsWith("http")) {
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
      const existingProperty = get().properties.find((p) => p._id === id);
      if (existingProperty) {
        // Even for existing properties, refresh URLs if needed
        if (existingProperty.images && existingProperty.images.length > 0) {
          const refreshedImages = await processImages(existingProperty.images);
          const refreshedProperty = { ...existingProperty, images: refreshedImages };
          set({ selectedProperty: refreshedProperty, isLoading: false });
          return;
        }
        set({ selectedProperty: existingProperty, isLoading: false });
        return;
      }

      const response = await axios.get(`${API_URL}/listings/${id}`, {
        timeout: AXIOS_TIMEOUT,
      });

      const property = response.data;
      if (property.images && property.images.length > 0) {
        const processedImages = await processImages(property.images);
        property.images = processedImages;
      }

      set((state) => ({
        selectedProperty: property,
        properties: [...state.properties.filter((p) => p._id !== id), property],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error fetching property by ID:", error);
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
      // Process any new images in the property data
      if (propertyData.images && propertyData.images.length > 0) {
        const processedImages = await processImages(propertyData.images);
        propertyData.images = processedImages;
      }

      const response = await axios.put(
        `${API_URL}/listings/${id}`,
        propertyData,
        { timeout: AXIOS_TIMEOUT }
      );

      const updatedProperty = response.data;
      if (updatedProperty.images && updatedProperty.images.length > 0) {
        const processedImages = await processImages(updatedProperty.images);
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
      console.error("Error updating property:", error);
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
