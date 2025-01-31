import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schemas';
import { ChatsModule } from 'src/chats/chats.module';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
    ChatsModule,
    AuthModule,

  ],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule { }
