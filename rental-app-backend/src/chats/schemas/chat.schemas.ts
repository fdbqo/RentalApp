import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from 'src/auth/user.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Chat {

    @Prop({ required: true })
    content: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true })
    sender_id: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
    room_id: any;

    @Prop({ default: false })
    isRead: boolean;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
