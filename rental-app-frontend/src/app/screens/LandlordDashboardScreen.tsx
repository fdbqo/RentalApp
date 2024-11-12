import React from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
  Theme,
  View,
} from "tamagui";

// Theme definition
const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
  textLight: "#666",
  border: "#e2e8f0",
} as const;

// Types
interface Property {
  id: string;
  name: string;
  price: number;
  image: string;
  availability: "Available" | "Rented";
  description: string;
  propertyType: "Apartment" | "House" | "Studio" | "Villa" | "Condo";
  rooms: number;
  bathrooms: number;
  distanceFromUniversity: number;
  location?: string;
  bedrooms?: number;
  lastUpdated?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  subtitle?: string;
}

interface PropertyItemProps {
  item: Property;
  onPress?: () => void;
}

// Enhanced Sample data
const hardcodedProperties: Property[] = [
  {
    id: "1",
    name: "Sunny Apartment",
    price: 1200,
    image:
      "https://www.thespruce.com/thmb/BpZG-gG2ReQwYpzrQg302pezLr0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Stocksy_txp3d216bb1tUq300_Medium_4988078-56c96ac19def4bf8ba430cf5063b6b38.jpg",
    availability: "Available",
    description:
      "A bright and spacious apartment located in the heart of the city.",
    propertyType: "Apartment",
    rooms: 3,
    bathrooms: 2,
    distanceFromUniversity: 1.5,
    location: "City Center",
    bedrooms: 2,
    lastUpdated: "2024-03-15",
  },
  {
    id: "2",
    name: "Cozy Studio",
    price: 800,
    image:
      "https://www.thespruce.com/thmb/BpZG-gG2ReQwYpzrQg302pezLr0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Stocksy_txp3d216bb1tUq300_Medium_4988078-56c96ac19def4bf8ba430cf5063b6b38.jpg",
    availability: "Rented",
    description: "A compact and comfortable studio perfect for singles.",
    propertyType: "Studio",
    rooms: 1,
    bathrooms: 1,
    distanceFromUniversity: 0.8,
    location: "West End",
    bedrooms: 1,
    lastUpdated: "2024-03-10",
  },
  {
    id: "3",
    name: "Spacious Villa",
    price: 2500,
    image:
      "https://www.thespruce.com/thmb/BpZG-gG2ReQwYpzrQg302pezLr0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Stocksy_txp3d216bb1tUq300_Medium_4988078-56c96ac19def4bf8ba430cf5063b6b38.jpg",
    availability: "Available",
    description: "A luxurious villa with a large garden and modern amenities.",
    propertyType: "Villa",
    rooms: 5,
    bathrooms: 4,
    distanceFromUniversity: 3.2,
    location: "Suburbs",
    bedrooms: 4,
    lastUpdated: "2024-03-12",
  },
  {
    id: "4",
    name: "Modern Loft",
    price: 1500,
    image:
      "https://www.thespruce.com/thmb/BpZG-gG2ReQwYpzrQg302pezLr0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Stocksy_txp3d216bb1tUq300_Medium_4988078-56c96ac19def4bf8ba430cf5063b6b38.jpg",
    availability: "Available",
    description: "A stylish loft with open spaces and contemporary design.",
    propertyType: "Apartment",
    rooms: 3,
    bathrooms: 2,
    distanceFromUniversity: 2.0,
    location: "Downtown",
    bedrooms: 2,
    lastUpdated: "2024-03-14",
  },
  {
    id: "5",
    name: "Beachfront Condo",
    price: 2000,
    image:
      "https://www.thespruce.com/thmb/BpZG-gG2ReQwYpzrQg302pezLr0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Stocksy_txp3d216bb1tUq300_Medium_4988078-56c96ac19def4bf8ba430cf5063b6b38.jpg",
    availability: "Rented",
    description:
      "A beautiful condo with stunning sea views and modern facilities.",
    propertyType: "Condo",
    rooms: 4,
    bathrooms: 3,
    distanceFromUniversity: 5.0,
    location: "Beachside",
    bedrooms: 3,
    lastUpdated: "2024-03-11",
  },
];

const PropertyItem: React.FC<PropertyItemProps> = ({ item, onPress }) => {
  const formattedDate = new Date(item.lastUpdated || "").toLocaleDateString();

  return (
    <Card
      bordered
      elevate
      animation="bouncy"
      scale={0.97}
      hoverStyle={{ scale: 1 }}
      pressStyle={{ scale: 0.96 }}
      borderRadius="$4"
      backgroundColor="white"
      marginBottom="$3"
      shadowColor={rentalAppTheme.textDark}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      onPress={onPress}
    >
      <XStack padding="$3" space="$3">
        <YStack flex={1} space="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={16}
              fontWeight="bold"
              color={rentalAppTheme.textDark}
            >
              {item.name}
            </Text>
            <Text
              fontSize={14}
              color={
                item.availability === "Available"
                  ? rentalAppTheme.primaryLight
                  : rentalAppTheme.accentDarkRed
              }
              fontWeight="500"
            >
              {item.availability}
            </Text>
          </XStack>

          <XStack space="$2" alignItems="center">
            <Feather
              name="map-pin"
              size={14}
              color={rentalAppTheme.textLight}
            />
            <Text fontSize={14} color={rentalAppTheme.textLight}>
              {item.location}
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text
              fontSize={15}
              color={rentalAppTheme.primaryDark}
              fontWeight="600"
            >
              €{item.price.toLocaleString()}/month
            </Text>
            <XStack space="$2" alignItems="center">
              <Feather name="home" size={14} color={rentalAppTheme.textLight} />
              <Text fontSize={14} color={rentalAppTheme.textLight}>
                {item.propertyType} • {item.bedrooms}{" "}
                {item.bedrooms === 1 ? "bed" : "beds"}
              </Text>
            </XStack>
          </XStack>

          <XStack space="$2" alignItems="center">
            <Feather name="clock" size={12} color={rentalAppTheme.textLight} />
            <Text fontSize={12} color={rentalAppTheme.textLight}>
              Last updated: {formattedDate}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
}) => (
  <Card
    elevate
    bordered
    flex={1}
    borderRadius="$4"
    backgroundColor="white"
    padding="$2"
    shadowColor={rentalAppTheme.textDark}
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.1}
    shadowRadius={4}
  >
    <YStack space="$1" alignItems="center">
      <Feather name={icon} size={20} color={color} />
      <Text fontSize={18} fontWeight="bold" color={color}>
        {value}
      </Text>
      <Text fontSize={12} color={rentalAppTheme.textDark}>
        {title}
      </Text>
      {subtitle && (
        <Text fontSize={10} color={rentalAppTheme.textLight}>
          {subtitle}
        </Text>
      )}
    </YStack>
  </Card>
);

const RevenueCard: React.FC<{ totalRevenue: number }> = ({ totalRevenue }) => (
  <Card
    elevate
    bordered
    borderRadius="$4"
    backgroundColor={rentalAppTheme.primaryLight}
    padding="$2"
    shadowColor={rentalAppTheme.textDark}
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.1}
    shadowRadius={4}
    marginBottom="$4"
    alignSelf="center" // Centering the card horizontally
    width="100%"
  >
    <XStack alignItems="center" justifyContent="space-around" space="$5" paddingHorizontal="$6">
      <Feather name="dollar-sign" size={24} color="white" />
      
      <Text fontSize={16} fontWeight="bold" color="white">
        Total Revenue:
      </Text>

      <Text fontSize={16} color="white">
        €{totalRevenue.toLocaleString()}/month
      </Text>
    </XStack>
  </Card>
);


export default function LandlordDashboardScreen() {
  const router = useRouter();

  const stats = {
    total: hardcodedProperties.length,
    available: hardcodedProperties.filter((p) => p.availability === "Available")
      .length,
    rented: hardcodedProperties.filter((p) => p.availability === "Rented")
      .length,
    totalRevenue: hardcodedProperties
      .filter((p) => p.availability === "Rented")
      .reduce((sum, p) => sum + p.price, 0),
  };

  const handlePropertyPress = (item: Property) => {
    // Navigate to property details screen, passing the entire property item as params
    router.push({
      pathname: "/screens/PropertyDetailScreen",
      params: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        availability: item.availability,
        description: item.description,
        propertyType: item.propertyType,
        rooms: item.rooms,
        bathrooms: item.bathrooms,
        distanceFromUniversity: item.distanceFromUniversity,
        location: item.location,
        bedrooms: item.bedrooms,
        lastUpdated: item.lastUpdated,
      },
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
          <YStack>
            <Text
              fontSize={24}
              fontWeight="bold"
              color={rentalAppTheme.textDark}
            >
              Dashboard
            </Text>
            <Text fontSize={14} color={rentalAppTheme.textLight}>
              Manage your properties
            </Text>
          </YStack>
          <XStack space="$2">
            <Button variant="outlined" padding="$2" borderWidth={0}>
              <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
            </Button>
          </XStack>
        </XStack>

        {/* Statistics */}
        <XStack space="$3" marginBottom="$4">
          <StatCard
            title="Total"
            value={stats.total}
            icon="home"
            color={rentalAppTheme.primaryDark}
          />
          <StatCard
            title="Available"
            value={stats.available}
            icon="check-circle"
            color={rentalAppTheme.primaryLight}
          />
          <StatCard
            title="Rented"
            value={stats.rented}
            icon="key"
            color={rentalAppTheme.accentDarkRed}
            // Removed subtitle to separate Total Revenue
          />
        </XStack>

        {/* Total Revenue Card */}
        <RevenueCard totalRevenue={stats.totalRevenue} />

        {/* Properties Header */}
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$2"
        >
          <Text fontSize={18} fontWeight="600" color={rentalAppTheme.textDark}>
            Your Properties
          </Text>
          <Button
            variant="outlined"
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$2"
          >
            <XStack space="$1" alignItems="center">
              <Text fontSize={14} color={rentalAppTheme.textDark}>
                Sort
              </Text>
              <Feather
                name="chevron-down"
                size={16}
                color={rentalAppTheme.textDark}
              />
            </XStack>
          </Button>
        </XStack>

        {/* Property List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {hardcodedProperties.map((property) => (
            <PropertyItem
              key={property.id}
              item={property}
              onPress={() => handlePropertyPress(property)}
            />
          ))}
        </ScrollView>

        {/* Add New Property Button */}
        <Button
          onPress={() => router.push("/screens/ListPropertyScreen")}
          backgroundColor={rentalAppTheme.primaryDark}
          pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
          borderRadius="$4"
          marginTop="$4"
        >
          <Text
            color="white"
            fontSize={16}
            fontWeight="bold"
            textAlign="center"
          >
            List a New Property
          </Text>
        </Button>
      </YStack>
    </Theme>
  );
}
