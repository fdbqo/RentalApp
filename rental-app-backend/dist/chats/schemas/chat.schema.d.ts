import mongoose, { HydratedDocument } from "mongoose";
import { Property } from "../../property/schemas/property.schema";
import { User } from "../../auth/user.schema";
export type ChatDocument = HydratedDocument<Chat>;
export declare class Chat {
    content: string;
    senderId: User;
    receiverId: User;
    propertyId: Property;
}
export declare const ChatSchema: mongoose.Schema<Chat, mongoose.Model<Chat, any, any, any, mongoose.Document<unknown, any, Chat> & Chat & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Chat, mongoose.Document<unknown, {}, mongoose.FlatRecord<Chat>> & mongoose.FlatRecord<Chat> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
