import { Types } from 'mongoose';
declare class HouseAddressDto {
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    eircode: string;
}
export declare class CreatePropertyDto {
    price: number;
    availability: boolean;
    description: string;
    shortDescription: string;
    propertyType: string;
    roomsAvailable: number;
    bathrooms: number;
    distanceFromUniversity: number;
    images: string[];
    houseAddress: HouseAddressDto;
    lenderId: Types.ObjectId;
}
export {};
