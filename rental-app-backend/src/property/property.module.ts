import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from './schemas/property.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema, collection: 'listings' }
    ]),
    ConfigModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
})
export class PropertyModule {}