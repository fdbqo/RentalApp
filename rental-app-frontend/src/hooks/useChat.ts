import { useEffect, useCallback } from "react";
import { useChatStore } from "../store/chat.store";
import { wsService } from "../services/websocket.service";
import { SendMessagePayload } from "../store/interfaces/Chat";
import { useUserStore } from "../store/user.store";
import { debounce } from "lodash";
import { env } from "../../env";

export const useChat = (roomId?: string) => {
  const {
    messages,
    rooms,
    currentRoomId,
    isLoading,
    error,
    setMessages,
    setRooms,
    setCurrentRoom,
    setLoading,
    setError,
    typingUsers,
    addTypingUser,
    removeTypingUser,
  } = useChatStore();

  const token = useUserStore((state) => state.token);

  const fetchMessages = useCallback(
    async (roomId: string) => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${env.EXPO_PUBLIC_API_URL}/rooms/${roomId}/chats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const messages = await response.json();
        setMessages(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchRooms = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch rooms");

      const rooms = await response.json();
      setRooms(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const sendMessage = useCallback((payload: SendMessagePayload) => {
    try {
      console.log("[useChat] Attempting to send message:", payload);
      wsService.sendMessage(payload.content, payload.room_id);
      console.log("[useChat] Message sent to websocket service");
    } catch (error) {
      console.error("[useChat] Error sending message:", error);
      setError("Failed to send message");
    }
  }, []);

  const debouncedStopTyping = useCallback(
    debounce((roomId: string) => {
      wsService.sendTypingStatus(roomId, false);
    }, 1000),
    []
  );

  const handleTyping = useCallback(
    (roomId: string) => {
      wsService.sendTypingStatus(roomId, true);
      debouncedStopTyping(roomId);
    },
    [debouncedStopTyping]
  );

  useEffect(() => {
    if (!token) return;

    wsService.connect(token);

    return () => {
      wsService.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (roomId) {
      setCurrentRoom(roomId);
      wsService.joinRoom(roomId);
      fetchMessages(roomId);
    }
  }, [roomId, fetchMessages]);

  useEffect(() => {
    if (!roomId) return;

    const handleUserTyping = (payload: any) => {
      const name = payload.fullName || payload.username;
      addTypingUser(roomId, payload.userId, name);
    };

    const handleUserStopTyping = ({ userId }: { userId: string }) => {
      removeTypingUser(roomId, userId);
    };

    wsService.on("user_typing", handleUserTyping);
    wsService.on("user_stop_typing", handleUserStopTyping);

    return () => {
      wsService.off("user_typing", handleUserTyping);
      wsService.off("user_stop_typing", handleUserStopTyping);
    };
  }, [roomId]);

  return {
    messages,
    rooms,
    currentRoomId,
    isLoading,
    error,
    sendMessage,
    fetchRooms,
    typingUsers: (typingUsers[roomId as string] || []).map((user) => user.name),
    handleTyping,
  };
};
