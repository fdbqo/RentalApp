import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from './schemas/room.schemas';
import { CreateRoomDto } from './dto/create-room.dto';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class RoomsService {
    @WebSocketServer()
    server: Server;

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

        const savedRoom = await (await createdRoom.save())
            .populate('members', 'firstName lastName email');

        // Broadcast to all members that a new room was created
        members.forEach(memberId => {
            this.server?.clients?.forEach(client => {
                const userData = (client as any).userData;
                if (userData?.user?.sub === memberId.toString()) {
                    client.send(JSON.stringify({
                        event: 'room_created',
                        data: savedRoom
                    }));
                }
            });
        });

        return savedRoom;
    }

    async getByRequest(userId: string) {
        return this.roomModel.find({ members: userId })
            .populate('members', 'firstName lastName email')
            .populate('lastMessage')
            .sort({ 'lastMessage.createdAt': -1 })
            .exec();
    }
}
