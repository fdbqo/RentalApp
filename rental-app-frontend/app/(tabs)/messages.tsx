import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// hardcoded messages
const messages = [
  { id: '1', sender: 'John Doe', message: 'Hey, is the room still available?' },
  { id: '2', sender: 'Jane Smith', message: 'I’m interested in the apartment.' },
  { id: '3', sender: 'Michael Johnson', message: 'Can we schedule a viewing?' },
];

export default function MessagesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'left',
  },
  messageContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sender: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: '#555',
  },
});