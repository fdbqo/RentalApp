export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: "landlord" | "tenant";
  phone?: string;
  address?: Address;
  licenseNumber?: string; // Required only for landlords
}
