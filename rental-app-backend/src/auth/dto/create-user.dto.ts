import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class AddressDto {
  @IsNotEmpty()
  addressLine1: string;

  @IsOptional()
  @IsString()
  addressLine2?: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  county: string;

  @IsNotEmpty()
  eircode: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(["landlord", "tenant"], {
    message: "userType must be either landlord or tenant",
  })
  userType: "landlord" | "tenant";

  @IsOptional()
  @IsString()
  phone?: string;

  @ValidateIf((o) => o.userType === "landlord")
  @IsNotEmpty({
    message: "License number is required for landlords",
  })
  @IsString()
  licenseNumber?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ValidateIf((o) => o.userType === "landlord")
  @IsOptional()
  balance?: number;
}
