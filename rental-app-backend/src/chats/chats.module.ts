import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schemas';
import { Room, RoomSchema } from 'src/rooms/schemas/room.schemas';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Room.name, schema: RoomSchema }
    ]),
    AuthModule,
    JwtModule.register({
      secret: 'jwt_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    ChatsGateway,
    ChatsService,
  ],
  exports: [
    ChatsService,
  ],
})
export class ChatsModule {}