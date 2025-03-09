import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  RefreshControl,
  Animated,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { YStack, Spinner, Text, Theme, XStack } from "tamagui";
import { useChat } from "../../../hooks/useChat";
import { useUserStore } from "../../../store/user.store";
import MessageBubble from "../../../components/chat/MessageBubble";
import MessageInput from "../../../components/chat/MessageInput";
import ChatHeader from "../../../components/chat/ChatHeader";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { rentalAppTheme } from "@/constants/Colors";
import { AppointmentMetadata } from "@/store/interfaces/Chat";
import { wsService } from "@/services/websocket.service";

const groupMessagesByDate = (messages) => {
  const groups = {};

  messages.forEach((message) => {
    const date = dayjs(message.createdAt).format("YYYY-MM-DD");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date,
    messages,
    id: date,
  }));
};

const DateSeparator = ({ date }) => {
  const today = dayjs().startOf("day");
  const messageDate = dayjs(date).startOf("day");
  const diffDays = today.diff(messageDate, "day");

  let formattedDate;
  if (diffDays === 0) {
    formattedDate = "Today";
  } else if (diffDays === 1) {
    formattedDate = "Yesterday";
  } else if (diffDays < 7) {
    formattedDate = messageDate.format("dddd");
  } else {
    formattedDate = messageDate.format("MMMM D, YYYY");
  }

  return (
    <XStack justifyContent="center" marginVertical={16}>
      <Text
        color="$gray10"
        fontSize={12}
        paddingHorizontal={12}
        paddingVertical={6}
        backgroundColor="$gray1"
        borderRadius={16}
      >
        {formattedDate}
      </Text>
    </XStack>
  );
};

const TypingIndicator = ({ usernames }: { usernames: string[] }) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  if (usernames.length === 0) return null;

  const text =
    usernames.length === 1
      ? `${usernames[0]} is typing...`
      : `${usernames.join(", ")} are typing...`;

  return (
    <View style={styles.typingIndicatorContainer}>
      <Animated.View style={{ opacity }}>
        <Text color="$gray10" fontSize={14} fontStyle="italic">
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const ChatRoomScreen = () => {
  const { roomId } = useLocalSearchParams();
  const router = useRouter();
  const { messages, sendMessage, isLoading, error, typingUsers, handleTyping } =
    useChat(roomId as string);
  const currentUser = useUserStore((state) => state.user);
  const flatListRef = useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!roomId) {
      router.back();
    }
  }, [roomId]);

  useEffect(() => {
    if (roomId && messages.length > 0 && currentUser) {
      messages.forEach((message) => {
        if (!message.isRead && message.sender_id !== currentUser._id) {
          wsService.markMessageAsRead(message._id, roomId as string);
        }
      });
    }
  }, [messages, roomId, currentUser]);

  const handleSendMessage = (content: string) => {
    if (roomId) {
      sendMessage({
        content,
        room_id: roomId as string,
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSendAppointment = (appointmentData: {
    date: Date;
    time: Date;
    name: string;
  }) => {
    const appointmentWithStatus: AppointmentMetadata = {
      ...appointmentData,
      status: "pending",
    };

    sendMessage({
      content: `Appointment Request: ${
        appointmentData.name
      } - ${appointmentData.date.toLocaleDateString()} at ${appointmentData.time.toLocaleTimeString()}`,
      room_id: roomId as string,
      type: "appointment",
      metadata: {
        appointment: appointmentWithStatus,
      },
    });
  };

  const handleMessageInputChange = (text: string) => {
    if (text && roomId) {
      handleTyping(roomId as string);
    }
  };

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const groupedMessages = groupMessagesByDate(sortedMessages);

  if (isLoading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <Spinner size="large" color="$blue10" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
        space="md"
      >
        <Feather name="wifi-off" size={36} color="#f43f5e" />
        <Text color="$red10" fontSize={16} textAlign="center">
          {error}
        </Text>
        <Text
          fontSize={14}
          color="$blue10"
          marginTop={16}
          onPress={() => router.back()}
        >
          Go Back
        </Text>
      </YStack>
    );
  }

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor="$background">
        <ChatHeader roomId={String(roomId)} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={groupedMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[rentalAppTheme.primaryDark]}
                tintColor={rentalAppTheme.primaryDark}
              />
            }
            renderItem={({ item }) => (
              <>
                <DateSeparator date={item.date} />
                {item.messages.map((message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isCurrentUser={message.sender_id === currentUser?._id}
                  />
                ))}
              </>
            )}
            onContentSizeChange={() => {
              if (flatListRef.current && messages.length > 0) {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }
            }}
            ListEmptyComponent={() => (
              <YStack
                flex={1}
                justifyContent="center"
                alignItems="center"
                paddingTop={100}
              >
                <Feather name="message-circle" size={48} color="#cbd5e1" />
                <Text color="$gray10" marginTop={16} textAlign="center">
                  No messages yet.{"\n"}Start the conversation!
                </Text>
              </YStack>
            )}
            ListFooterComponent={
              typingUsers.length > 0 ? (
                <TypingIndicator usernames={typingUsers} />
              ) : null
            }
          />

          <View style={styles.inputWrapper}>
            <MessageInput
              onSend={handleSendMessage}
              onSendAppointment={handleSendAppointment}
              onChangeText={handleMessageInputChange}
            />
          </View>
        </KeyboardAvoidingView>
      </YStack>
    </Theme>
  );
};

const styles = StyleSheet.create({
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },
  inputWrapper: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#f8fafc",
    marginBottom: 20,
  },
  typingIndicatorContainer: {
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 6,
  },
});

export default ChatRoomScreen;
