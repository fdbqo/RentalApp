import React from "react";
import { XStack, Text, Avatar } from "tamagui";
import { useChatStore } from "../../store/chat.store";
import { useUserStore } from "../../store/user.store";

const ChatHeader = ({ roomId }: { roomId: string }) => {
  const { rooms } = useChatStore();
  const currentUser = useUserStore(state => state.user);
  const room = rooms.find(r => r._id === roomId);

  if (!room) return null;

  const otherUser = room.members.find(m => m._id !== currentUser?._id);

  return (
    <XStack
      padding="$3"
      borderBottomWidth={1}
      borderColor="$borderColor"
      alignItems="center"
      gap="$3"
    >
      <Text fontWeight="bold" fontSize="$5">
        {otherUser?.firstName || room.name}
      </Text>
    </XStack>
  );
};

export default ChatHeader;