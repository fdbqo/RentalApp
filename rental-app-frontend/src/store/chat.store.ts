import { create } from 'zustand';
import { Message, Chat } from '../store/interfaces/Chat';
import { Room } from './interfaces/Room';
import { useUserStore } from './user.store';

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
  
  // New action
  createRoom: (landlordId: string, propertyId: string) => Promise<Room>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
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

  // New action
  createRoom: async (landlordId: string, propertyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = useUserStore.getState().token;
      const currentUser = useUserStore.getState().user;
      
      if (!token || !currentUser) {
        throw new Error('User not authenticated');
      }

      const requestBody = {
        members: [landlordId],
        type: 'personal',
        name: `Property Chat ${propertyId}`
      };

      const response = await fetch('http://localhost:3000/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to create chat room');
      }

      const room = await response.json();
      get().addRoom(room);
      return room;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat room';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));