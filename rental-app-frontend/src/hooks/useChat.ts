import { useEffect, useCallback } from 'react';
import { useChatStore } from '../store/chat.store';
import { wsService } from '../services/websocket.service';
import { SendMessagePayload } from '../store/interfaces/Chat';
import { useUserStore } from '../store/user.store';

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
  } = useChatStore();
  
  const token = useUserStore(state => state.token);

  const fetchMessages = useCallback(async (roomId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const messages = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchRooms = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch rooms');

      const rooms = await response.json();
      setRooms(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const sendMessage = useCallback((payload: SendMessagePayload) => {
    try {
      console.log('[useChat] Attempting to send message:', payload);
      wsService.sendMessage(payload.content, payload.room_id);
      console.log('[useChat] Message sent to websocket service');
    } catch (error) {
      console.error('[useChat] Error sending message:', error);
      setError('Failed to send message');
    }
  }, []);

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

  return {
    messages,
    rooms,
    currentRoomId,
    isLoading,
    error,
    sendMessage,
    fetchRooms,
  };
};