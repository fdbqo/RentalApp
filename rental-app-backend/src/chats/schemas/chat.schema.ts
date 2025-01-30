import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Property } from "../../property/schemas/property.schema";
import { User } from "../../auth/user.schema";

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Chat {
    @Prop({ required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    senderId: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    receiverId: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true })
    propertyId: Property;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
