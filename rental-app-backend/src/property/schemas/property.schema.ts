import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ collection: 'listings' })
export class Property {
  @Prop()
  price: string;

  @Prop()
  availability: boolean;

  @Prop()
  description: string;

  @Prop()
  shortDescription: string;

  @Prop()
  propertyType: string;

  @Prop()
  roomsAvailable: number;

  @Prop()
  bathrooms: number;

  @Prop()
  distanceFromUniversity: number;

  @Prop()
  images: string[];

  @Prop({ type: Object })
  houseAddress: {
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    eircode: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId })
  lenderId: MongooseSchema.Types.ObjectId;
}

export const PropertySchema = SchemaFactory.createForClass(Property);