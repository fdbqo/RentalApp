import { create } from "zustand";
import { Message, Chat } from "../store/interfaces/Chat";
import { Room } from "./interfaces/Room";
import { useUserStore } from "./user.store";
import { env } from "../../env";

const API_URL = env.API_URL;

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

  typingUsers: { [roomId: string]: { id: string; name: string }[] };
  setTypingUsers: (
    roomId: string,
    users: { id: string; name: string }[]
  ) => void;
  addTypingUser: (roomId: string, userId: string, username: string) => void;
  removeTypingUser: (roomId: string, userId: string) => void;

  markMessageAsRead: (messageId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  messages: [],
  rooms: [],
  isLoading: false,
  error: null,
  currentRoomId: null,
  typingUsers: {},

  // Message actions
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => {
      console.log("[ChatStore] Adding new message:", message);

      const updatedRooms = state.rooms.map((room) =>
        room._id === message.room_id
          ? {
              ...room,
              lastMessage: {
                content: message.content,
                createdAt: message.createdAt,
              },
            }
          : room
      );

      return {
        messages: [...state.messages, message],
        rooms: updatedRooms,
      };
    }),

  // Room actions
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),

  // UI state actions
  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Create a new chat room
  createRoom: async (landlordId: string, propertyId: string) => {
    try {
      set({ isLoading: true, error: null });
      const token = useUserStore.getState().token;
      const currentUser = useUserStore.getState().user;

      if (!token || !currentUser) {
        throw new Error("User not authenticated");
      }
      const roomsResponse = await fetch(`${API_URL}/rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (roomsResponse.ok) {
        const rooms = await roomsResponse.json();
        const existingRoom = rooms.find((room) =>
          room.members.some((member) => member._id === landlordId)
        );

        if (existingRoom) {
          get().setRooms(rooms);
          return existingRoom;
        }
      }
      const requestBody = {
        members: [landlordId],
        type: "personal",
        name: `Property Chat ${propertyId}`,
      };

      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create chat room: ${errorData}`);
      }

      const room = await response.json();
      get().addRoom(room);
      return room;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create chat room";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  setTypingUsers: (roomId, users) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [roomId]: users },
    })),

  addTypingUser: (roomId, userId, username) =>
    set((state) => {
      // Check if the user is already in the typing list
      const roomTypers = state.typingUsers[roomId] || [];
      if (roomTypers.some((user) => user.id === userId)) {
        return state; // User already in the list, no change needed
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [roomId]: [...roomTypers, { id: userId, name: username }],
        },
      };
    }),

  removeTypingUser: (roomId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [roomId]: (state.typingUsers[roomId] || []).filter(
          (user) => user.id !== userId
        ),
      },
    })),

  markMessageAsRead: (messageId: string) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message._id === messageId ? { ...message, isRead: true } : message
      ),
    })),
}));
