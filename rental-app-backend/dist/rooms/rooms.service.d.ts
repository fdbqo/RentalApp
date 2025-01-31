import { Model, Types } from 'mongoose';
import { Room } from './schemas/room.schemas';
import { CreateRoomDto } from './dto/create-room.dto';
export declare class RoomsService {
    private roomModel;
    constructor(roomModel: Model<Room>);
    create(userId: string, createRoomDto: CreateRoomDto): Promise<import("mongoose").Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getByRequest(userId: string): Promise<(import("mongoose").Document<unknown, {}, Room> & Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
