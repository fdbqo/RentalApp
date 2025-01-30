import { IsNotEmpty } from "class-validator";

export class CreateChatDto {
    @IsNotEmpty()
    readonly content: string;

    @IsNotEmpty()
    readonly propertyId: string;

    @IsNotEmpty()
    readonly senderId: string;

    @IsNotEmpty()
    readonly receiverId: string;
}