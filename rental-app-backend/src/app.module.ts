import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { PropertyModule } from './property/property.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { RoomsModule } from './rooms/rooms.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PropertyModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    ChatsModule,
    RoomsModule,
    UploadModule
  ]
})
export class AppModule {}