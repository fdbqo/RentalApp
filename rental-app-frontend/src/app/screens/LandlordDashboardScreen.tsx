import React from "react";
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
} from "tamagui";
import { usePropertyStore } from '../../store/property.store';
import { Property } from '../../store/interfaces/Property';

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

const PropertyItem = ({ item }: { item: Property }) => {
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
    >
      <XStack space="$3" padding="$3" alignItems="center">
        <YStack flex={1} space="$1">
          <Text fontSize={16} fontWeight="bold" color={rentalAppTheme.textDark}>
            {item.houseAddress.addressLine1}
          </Text>
          <Text
            fontSize={15}
            color={rentalAppTheme.primaryDark}
            fontWeight="600"
          >
            €{item.price}/month
          </Text>
        </YStack>
        <Text
          fontSize={14}
          color={
            item.availability
              ? rentalAppTheme.primaryLight
              : rentalAppTheme.accentDarkRed
          }
          fontWeight="500"
        >
          {item.availability ? 'Available' : 'Rented'}
        </Text>
      </XStack>
    </Card>
  );
};

export default function LandlordDashboardScreen() {
  const router = useRouter();
  const { properties, isLoading, error, fetchProperties } = usePropertyStore();

  React.useEffect(() => {
    fetchProperties();
  }, []);
  React.useEffect(() => {
  }, [properties, isLoading, error]);

  const totalProperties = properties.length;
  const availableProperties = properties.filter((p) => p.availability).length;
  const rentedProperties = properties.filter((p) => !p.availability).length;

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Loading...</Text>
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="red">{error}</Text>
      </YStack>
    );
  }

  return (
    <Theme name="light">
      <YStack
        flex={1}
        backgroundColor={rentalAppTheme.backgroundLight}
        padding="$4"
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text fontSize={24} fontWeight="bold" color={rentalAppTheme.textDark}>
            Home
          </Text>
          <Button variant="outlined" padding="$2" borderWidth={0}>
            <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
          </Button>
        </XStack>

        <XStack space="$3" marginBottom="$4">
          <StatCard
            title="Total"
            value={totalProperties}
            icon="home"
            color={rentalAppTheme.primaryDark}
          />
          <StatCard
            title="Available"
            value={availableProperties}
            icon="check-circle"
            color={rentalAppTheme.primaryDark}
          />
          <StatCard
            title="Rented"
            value={rentedProperties}
            icon="x-circle"
            color={rentalAppTheme.primaryDark}
          />
        </XStack>

        <Text
          fontSize={18}
          fontWeight="600"
          color={rentalAppTheme.textDark}
          marginBottom="$2"
        >
          Your Properties
        </Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {properties.map((property) => (
            <PropertyItem key={property._id} item={property} />
          ))}
        </ScrollView>

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

const StatCard = ({ title, value, icon, color }) => (
  <Card
    elevate
    bordered
    flex={1}
    borderRadius="$4"
    backgroundColor="white"
    padding="$3"
    shadowColor={rentalAppTheme.textDark}
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.1}
    shadowRadius={4}
  >
    <YStack space="$1" alignItems="center">
      <Feather name={icon} size={24} color={color} />
      <Text fontSize={20} fontWeight="bold" color={color}>
        {value}
      </Text>
      <Text fontSize={14} color={rentalAppTheme.textDark}>
        {title}
      </Text>
    </YStack>
  </Card>
);
