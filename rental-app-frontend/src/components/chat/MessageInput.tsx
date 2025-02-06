import React, { useState } from "react";
import { XStack, Input, Button } from "tamagui";
import { Feather } from "@expo/vector-icons";

interface MessageInputProps {
  onSend: (content: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <XStack
      padding="$3"
      borderTopWidth={1}
      borderColor="$borderColor"
      alignItems="center"
      gap="$2"
    >
      <Input
        flex={1}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
        onSubmitEditing={handleSend}
      />
      <Button
        icon={<Feather name="send" size={20} color="white" />}
        onPress={handleSend}
        backgroundColor="$blue10"
        hoverStyle={{ backgroundColor: "$blue9" }}
      />
    </XStack>
  );
};

export default MessageInput;