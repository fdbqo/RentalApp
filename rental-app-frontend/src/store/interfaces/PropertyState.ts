import { Property, FilterState } from "./Property";

export interface PropertyState {
  formData: {
    price: string;
    isRented: boolean;
    availability: string;
    availableFrom?: string | null;
    description: string;
    shortDescription: string;
    propertyType: string;
    singleBedrooms: number | null;
    doubleBedrooms: number | null;
    bathrooms: number | null;
    distanceFromUniversity?: number | null;
    images: { id: string; uri: string; name: string; type: string; }[];
    houseAddress: {
      addressLine1: string;
      addressLine2?: string;
      townCity: string;
      county: string;
      eircode: string;
    };
  };
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProperties: (filters: FilterState) => Promise<void>;
  fetchLandlordProperties: () => Promise<void>;
  createProperty: () => Promise<void>;
  resetForm: () => void;
  fetchPropertyById: (id: string) => Promise<void>;
  updateProperty: (id: string, propertyData: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;

  // Form setters
  setPrice: (price: string) => void;
  setIsRented: (isRented: boolean) => void;
  setAvailability: (availability: string) => void;
  setAvailableFrom: (availableFrom: string | null) => void;
  setDescription: (description: string) => void;
  setShortDescription: (shortDescription: string) => void;
  setPropertyType: (propertyType: string) => void;
  setSingleBedrooms: (singleBedrooms: number | null) => void;
  setDoubleBedrooms: (doubleBedrooms: number | null) => void;
  setBathrooms: (bathrooms: number | null) => void;
  setDistanceFromUniversity: (distanceFromUniversity: number | null) => void;
  setImages: (images: { id: string; uri: string; name: string; type: string;}[]) => void;
  setHouseAddress: (
    address: Partial<PropertyState["formData"]["houseAddress"]>
  ) => void;
}
