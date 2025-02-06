import { create } from 'zustand';
import { Message, Chat, SendMessagePayload } from './interfaces/Chat';
import { Room, CreateRoomPayload } from './interfaces/Room';

interface ChatStore extends Chat {
  // Message actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  
  // Room actions
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  createRoom: (payload: CreateRoomPayload) => Promise<Room>;
  
  // UI state actions
  setCurrentRoom: (roomId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
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
  addMessage: (message) => set((state) => ({ 
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
  })),
  
  sendMessage: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      // This will be implemented when we set up the WebSocket connection
      // The actual message sending will happen through the WebSocket
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to send message', isLoading: false });
    }
  },

  // Room actions
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  createRoom: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('http://localhost:3000/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // We'll need to add authorization header here
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const room = await response.json();
      get().addRoom(room);
      set({ isLoading: false });
      return room;
    } catch (error) {
      set({ error: 'Failed to create room', isLoading: false });
      throw error;
    }
  },

  // UI state actions
  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));