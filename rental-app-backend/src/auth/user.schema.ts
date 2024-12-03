import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { AddressSchema } from "./address.schema";

export type UserDocument = User & Document;

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

@Schema({ collection: "users", versionKey: false })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: ["landlord", "tenant"],
  })
  userType: "landlord" | "tenant";

  @Prop()
  phone?: string;

  @Prop({ type: AddressSchema })
  address?: Address;

  @Prop()
  licenseNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
