import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
class Address {
  @Prop({ required: true })
  addressLine1: string;

  @Prop()
  addressLine2?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  county: string;

  @Prop({ required: true })
  eircode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
