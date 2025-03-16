import * as dotenv from "dotenv";
dotenv.config();

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./auth/auth.module";
import { PropertyModule } from "./property/property.module";
import { UploadModule } from "./upload/upload.module";
import { ChatsModule } from "./chats/chats.module";
import { RoomsModule } from "./rooms/rooms.module";
import { PaymentModule } from "./payment/payment.module";
import { ConfigModule } from "@nestjs/config";
import { IAPModule } from './iap/iap.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    PropertyModule,
    UploadModule,
    ChatsModule,
    RoomsModule,
    PaymentModule,
    IAPModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
