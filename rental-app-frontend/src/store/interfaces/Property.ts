export interface Property {
  _id?: string;
  price: number;
  availability: boolean;
  description: string;
  shortDescription: string;
  propertyType: string;
  roomsAvailable: number;
  bathrooms: number;
  distanceFromUniversity: number;
  images: {
    _id: string;
    uri: string;
  }[];
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