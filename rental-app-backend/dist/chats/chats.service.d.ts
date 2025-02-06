import { CreateChatDto } from './dto/create-chat.dto';
import { Chat, ChatDocument } from './schemas/chat.schemas';
import { Model, Types } from 'mongoose';
import { GetChatDto } from './dto/get-chat.dto';
export declare class ChatsService {
    private chatModel;
    private readonly logger;
    constructor(chatModel: Model<ChatDocument>);
    create(data: {
        senderId: string;
    } & CreateChatDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, Chat> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(roomId: string, getChatDto: GetChatDto): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Chat> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & import("mongoose").Document<unknown, {}, Chat> & Chat & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
}
