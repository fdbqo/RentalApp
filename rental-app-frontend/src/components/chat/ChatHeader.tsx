import React from "react";
import { Pressable } from "react-native";
import { XStack, Text } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useChatStore } from "@/store/chat.store";
import { useUserStore } from "@/store/user.store";
import { UserAvatar } from "../UserAvatar";

interface ChatHeaderProps {
  roomId: string;
}

const ChatHeader = ({ roomId }: ChatHeaderProps) => {
  const router = useRouter();
  const { rooms } = useChatStore();
  const currentUser = useUserStore((state) => state.user);
  const currentRoom = rooms.find((room) => room._id === roomId);
  const otherUser = currentRoom?.members?.find(
    (member) => member._id !== currentUser?._id
  );

  const handleBack = () => {
    router.back();
  };

  return (
    <XStack
      backgroundColor="white"
      paddingVertical="$4"
      paddingHorizontal="$4"
      alignItems="center"
      space="$3"
      elevation={3}
    >
      <Pressable onPress={handleBack}>
        <Feather name="chevron-left" size={24} color="#000" />
      </Pressable>

      {otherUser && (
        <XStack flex={1} alignItems="center" space="$3">
          <UserAvatar
            firstName={otherUser.firstName}
            size={40}
          />
          <Text fontSize={16} fontWeight="600">
            {otherUser.firstName}
          </Text>
        </XStack>
      )}
    </XStack>
  );
};

export default ChatHeader;
