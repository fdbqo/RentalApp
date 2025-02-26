import { User } from "./User";

export enum RoomType {
  PERSONAL = "personal",
  GROUP = "group",
}

export interface Room {
  _id: string;
  name: string;
  type: RoomType;
  members: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  }[];
  lastMessage?: {
    content: string;
    createdAt: string;
    isRead?: boolean;
    sender_id?: string;
  };
}

export interface CreateRoomPayload {
  name?: string;
  members: string[];
  type: RoomType;
}
