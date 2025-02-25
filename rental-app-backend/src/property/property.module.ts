import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from './schemas/property.schema';
import { ChatsModule } from 'src/chats/chats.module';
import { GoogleModule } from '../google/google.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema, collection: 'listings' }
    ]),
    ChatsModule,
    GoogleModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}