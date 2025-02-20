import { RoomType } from '../enums/room-type.enum';
export declare class CreateRoomDto {
    name: string;
    members: string[];
    type: RoomType;
}
