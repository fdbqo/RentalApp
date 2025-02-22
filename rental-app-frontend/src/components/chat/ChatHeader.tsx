import React from "react";
import { XStack, Text, Avatar } from "tamagui";
import { useChatStore } from "../../store/chat.store";
import { useUserStore } from "../../store/user.store";
import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { rentalAppTheme } from "@/constants/Colors";
import { router } from "expo-router";

const ChatHeader = ({ roomId }: { roomId: string }) => {
  const { rooms } = useChatStore();
  const currentUser = useUserStore((state) => state.user);
  const room = rooms.find((r) => r._id === roomId);

  if (!room) return null;

  const otherUser = room.members.find((m) => m._id !== currentUser?._id);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#fff",
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Feather
          name="arrow-left"
          size={24}
          color={rentalAppTheme.primaryDark}
        />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          textAlign: "center",
          flex: 1,
        }}
      >
        {otherUser?.firstName || room.name}
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );
};

export default ChatHeader;
