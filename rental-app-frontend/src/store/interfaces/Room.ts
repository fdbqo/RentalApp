import { User } from './User';

export enum RoomType {
  PERSONAL = 'personal',
  GROUP = 'group'
}

export interface Room {
  _id: string;
  name: string;
  type: RoomType;
  members: User[];
  lastMessage?: {
    content: string;
    createdAt: Date;
  };
}

export interface CreateRoomPayload {
  name?: string;
  members: string[];
  type: RoomType;
}