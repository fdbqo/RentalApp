import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Text, YStack, XStack } from "tamagui";
import dayjs from "dayjs";
import { Feather } from "@expo/vector-icons";
import { rentalAppTheme } from "@/constants/Colors";
import { UserAvatar } from "@/components/UserAvatar";
import { useChatStore } from "@/store/chat.store";

interface MessageBubbleProps {
  message: {
    _id: string;
    content: string;
    createdAt: string;
    sender_id: string;
    sender?: {
      firstName: string;
      name: string;
      avatar?: string;
    };
    isRead?: boolean;
  };
  isCurrentUser: boolean;
}

const { width } = Dimensions.get("window");
const MAX_BUBBLE_WIDTH = width * 0.75;

const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  const formattedTime = dayjs(message.createdAt).format("h:mm A");
  const { rooms } = useChatStore();
  const currentRoom = rooms.find(room => room.members.some(member => member._id === message.sender_id));
  const sender = currentRoom?.members.find(member => member._id === message.sender_id);

  return (
    <XStack
      width="100%"
      marginVertical={6}
      justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
    >
      {!isCurrentUser && (
        <UserAvatar
          firstName={sender?.firstName || ""}
          size={32}
        />
      )}

      <YStack maxWidth={MAX_BUBBLE_WIDTH} marginLeft={!isCurrentUser ? 8 : 0}>
        {isCurrentUser ? (
          <YStack
            backgroundColor={rentalAppTheme.primaryDark}
            paddingHorizontal={12}
            paddingVertical={10}
            borderRadius={18}
            borderTopRightRadius={4}
            elevation={0.5}
          >
            <Text color="white" style={styles.messageText}>
              {message.content}
            </Text>
          </YStack>
        ) : (
          <YStack
            backgroundColor="$gray2"
            paddingHorizontal={12}
            paddingVertical={10}
            borderRadius={18}
            borderTopLeftRadius={4}
            elevation={0.5}
          >
            <Text color="$gray12" style={styles.messageText}>
              {message.content}
            </Text>
          </YStack>
        )}

        <XStack
          alignItems="center"
          justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
          paddingHorizontal={4}
          marginTop={4}
          space="sm"
        >
          <Text color="$gray10" fontSize={10}>
            {formattedTime}
          </Text>

          {isCurrentUser && (
            <Feather
              name="check-circle"
              size={12}
              color={message.isRead ? "#4ade80" : "#94a3b8"}
            />
          )}
        </XStack>
      </YStack>
    </XStack>
  );
};

const styles = StyleSheet.create({
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
});

export default MessageBubble;
