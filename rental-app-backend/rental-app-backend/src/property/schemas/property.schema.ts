import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ collection: 'properties', versionKey: false })
export class Property {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  availability: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  propertyType: string;

  @Prop({ required: true })
  rooms: number;

  @Prop({ required: true })
  bathrooms: number;

  @Prop({ required: true })
  distanceFromUniversity: number;
}

export const PropertySchema = SchemaFactory.createForClass(Property);