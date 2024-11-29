declare class Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    county: string;
    eircode: string;
}
export declare const AddressSchema: import("mongoose").Schema<Address, import("mongoose").Model<Address, any, any, any, import("mongoose").Document<unknown, any, Address> & Address & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Address, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Address>> & import("mongoose").FlatRecord<Address> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
export {};
