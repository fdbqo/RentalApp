import { Document } from 'mongoose';
export type PropertyDocument = Property & Document;
export declare class Property {
    name: string;
    price: number;
    image: string;
    availability: string;
    description: string;
    propertyType: string;
    rooms: number;
    bathrooms: number;
    distanceFromUniversity: number;
}
export declare const PropertySchema: import("mongoose").Schema<Property, import("mongoose").Model<Property, any, any, any, Document<unknown, any, Property> & Property & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Property, Document<unknown, {}, import("mongoose").FlatRecord<Property>> & import("mongoose").FlatRecord<Property> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v?: number;
}>;
