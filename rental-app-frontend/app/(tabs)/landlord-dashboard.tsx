import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, useWindowDimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const properties = [
  {
    id: '1',
    name: 'Dublin Apt',
    price: 1200,
    availability: 'Available now',
  },
  {
    id: '2',
    name: 'Cork House',
    price: 1500,
    availability: 'Available from July',
  },
  {
    id: '3',
    name: 'Galway Studio',
    price: 900,
    availability: 'Available now',
  },
];

const PropertyItem = ({ item }: { item: { id: string; name: string; price: number; availability: string } }) => {
  return (
    <View style={styles.propertyCard}>
      <Text style={styles.propertyTitle}>{item.name}</Text>
      <Text style={styles.propertyPrice}>€{item.price}/month</Text>
      <Text style={styles.propertyAvailability}>{item.availability}</Text>
    </View>
  );
};

export default function LandlordDashboardScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Landlord Dashboard</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Total Properties */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Total Properties: {properties.length}</Text>
      </View>

      {/* Property List */}
      <FlatList
        data={properties}
        renderItem={({ item }) => <PropertyItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={isWeb ? 3 : 1}
        key={isWeb ? 'web' : 'mobile'}
        columnWrapperStyle={isWeb ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
      />

      {/* Button to List Property */}
      <TouchableOpacity
        style={styles.listPropertyButton}
        onPress={() => router.push('/screens/ListPropertyScreen')}
      >
        <Text style={styles.listPropertyButtonText}>List a Property</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsText: {
    fontSize: 18,
    color: '#4a4a4a',
  },
  row: {
    justifyContent: 'space-between',
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 4,
  },
  propertyAvailability: {
    fontSize: 14,
    color: '#00a699',
  },
  listPropertyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  listPropertyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});