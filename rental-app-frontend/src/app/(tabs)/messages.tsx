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
  Input,
  Button,
  Theme,
  Separator,
  Spinner,
  AnimatePresence,
} from "tamagui";
import { useChat } from "../../hooks/useChat";
import { formatDistanceToNow } from "date-fns";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { rentalAppTheme } from "@/constants/Colors";
import { UserAvatar } from "@/components/UserAvatar";
import { useUserStore } from "@/store/user.store";
import { NotificationPopover } from "@/components/NotificationPopover";

const getOtherUser = (room, currentUser) => {
  return room.members?.find(member => member._id !== currentUser?._id);
};

// Helper function to highlight matched text
const HighlightText = ({ text, highlight, style }) => {
  if (!highlight.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
  return (
    <Text style={style}>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <Text key={i} style={{ backgroundColor: 'rgba(255, 222, 173, 0.5)', fontWeight: '600' }}>
            {part}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};

export default function MessagesScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const router = useRouter();
  const { rooms, isLoading, fetchRooms } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const currentUser = useUserStore((state) => state.user);

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
    ? rooms.filter((room) => {
        const query = searchQuery.toLowerCase();
        
        // Check room name
        if (room.name.toLowerCase().includes(query)) {
          return true;
        }
        
        // Check last message content
        if (room.lastMessage?.content && 
            room.lastMessage.content.toLowerCase().includes(query)) {
          return true;
        }
        
        // Check member names
        if (room.members && room.members.length > 0) {
          return room.members.some(member => {
            const firstName = member.firstName || '';
            const lastName = member.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim();
            
            return firstName.toLowerCase().includes(query) || 
                   lastName?.toLowerCase().includes(query) ||
                   fullName.toLowerCase().includes(query);
          });
        }
        
        return false;
      })
    : rooms;

  const clearSearch = () => {
    setSearchQuery("");
  };

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

    if (searchQuery && filteredRooms.length === 0) {
      return (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$10"
        >
          <Feather name="search" size={64} color="#ccc" />
          <Text fontSize={18} fontWeight="500" marginTop="$4" textAlign="center">
            No results found
          </Text>
          <Text color="gray" textAlign="center" marginTop="$2">
            No conversations match "{searchQuery}"
          </Text>
          <Button 
            marginTop="$6"
            backgroundColor={rentalAppTheme.primaryDark}
            color="white"
            onPress={clearSearch}
          >
            Clear search
          </Button>
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
          Messages will appear here
        </Text>
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
          <NotificationPopover />
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
          borderColor={isSearchFocused ? rentalAppTheme.primaryDark : "rgba(0,0,0,0.1)"}
          elevation={1}
          animation="quick"
        >
          <Feather 
            name="search" 
            size={18} 
            color={isSearchFocused ? rentalAppTheme.primaryDark : "#666"} 
          />
          <Input
            flex={1}
            fontSize={16}
            placeholder="Search by name or message..."
            placeholderTextColor="#999"
            backgroundColor="transparent"
            borderWidth={0}
            focusStyle={{ borderWidth: 0 }}
            paddingLeft="$2"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <AnimatePresence>
            {searchQuery ? (
              <Button
                variant="outlined"
                padding="$1"
                borderWidth={0}
                onPress={clearSearch}
                animation="quick"
                enterStyle={{ opacity: 0, scale: 0.8 }}
                exitStyle={{ opacity: 0, scale: 0.8 }}
              >
                <Feather name="x" size={18} color="#999" />
              </Button>
            ) : null}
          </AnimatePresence>
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
            renderItem={({ item }) => {
              const otherUser = getOtherUser(item, currentUser);
              return (
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
                    marginHorizontal="$2"
                    marginTop="$2"
                    style={{
                      width: "auto",
                      flex: 1,
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
                      <UserAvatar
                        firstName={otherUser?.firstName}
                        size={48}
                      />

                      {/* Message Details */}
                      <YStack flex={1} justifyContent="center">
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          {searchQuery ? (
                            <HighlightText
                              text={otherUser?.firstName || item.name}
                              highlight={searchQuery}
                              style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: rentalAppTheme.textDark,
                              }}
                            />
                          ) : (
                            <Text
                              fontSize={16}
                              fontWeight="600"
                              color={rentalAppTheme.textDark}
                            >
                              {otherUser?.firstName || item.name}
                            </Text>
                          )}
                          
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
                          {searchQuery && item.lastMessage?.content ? (
                            <HighlightText
                              text={getMessagePreview(item.lastMessage?.content)}
                              highlight={searchQuery}
                              style={{
                                fontSize: 14,
                                color: '#666',
                                flexShrink: 1,
                              }}
                            />
                          ) : (
                            <Text
                              fontSize={14}
                              color="#666"
                              flexShrink={1}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {getMessagePreview(item.lastMessage?.content)}
                            </Text>
                          )}

                          {/* Unread indicator */}
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
              );
            }}
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
