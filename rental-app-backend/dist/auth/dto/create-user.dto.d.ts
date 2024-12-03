declare class AddressDto {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    county: string;
    eircode: string;
}
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: "landlord" | "tenant";
    phone?: string;
    licenseNumber?: string;
    address?: AddressDto;
}
export {};
