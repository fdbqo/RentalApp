export interface FilterState {
  searchQuery?: string;
  distance?: string;
  minPrice?: string;
  maxPrice?: string;
  beds?: string;
  propertyType?: string;
}

export interface PropertyImage {
  id: string;
  uri: string;
}

export interface HouseAddress {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  county: string;
  eircode: string;
}

export interface Property {
  _id: string;
  id: string;
  price: number;
  availability: boolean;
  description: string;
  shortDescription: string;
  propertyType: string;
  roomsAvailable: number;
  bathrooms: number;
  distanceFromUniversity: number;
  images: PropertyImage[];
  houseAddress: HouseAddress;
  lenderId: string;
}

