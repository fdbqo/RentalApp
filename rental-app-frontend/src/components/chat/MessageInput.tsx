import React, { useState, useRef } from "react";
import { Keyboard, Pressable, StyleSheet, TextInput, Animated, View } from "react-native";
import { XStack, YStack, Text } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { rentalAppTheme } from "@/constants/Colors";

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (message.trim().length === 0) return;
    
    onSend(message.trim());
    setMessage("");
    Keyboard.dismiss();
  };

  const animateSendButton = () => {
    Animated.sequence([
      Animated.timing(sendButtonScale, {
        toValue: 0.8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(sendButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const focusInput = () => {
    inputRef.current?.focus();
    setIsExpanded(true);
  };

  const handleAttachmentPress = () => {
    // Attachment functionality would be implemented here
    console.log("Attachment pressed");
  };

  return (
    <YStack padding={8}>
      <XStack
        alignItems="flex-end"
        backgroundColor="$background"
        paddingHorizontal={8}
        paddingVertical={6}
        borderRadius={24}
        borderWidth={1}
        borderColor={isExpanded ? "$blue8" : "$gray3"}
        space="sm"
      >
        {/* Attachment button */}
        <Pressable 
          style={styles.iconButton} 
          onPress={handleAttachmentPress}
        >
          <Feather name="paperclip" size={20} color="#64748b" />
        </Pressable>
        
        {/* Text input */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          multiline
          maxLength={1000}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
        />
        
        {/* Mic icon - only shown when no text */}
        {message.length === 0 && (
          <Pressable style={styles.iconButton}>
            <Feather name="mic" size={20} color="#64748b" />
          </Pressable>
        )}
        
        {/* Send button */}
        <Animated.View 
          style={{ 
            transform: [{ scale: sendButtonScale }],
            opacity: message.length > 0 ? 1 : 0.5,
          }}
        >
          <Pressable
            style={[
              styles.sendButton,
              { backgroundColor: message.trim().length > 0 ? rentalAppTheme.primaryDark : '#e2e8f0' }
            ]}
            onPress={() => {
              if (message.trim().length > 0) {
                animateSendButton();
                handleSend();
              }
            }}
          >
            <Feather 
              name="send" 
              size={16} 
              color={message.trim().length > 0 ? 'white' : '#94a3b8'} 
            />
          </Pressable>
        </Animated.View>
      </XStack>
      
      {message.length > 100 && (
        <Text 
          fontSize={10} 
          color={message.length > 900 ? "$red9" : "$gray9"}
          textAlign="right"
          paddingTop={4}
          paddingRight={8}
        >
          {message.length}/1000
        </Text>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    fontSize: 16,
    maxHeight: 120,
    color: "#0f172a",
  },
  iconButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageInput;