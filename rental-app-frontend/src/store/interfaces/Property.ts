export interface Image {
  uri: string;
  _id?: string;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  county: string;
  eircode: string;
}

export interface NearestUniversity {
  name: string;
  address: Address;
  distance: number; // meters
  avgTimeByCar: number; // mins
}

export interface Property {
  _id?: string;
  price: number;
  isRented: boolean;
  availability: 'immediately' | 'available_from';
  availableFrom?: string;
  description: string;
  shortDescription: string;
  propertyType: string;
  singleBedrooms: number | null;
  doubleBedrooms: number | null;
  bathrooms: number | null;
  images: Image[];
  houseAddress: Address;
  nearestUniversity?: NearestUniversity;
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
