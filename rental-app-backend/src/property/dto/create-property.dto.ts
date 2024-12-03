import { IsString, IsNumber, IsArray, IsObject, ValidateNested, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class HouseAddressDto {
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2?: string;

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
  uri: string;
}

export class CreatePropertyDto {
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsNotEmpty()
  isRented: boolean;

  @IsString()
  @IsNotEmpty()
  availability: 'immediately' | 'available_from';

  @IsString()
  @IsOptional()
  availableFrom?: string;

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
  @IsOptional()
  singleBedrooms: number | null;

  @IsNumber()
  @IsOptional()
  doubleBedrooms: number | null;

  @IsNumber()
  @IsOptional()
  bathrooms: number | null;

  @IsNumber()
  @IsOptional()
  distanceFromUniversity?: number | null;

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
