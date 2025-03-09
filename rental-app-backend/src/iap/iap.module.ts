import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IAPController } from "./iap.controller";
import { IAPService } from "./iap.service";
import { User, UserSchema } from "../auth/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [IAPController],
  providers: [IAPService],
})
export class IAPModule {} 