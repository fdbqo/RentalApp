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
    setCurrentRoom,
    setMessages,
    setLoading,
    setError,
  } = useChatStore();
  
  const token = useUserStore(state => state.token);

  useEffect(() => {
    if (token) {
      wsService.connect(token);
    }
    
    return () => {
      wsService.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (roomId) {
      setCurrentRoom(roomId);
      setLoading(true);
      
      // Join room and fetch messages
      Promise.all([
        wsService.joinRoom(roomId),
        fetchMessages(roomId)
      ]).catch(error => {
        console.error('Error initializing chat room:', error);
        setError('Failed to load chat room');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [roomId]);

  const fetchMessages = async (roomId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/chats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const messages = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  };

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    try {
      wsService.sendMessage(payload.content, payload.room_id);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  }, []);

  return {
    messages,
    rooms,
    currentRoomId,
    isLoading,
    error,
    sendMessage,
  };
};