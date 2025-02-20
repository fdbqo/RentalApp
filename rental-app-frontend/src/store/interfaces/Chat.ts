import { User } from './User';

export interface Message {
  _id: string;
  content: string;
  sender_id: User;
  room_id: string;
  createdAt: Date;
}

export interface Chat {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentRoomId: string | null;
}

export interface SendMessagePayload {
  content: string;
  room_id: string;
}