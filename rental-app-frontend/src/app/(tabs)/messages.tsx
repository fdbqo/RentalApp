import React, { useState } from "react";
import { FlatList, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
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

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

// Hardcoded messages
const messages = [
  {
    id: "1",
    sender: "John Doe",
    message: "Hey, is the room still available?",
    avatar: "https://i.pravatar.cc/150?img=11",
    timestamp: "2 hrs ago",
  },
  {
    id: "2",
    sender: "Jane Smith",
    message: "I’m interested in the apartment.",
    avatar: "https://i.pravatar.cc/150?img=5",
    timestamp: "3 hrs ago",
  },
  {
    id: "3",
    sender: "Michael Johnson",
    message: "Can we schedule a viewing?",
    avatar: "https://i.pravatar.cc/150?img=7",
    timestamp: "1 day ago",
  },
];

export default function MessagesScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

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
          data={messages}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Separator />}
          renderItem={({ item }) => (
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
                  <Avatar.Image source={{ uri: item.avatar }} />
                </Avatar>

                {/* Message Details */}
                <YStack flex={1}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text
                      fontSize={16}
                      fontWeight="bold"
                      color={rentalAppTheme.textDark}
                    >
                      {item.sender}
                    </Text>
                    <Text fontSize={12} color="gray">
                      {item.timestamp}
                    </Text>
                  </XStack>
                  <Text
                    fontSize={14}
                    color={rentalAppTheme.textDark}
                    marginTop="$1"
                  >
                    {item.message}
                  </Text>
                </YStack>

                {/* Message Icon */}
                <Feather name="chevron-right" size={20} color="gray" />
              </XStack>
            </YStack>
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
