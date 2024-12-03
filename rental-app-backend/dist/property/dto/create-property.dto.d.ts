declare class HouseAddressDto {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    county: string;
    eircode: string;
}
declare class ImageDto {
    uri: string;
}
export declare class CreatePropertyDto {
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
    distanceFromUniversity?: number | null;
    images: ImageDto[];
    houseAddress: HouseAddressDto;
    lenderId: string;
}
export {};
