import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Text, YStack, XStack, Avatar } from "tamagui";
import dayjs from "dayjs";
import { Feather } from "@expo/vector-icons";
import { rentalAppTheme } from "@/constants/Colors";

interface MessageBubbleProps {
  message: {
    _id: string;
    content: string;
    createdAt: string;
    sender_id: string;
    sender?: {
      name: string;
      avatar?: string;
    };
  };
  isCurrentUser: boolean;
}

const { width } = Dimensions.get("window");
const MAX_BUBBLE_WIDTH = width * 0.75;

const MessageBubble = ({ message, isCurrentUser }: MessageBubbleProps) => {
  const formattedTime = dayjs(message.createdAt).format("h:mm A");
  const hasDeliveryReceipt = Math.random() > 0.5; // need to do real backend implementation

  const senderInitial = message.sender?.name 
    ? message.sender.name.charAt(0).toUpperCase() 
    : "U";

  return (
    <XStack 
      width="100%" 
      marginVertical={6}
      justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
    >
      {!isCurrentUser && (
        <Avatar 
          circular 
          size="$3" 
          marginRight={8}
          backgroundColor="$blue5"
        >
          {message.sender?.avatar && (
            <Avatar.Image
              src={message.sender.avatar}
              alt={message.sender.name}
            />
          )}
        </Avatar>
      )}

      <YStack maxWidth={MAX_BUBBLE_WIDTH}>
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
          
          {isCurrentUser && hasDeliveryReceipt && (
            <Feather name="check-circle" size={12} color="#4ade80" />
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