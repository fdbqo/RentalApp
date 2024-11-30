interface Image {
  id: string;
  uri: string;
}

export interface Property {
  _id?: string;
  price: number;
  availability: boolean;
  description: string;
  shortDescription: string;
  propertyType: string;
  roomsAvailable: number;
  bathrooms: number;
  distanceFromUniversity?: number;
  images: Image[];
  houseAddress: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    county: string;
    eircode: string;
  };
  lenderId: string;
  lastUpdated?: string;
}
