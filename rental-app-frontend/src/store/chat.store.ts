import { create } from 'zustand';
import { Message, Chat } from '../store/interfaces/Chat';
import { Room } from './interfaces/Room';

interface ChatStore extends Chat {
  // Message actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  
  // Room actions
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  
  // UI state actions
  setCurrentRoom: (roomId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  messages: [],
  rooms: [],
  isLoading: false,
  error: null,
  currentRoomId: null,

  // Message actions
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => {
    console.log('[ChatStore] Adding new message:', message);
    const newState = { 
      messages: [...state.messages, message],
      rooms: state.rooms.map(room => 
        room._id === message.room_id 
          ? {
              ...room,
              lastMessage: {
                content: message.content,
                createdAt: message.createdAt
              }
            }
          : room
      )
    };
    console.log('[ChatStore] Updated state:', newState);
    return newState;
  }),

  // Room actions
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),

  // UI state actions
  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));