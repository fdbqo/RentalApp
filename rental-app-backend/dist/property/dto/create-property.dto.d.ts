declare class HouseAddressDto {
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    eircode: string;
}
declare class ImageDto {
    id: string;
    uri: string;
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
    images: ImageDto[];
    houseAddress: HouseAddressDto;
    lenderId: string;
}
export {};
