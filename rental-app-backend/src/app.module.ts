import * as dotenv from 'dotenv';
dotenv.config();

import { Module } from '@nestjs/common';
import { PropertyModule } from './property/property.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PropertyModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
  ]
})
export class AppModule {}



// AWS Connection function

// @Module({
//   imports: [
//     PropertyModule,
//     MongooseModule.forRoot(process.env.MONGO_URI, {
//       tls: true,
//       tlsCAFile: process.env.TLS_CA_FILE
//     }),
//     UsersModule,
//   ]
// })