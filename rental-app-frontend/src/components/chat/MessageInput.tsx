import React, { useState, useRef } from "react";
import { 
  Keyboard, 
  Pressable, 
  StyleSheet, 
  TextInput, 
  Animated, 
  Platform,
  Modal,
  View
} from "react-native";
import { XStack, YStack, Text, Button } from "tamagui";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { rentalAppTheme } from "@/constants/Colors";

interface MessageInputProps {
  onSend: (message: string) => void;
  onSendAppointment: (appointmentData: {
    date: Date;
    time: Date;
    name: string;
  }) => void;
}

interface AppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (date: Date, time: Date, name: string) => void;
}

const AppointmentModal = ({ visible, onClose, onSubmit }: AppointmentModalProps) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [name, setName] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(date, time, name);
      setName("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text fontSize={18} fontWeight="bold" marginBottom={16}>
            Schedule Appointment
          </Text>

          <TextInput
            style={styles.nameInput}
            placeholder="Enter appointment name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#94a3b8"
          />

          <Button
            onPress={() => setShowDatePicker(true)}
            marginVertical={8}
            icon={<Feather name="calendar" size={20} />}
          >
            {date.toLocaleDateString()}
          </Button>

          <Button
            onPress={() => setShowTimePicker(true)}
            marginVertical={8}
            icon={<Feather name="clock" size={20} />}
          >
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>

          {(showDatePicker || showTimePicker) && (
            <DateTimePicker
              value={showDatePicker ? date : time}
              mode={showDatePicker ? 'date' : 'time'}
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                if (event.type === 'set' && selectedDate) {
                  if (showDatePicker) {
                    setDate(selectedDate);
                    setShowDatePicker(false);
                  } else {
                    setTime(selectedDate);
                    setShowTimePicker(false);
                  }
                } else {
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                }
              }}
            />
          )}

          <XStack space="md" marginTop={16}>
            <Button 
              flex={1} 
              variant="outlined" 
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button 
              flex={1} 
              backgroundColor={rentalAppTheme.primaryDark}
              color="white"
              onPress={handleSubmit}
              disabled={!name.trim()}
            >
              Schedule
            </Button>
          </XStack>
        </View>
      </View>
    </Modal>
  );
};

const MessageInput = ({ onSend, onSendAppointment }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (message.trim().length === 0) return;
    onSend(message.trim());
    setMessage("");
    Keyboard.dismiss();
  };

  const handleAppointmentSubmit = (date: Date, time: Date, name: string) => {
    // Combine date and time
    const appointmentTime = new Date(date);
    appointmentTime.setHours(time.getHours(), time.getMinutes());

    onSendAppointment({ date, time: appointmentTime, name });
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
          onPress={() => setShowAppointmentModal(true)}
        >
          <Feather name="calendar" size={20} color="#64748b" />
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

      <AppointmentModal
        visible={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onSubmit={handleAppointmentSubmit}
      />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default MessageInput;