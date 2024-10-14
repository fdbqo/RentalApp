import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, useWindowDimensions, Modal, Platform } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

type PropertyCard = {
  id: string;
  name: string;
  price: number;
  image: string;
  availability: string;
  description: string;
  propertyType: string;
  rooms: number;
  bathrooms: number;
  distanceFromUniversity: number;
};

const propertyData: PropertyCard[] = [
  {
    id: '1',
    name: 'Dublin Apt',
    price: 1200,
    image: 'https://archipro.com.au/assets/article/building/Form-Apartments-Port-Coogee-by-Stiebel-Eltron--v2.jpg?raw=1',
    availability: 'Available now',
    description: 'Modern apartment in the heart of Dublin',
    propertyType: 'Whole apartment',
    rooms: 2,
    bathrooms: 1,
    distanceFromUniversity: 0.5,
  },
  {
    id: '2',
    name: 'Cork House',
    price: 1500,
    image: 'https://www.thespruce.com/thmb/BpZG-gG2ReQwYpzrQg302pezLr0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Stocksy_txp3d216bb1tUq300_Medium_4988078-56c96ac19def4bf8ba430cf5063b6b38.jpg',
    availability: 'Available from July',
    description: 'Spacious house with garden in Cork',
    propertyType: 'Whole house',
    rooms: 3,
    bathrooms: 2,
    distanceFromUniversity: 1.2,
  },
  {
    id: '3',
    name: 'Galway Studio',
    price: 900,
    image: 'https://housingireland.ie/wp-content/uploads/2019/05/Apartment_Living_1.jpg',
    availability: 'Available now',
    description: 'Cozy studio apartment in Galway city center',
    propertyType: 'Studio',
    rooms: 1,
    bathrooms: 1,
    distanceFromUniversity: 0.3,
  },
  {
    id: '4',
    name: 'Limerick Loft',
    price: 1100,
    image: 'https://b740574.smushcdn.com/740574/wp-content/uploads/2023/03/Linea-45.jpg?lossy=1&strip=1&webp=1',
    availability: 'Available from August',
    description: 'Stylish loft apartment in Limerick',
    propertyType: 'Whole apartment',
    rooms: 2,
    bathrooms: 1,
    distanceFromUniversity: 0.8,
  }
];

const PropertyCard = ({ item, isWeb }: { item: PropertyCard; isWeb: boolean }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.card, isWeb && styles.webCard, isPressed && styles.pressedCard]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardPropertyType}>{item.propertyType}</Text>
        <Text style={styles.cardPrice}>€{item.price}/month</Text>
        <Text style={styles.cardAvailability}>{item.availability}</Text>
        <View style={styles.cardDetails}>
          <View style={styles.cardDetailItem}>
            <FontAwesome5 name="bed" size={16} color="#4a4a4a" />
            <Text style={styles.cardDetailText}>{item.rooms} rooms</Text>
          </View>
          <View style={styles.cardDetailItem}>
            <FontAwesome5 name="bath" size={16} color="#4a4a4a" />
            <Text style={styles.cardDetailText}>{item.bathrooms} bathrooms</Text>
          </View>
          <View style={styles.cardDetailItem}>
            <FontAwesome5 name="university" size={16} color="#4a4a4a" />
            <Text style={styles.cardDetailText}>{item.distanceFromUniversity} km</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    minRooms: 1,
    maxDistance: 5,
  });
  const [filteredData, setFilteredData] = useState(propertyData);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const applyFilters = () => {
    const filtered = propertyData.filter(item => 
      item.price >= filters.minPrice &&
      item.price <= filters.maxPrice &&
      item.rooms >= filters.minRooms &&
      item.distanceFromUniversity <= filters.maxDistance
    );
    setFilteredData(filtered);
    setIsFilterModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.recommendedHeader}>
        <Text style={styles.recommendedTitle}>Recommended for you</Text>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <Feather name="sliders" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <PropertyCard
            item={item}
            isWeb={isWeb}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={isWeb ? 3 : 1}
        key={isWeb ? 'web' : 'mobile'}
        columnWrapperStyle={isWeb ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            
            <Text style={styles.filterLabel}>Minimum Price: €{filters.minPrice}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={2000}
              step={50}
              value={filters.minPrice}
              onValueChange={(value) => setFilters({...filters, minPrice: value})}
            />
            
            <Text style={styles.filterLabel}>Maximum Price: €{filters.maxPrice}</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={2000}
              step={50}
              value={filters.maxPrice}
              onValueChange={(value) => setFilters({...filters, maxPrice: value})}
            />
            
            <Text style={styles.filterLabel}>Minimum Rooms: {filters.minRooms}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={1}
              value={filters.minRooms}
              onValueChange={(value) => setFilters({...filters, minRooms: value})}
            />
            
            <Text style={styles.filterLabel}>Maximum Distance from University: {filters.maxDistance} km</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={0.5}
              value={filters.maxDistance}
              onValueChange={(value) => setFilters({...filters, maxDistance: value})}
            />
            
            <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
              <Text style={styles.filterButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsFilterModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webCard: {
    width: '32%',
  },
  pressedCard: {
    transform: [{ scale: 0.98 }],
  },
  cardImage: {
    width: '100%',
    height: 250,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 4,
  },
  cardAvailability: {
    fontSize: 14,
    color: '#00a699',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4a4a4a',
    marginBottom: 8,
  },
  cardPropertyType: {
    fontSize: 14,
    color: '#4a4a4a',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDetailText: {
    fontSize: 12,
    color: '#4a4a4a',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  filterButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});