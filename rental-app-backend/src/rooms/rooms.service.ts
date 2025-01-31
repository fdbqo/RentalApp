import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from './schemas/room.schemas';
import { CreateRoomDto } from './dto/create-room.dto';

@Injectable()
export class RoomsService {

    constructor(
        @InjectModel(Room.name) private roomModel: Model<Room>,
    ) { }

    async create(userId: string, createRoomDto: CreateRoomDto) {
        const members = [
          ...createRoomDto.members.map(id => new Types.ObjectId(id)),
          new Types.ObjectId(userId)
        ];
        
        const createdRoom = new this.roomModel({
          ...createRoomDto,
          members,
        });
        return createdRoom.save();
      }

      async getByRequest(userId: string) {
        return this.roomModel.find({ members: userId })
          .populate('members', 'firstName email')
          .exec();
      }
}
