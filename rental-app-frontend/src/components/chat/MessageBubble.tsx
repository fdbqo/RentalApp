import React from "react";
import { YStack, Text, XStack } from "tamagui";
import { Message } from "../../store/interfaces/Chat";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  return (
    <XStack
      justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
      marginVertical="$2"
    >
      <YStack
        backgroundColor={isCurrentUser ? "$blue10" : "$gray5"}
        padding="$3"
        borderRadius="$4"
        maxWidth="80%"
        style={{
          borderBottomRightRadius: isCurrentUser ? 0 : "$4",
          borderBottomLeftRadius: !isCurrentUser ? 0 : "$4",
        }}
      >
        <Text color={isCurrentUser ? "white" : "$color"}>
          {message.content}
        </Text>
        <Text
          fontSize="$1"
          color={isCurrentUser ? "$gray3" : "$gray10"}
          marginTop="$1"
          alignSelf="flex-end"
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </YStack>
    </XStack>
  );
};

export default MessageBubble;