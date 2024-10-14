import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { PropertyModule } from './property/property.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PropertyModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ]
})
export class AppModule {}
