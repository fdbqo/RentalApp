import { Document, Schema as MongooseSchema } from "mongoose";
export type PropertyDocument = Property & Document;
export declare class Property {
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
    images: {
        _id: MongooseSchema.Types.ObjectId;
        key: String;
        name: String;
        type: String;
        uri: String;
    }[];
    houseAddress: {
        addressLine1: string;
        addressLine2?: string;
        townCity: string;
        county: string;
        eircode: string;
    };
    lenderId: MongooseSchema.Types.ObjectId;
}
export declare const PropertySchema: MongooseSchema<Property, import("mongoose").Model<Property, any, any, any, Document<unknown, any, Property> & Property & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Property, Document<unknown, {}, import("mongoose").FlatRecord<Property>> & import("mongoose").FlatRecord<Property> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
