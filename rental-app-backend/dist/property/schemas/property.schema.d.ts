import { Document, Schema as MongooseSchema } from 'mongoose';
export type PropertyDocument = Property & Document;
export declare class Property {
    price: number;
    availability: boolean;
    description: string;
    shortDescription: string;
    propertyType: string;
    roomsAvailable: number;
    bathrooms: number;
    distanceFromUniversity: number;
    images: {
        _id: MongooseSchema.Types.ObjectId;
        uri: string;
    }[];
    houseAddress: {
        addressLine1: string;
        addressLine2: string;
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
