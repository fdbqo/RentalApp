import { Types } from 'mongoose';
import { IsNumber, IsBoolean, IsString, IsArray, IsObject, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class HouseAddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  addressLine2: string;

  @IsString()
  @IsNotEmpty()
  townCity: string;

  @IsString()
  @IsNotEmpty()
  county: string;

  @IsString()
  @IsNotEmpty()
  eircode: string;
}

class ImageDto {
  @IsString()
  id: string;

  @IsString()
  uri: string;
}

export class CreatePropertyDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  availability: boolean;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  propertyType: string;

  @IsNumber()
  roomsAvailable: number;

  @IsNumber()
  bathrooms: number;

  @IsNumber()
  distanceFromUniversity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images: ImageDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => HouseAddressDto)
  houseAddress: HouseAddressDto;

  @IsString()
  @IsNotEmpty()
  lenderId: string;
}