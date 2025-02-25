import { Injectable, Logger } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/chat.schemas';
import { Model, Types } from 'mongoose';
import { GetChatDto } from './dto/get-chat.dto';

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
  ) { }

  async create(data: { senderId: string } & CreateChatDto) {
    try {
      this.logger.log(`Creating chat:`, data);
      
      const newChat = new this.chatModel({
        content: data.content,
        sender_id: new Types.ObjectId(data.senderId),
        room_id: data.room_id
      });

      const savedChat = await newChat.save();
      this.logger.log(`Chat created: ${savedChat._id}`);
      
      return savedChat;
    } catch (error) {
      this.logger.error(`Failed to create chat: ${error.message}`);
      throw error;
    }
  }

  async findAll(roomId: string, getChatDto: GetChatDto) {
    const query = {
      room_id: roomId,
    };

    if (getChatDto.last_id) {
      query['_id'] = { $lt: getChatDto.last_id };
    }

    return this.chatModel.find(query).sort({ createdAt: -1 });
  }
}
