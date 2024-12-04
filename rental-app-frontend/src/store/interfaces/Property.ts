interface Image {
  id: string;
  uri: string;
}

export interface Property {
  _id?: string;
  price: number;
  isRented: boolean;
  availability: string; // "immediately" | "available_from"
  availableFrom?: string;
  description: string;
  shortDescription: string;
  propertyType: string;
  singleBedrooms: number;
  doubleBedrooms: number;
  bathrooms: number;
  distanceFromUniversity: number;
  images: Image[];
  houseAddress: {
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    eircode: string;
  };
  lenderId: string;
  lastUpdated?: string;
}

export interface FilterState {
  searchQuery?: string;
  distance?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  propertyType?: string;
}
