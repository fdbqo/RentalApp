import { User } from "./User";

export interface AppointmentMetadata {
  name: string;
  date: Date;
  time: Date;
  status: "pending" | "accepted" | "rejected";
}

export type MessageType = "text" | "appointment";

export interface Message {
  _id: string;
  content: string;
  createdAt: string;
  sender_id: string;
  room_id: string;
  sender?: {
    name: string;
    avatar?: string;
  };
  isRead?: boolean;
  type?: string;
  metadata?: {
    appointment?: AppointmentMetadata;
  };
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
  type?: MessageType;
  metadata?: {
    appointment?: AppointmentMetadata;
  };
}
