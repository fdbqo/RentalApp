import React, { useEffect, useState } from "react";
import {
  FlatList,
  useWindowDimensions,
  Platform,
  Pressable,
  RefreshControl,
  View,
} from "react-native";
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
  Spinner,
} from "tamagui";
import { useChat } from "../../hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { rentalAppTheme } from "@/constants/Colors";

export default function MessagesScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const router = useRouter();
  const { rooms, isLoading, fetchRooms } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleRoomPress = (roomId: string) => {
    router.push({
      pathname: "../screens/ChatRoomScreen/[roomId]",
      params: { roomId },
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  };

  const filteredRooms = searchQuery
    ? rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (room.lastMessage?.content &&
            room.lastMessage.content
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      )
    : rooms;

  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$10"
        >
          <Spinner size="large" color={rentalAppTheme.primaryDark} />
          <Text color="gray" marginTop="$4">
            Loading conversations...
          </Text>
        </YStack>
      );
    }

    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$10"
      >
        <Feather name="message-circle" size={64} color="#ccc" />
        <Text fontSize={18} fontWeight="500" marginTop="$4" textAlign="center">
          No messages yet
        </Text>
        <Text color="gray" textAlign="center" marginTop="$2">
          Messages from property owners and tenants will appear here
        </Text>
        <Button
          backgroundColor={rentalAppTheme.primaryDark}
          color="white"
          marginTop="$6"
          onPress={() => router.push("../screens/SearchScreen")}
        >
          Browse Properties
        </Button>
      </YStack>
    );
  };

  const getMessagePreview = (content) => {
    if (!content) return "No messages yet";
    return content.length > 40 ? `${content.substring(0, 40)}...` : content;
  };

  return (
    <Theme name="light">
      <StatusBar style="dark" />
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
          padding="$2"
          paddingHorizontal="$3"
          marginBottom="$5"
          borderWidth={1}
          borderColor="rgba(0,0,0,0.1)"
          elevation={1}
        >
          <Feather name="search" size={18} color="#666" />
          <Input
            flex={1}
            fontSize={16}
            placeholder="Search conversations..."
            placeholderTextColor="#999"
            backgroundColor="transparent"
            borderWidth={0}
            focusStyle={{ borderWidth: 0 }}
            paddingLeft="$2"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Button
              variant="outlined"
              padding="$1"
              borderWidth={0}
              onPress={() => setSearchQuery("")}
            >
              <Feather name="x" size={18} color="#999" />
            </Button>
          ) : null}
        </XStack>

        {/* Messages List */}
        {filteredRooms.length === 0 && !isLoading ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredRooms}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[rentalAppTheme.primaryDark]}
                tintColor={rentalAppTheme.primaryDark}
              />
            }
            ItemSeparatorComponent={() =>
              isWeb ? null : <YStack height={12} />
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleRoomPress(item._id)}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <YStack
                  borderRadius={16}
                  backgroundColor="white"
                  padding="$4"
                  style={{
                    width: isWeb ? "100%" : "100%",
                    ...Platform.select({
                      ios: {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                      },
                      android: {
                        elevation: 3,
                      },
                      web: {
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
                      },
                    }),
                  }}
                >
                  <XStack space="$3" alignItems="center">
                    {/* Avatar with Text component for the fallback */}
                    <Avatar circular size="$6">
                      <Avatar.Image
                        source={{
                          uri: `https://i.pravatar.cc/150?u=${item.members[0]._id}`,
                        }}
                      />
                      <Avatar.Fallback
                        backgroundColor={rentalAppTheme.primaryLight}
                      >
                        <Text color="white" fontWeight="bold" fontSize={16}>
                          {item.name.charAt(0).toUpperCase()}
                        </Text>
                      </Avatar.Fallback>
                    </Avatar>

                    {/* Message Details */}
                    <YStack flex={1} justifyContent="center">
                      <XStack
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text
                          fontSize={16}
                          fontWeight="600"
                          color={rentalAppTheme.textDark}
                        >
                          {item.name}
                        </Text>
                        {item.lastMessage && (
                          <Text fontSize={12} color="#666">
                            {formatDistanceToNow(
                              new Date(item.lastMessage.createdAt),
                              { addSuffix: true }
                            )}
                          </Text>
                        )}
                      </XStack>

                      <XStack alignItems="center" marginTop="$1">
                        <Text
                          fontSize={14}
                          color="#666"
                          flexShrink={1}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {getMessagePreview(item.lastMessage?.content)}
                        </Text>

                        {/* Unread indicator - optional, using bracket notation for type safety */}
                        {item["unreadCount"] > 0 && (
                          <XStack
                            backgroundColor={rentalAppTheme.primaryDark}
                            borderRadius="$full"
                            paddingHorizontal="$2"
                            paddingVertical="$1"
                            marginLeft="$2"
                            justifyContent="center"
                            alignItems="center"
                            minWidth={20}
                            height={20}
                          >
                            <Text fontSize={10} color="white" fontWeight="bold">
                              {item["unreadCount"]}
                            </Text>
                          </XStack>
                        )}
                      </XStack>
                    </YStack>

                    <Feather name="chevron-right" size={18} color="#ccc" />
                  </XStack>
                </YStack>
              </Pressable>
            )}
            numColumns={isWeb ? 1 : 1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 16,
              gap: isWeb ? 12 : 0,
            }}
          />
        )}
      </YStack>
    </Theme>
  );
}
