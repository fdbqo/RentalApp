import mongoose, { HydratedDocument, Types } from "mongoose";
import { Room } from "src/rooms/schemas/room.schemas";
import { User } from 'src/auth/user.schema';
export type ChatDocument = HydratedDocument<Chat>;
export declare class Chat {
    content: string;
    sender_id: User;
    room_id: Room;
}
export declare const ChatSchema: mongoose.Schema<Chat, mongoose.Model<Chat, any, any, any, mongoose.Document<unknown, any, Chat> & Chat & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Chat, mongoose.Document<unknown, {}, mongoose.FlatRecord<Chat>> & mongoose.FlatRecord<Chat> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
