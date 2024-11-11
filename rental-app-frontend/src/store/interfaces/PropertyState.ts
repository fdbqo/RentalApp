export interface PropertyState {
  name: string;
  price: number;
  availability: string;
  description: string;
  shortDescription: string;
  images: { id: string, imageUrl: string }[];
  houseAddress: {
    houseNumber: string;
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    eircode: string;
  };
  rooms?: number;
  bathrooms?: number;
  distanceFromUniversity?: number;
}
