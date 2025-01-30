import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { CreateChatDto } from './dto/create-chat.dto';
import { GetChatDto } from './dto/get-chat.dto';

@Injectable()
export class ChatsService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    ) {}

    async create(createChatDto: CreateChatDto): Promise<Chat> {
        const createdChat = new this.chatModel(createChatDto);
        return createdChat.save();
    }

    async findByProperty(propertyId: string, getChatDto: GetChatDto): Promise<Chat[]> {
        const query: any = { propertyId };

        if (getChatDto.lastId) {
            query._id = { $lt: getChatDto.lastId };
        }

        return this.chatModel
            .find(query)
            .sort({ createdAt: -1 })
            .limit(getChatDto.limit)
            .populate('senderId', 'firstName lastName')
            .populate('receiverId', 'firstName lastName')
            .exec();
    }
}