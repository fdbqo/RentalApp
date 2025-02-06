import React, { useEffect, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { YStack, Spinner, Text } from "tamagui";
import { useChat } from "../../../hooks/useChat";
import { useUserStore } from "../../../store/user.store";
import MessageBubble from "../../../components/chat/MessageBubble";
import MessageInput from "../../../components/chat/MessageInput";
import ChatHeader from "../../../components/chat/ChatHeader";

const ChatRoomScreen = () => {
  const { roomId } = useLocalSearchParams();
  const router = useRouter();
  const { messages, sendMessage, isLoading, error } = useChat(roomId as string);
  const currentUser = useUserStore(state => state.user);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!roomId) {
      router.back();
    }
  }, [roomId]);

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$red10">{error}</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
    <ChatHeader roomId={String(roomId)} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <MessageBubble 
              message={item} 
              isCurrentUser={item.sender_id._id === currentUser?._id} 
            />
          )}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <MessageInput onSend={(content) => sendMessage({ content, room_id: String(roomId) })} />
      </KeyboardAvoidingView>
    </YStack>
  );
};

export default ChatRoomScreen;