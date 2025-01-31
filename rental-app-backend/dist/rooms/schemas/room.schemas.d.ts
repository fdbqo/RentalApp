import mongoose, { Types } from "mongoose";
import { RoomType } from "../enums/room-type.enum";
import { User } from 'src/auth/user.schema';
export declare class Room {
    name: string;
    type: RoomType;
    members: User[];
}
export declare const RoomSchema: mongoose.Schema<Room, mongoose.Model<Room, any, any, any, mongoose.Document<unknown, any, Room> & Room & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Room, mongoose.Document<unknown, {}, mongoose.FlatRecord<Room>> & mongoose.FlatRecord<Room> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class RoomDocument {
    _id: Types.ObjectId;
    name: string;
    type: RoomType;
    members: User[];
    constructor(props: Partial<RoomDocument>);
}
