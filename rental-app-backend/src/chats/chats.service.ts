import { Injectable, Logger } from "@nestjs/common";
import { CreateChatDto } from "./dto/create-chat.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Chat, ChatDocument } from "./schemas/chat.schemas";
import { Model, Types } from "mongoose";
import { GetChatDto } from "./dto/get-chat.dto";
import { Room } from "src/rooms/schemas/room.schemas";

@Injectable()
export class ChatsService {
  private readonly logger = new Logger(ChatsService.name);

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Room.name) private roomModel: Model<Room>
  ) {}

  async create(data: { senderId: string } & CreateChatDto) {
    try {
      this.logger.log(`Creating chat:`, data);

      const newChat = new this.chatModel({
        content: data.content,
        sender_id: new Types.ObjectId(data.senderId),
        room_id: data.room_id,
      });

      const savedChat = await newChat.save();
      this.logger.log(`Chat created: ${savedChat._id}`);

      // Update the room's lastMessage
      await this.roomModel.findByIdAndUpdate(
        data.room_id,
        { $set: { lastMessage: savedChat._id } }
      );

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
      query["_id"] = { $lt: getChatDto.last_id };
    }

    return this.chatModel.find(query).sort({ createdAt: -1 });
  }

  async markAsRead(messageId: string): Promise<ChatDocument> {
    try {
      this.logger.log(`Marking message as read: ${messageId}`);

      const updatedChat = await this.chatModel.findByIdAndUpdate(
        messageId,
        { $set: { isRead: true } },
        { new: true }
      );

      if (!updatedChat) {
        throw new Error("Message not found");
      }

      this.logger.log(`Message marked as read: ${messageId}`);
      return updatedChat;
    } catch (error) {
      this.logger.error(`Failed to mark message as read: ${error.message}`);
      throw error;
    }
  }
}
