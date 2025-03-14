import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type PropertyDocument = Property & Document;

@Schema({ collection: "listings" })
export class Property {
  @Prop()
  price: number;

  @Prop()
  isRented: boolean;

  @Prop()
  availability: "immediately" | "available_from";

  @Prop()
  availableFrom?: string;

  @Prop()
  description: string;

  @Prop()
  shortDescription: string;

  @Prop()
  propertyType: string;

  @Prop({ required: false })
  singleBedrooms: number | null;

  @Prop({ required: false })
  doubleBedrooms: number | null;

  @Prop({ required: false })
  bathrooms: number | null;

  @Prop({ type: [Object], required: false })
  nearestUniversities?: {
    name: string;
    address: {
      addressLine1: string;
      addressLine2?: string;
      townCity: string;
      county: string;
      eircode?: string;
    };
    distance: number;
    avgTimeByCar: number;
  }[];

  @Prop({ type: [{ _id: MongooseSchema.Types.ObjectId, uri: String }] })
  images: { _id: MongooseSchema.Types.ObjectId; uri: string }[];

  @Prop({ type: Object })
  houseAddress: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    county: string;
    eircode: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId })
  lenderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, required: true })
  listingExpiresAt: Date;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
