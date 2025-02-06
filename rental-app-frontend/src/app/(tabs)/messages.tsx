import React, { useEffect } from "react";
import { FlatList, useWindowDimensions, Platform, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  YStack,
  XStack, 
  Text,
  Avatar,
  Input,
  Button,
  Theme,
  Separator,
} from "tamagui";
import { useChat } from "../../hooks/useChat";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'expo-router';

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

export default function MessagesScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const router = useRouter();
  const { rooms, isLoading } = useChat();

  const handleRoomPress = (roomId: string) => {
    router.push({
      pathname: "../screens/ChatRoomScreen/[roomId]",
      params: { roomId }
    });
  };

  return (
    <Theme name="light">
      <YStack
        flex={1}
        backgroundColor={rentalAppTheme.backgroundLight}
        padding="$4"
      >
        {/* Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text fontSize={24} fontWeight="bold" color={rentalAppTheme.textDark}>
            Messages
          </Text>
          <Button variant="outlined" padding="$2" borderWidth={0}>
            <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
          </Button>
        </XStack>

        {/* Search Bar */}
        <XStack
          alignItems="center"
          backgroundColor="white"
          borderRadius="$6"
          padding="$1"
          paddingHorizontal="$3"
          marginBottom="$4"
          borderWidth={1}
          borderColor="#cccccc"
        >
          <Feather name="search" size={20} color="gray" />
          <Input
            flex={1}
            fontSize={16}
            placeholder="Search messages..."
            placeholderTextColor="gray"
            backgroundColor="transparent"
            borderWidth={0}
            focusStyle={{ borderWidth: 0 }}
          />
        </XStack>

        {/* Messages List */}
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleRoomPress(item._id)}>
              <YStack
                borderRadius={12}
                backgroundColor="#fff"
                padding={16}
                marginBottom={16}
                style={{
                  width: isWeb ? "32%" : "100%",
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 5,
                    },
                    android: {
                      elevation: 6,
                    },
                    web: {
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                    },
                  }),
                }}
              >
                <XStack space="$3" alignItems="center">
                  {/* Avatar */}
                  <Avatar circular size="$5">
                    <Avatar.Image 
                      source={{ 
                        uri: `https://i.pravatar.cc/150?u=${item.members[0]._id}` 
                      }} 
                    />
                  </Avatar>

                  {/* Message Details */}
                  <YStack flex={1}>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text
                        fontSize={16}
                        fontWeight="bold"
                        color={rentalAppTheme.textDark}
                      >
                        {item.name}
                      </Text>
                      {item.lastMessage && (
                        <Text fontSize={12} color="gray">
                          {formatDistanceToNow(new Date(item.lastMessage.createdAt), { addSuffix: true })}
                        </Text>
                      )}
                    </XStack>
                    <Text
                      fontSize={14}
                      color={rentalAppTheme.textDark}
                      marginTop="$1"
                    >
                      {item.lastMessage?.content || 'No messages yet'}
                    </Text>
                  </YStack>

                  {/* Message Icon */}
                  <Feather name="chevron-right" size={20} color="gray" />
                </XStack>
              </YStack>
            </Pressable>
          )}
          numColumns={isWeb ? 3 : 1}
          columnWrapperStyle={
            isWeb
              ? { justifyContent: "space-between", marginBottom: 16 }
              : undefined
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 16,
            paddingVertical: 8,
            paddingHorizontal: 8,
          }}
        />
      </YStack>
    </Theme>
  );
}