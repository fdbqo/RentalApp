import React from 'react';
import { useRouter } from 'expo-router';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
  Theme,
  Separator,
} from 'tamagui';
import { Feather } from '@expo/vector-icons';
import { rentalAppTheme } from '@/constants/Colors';// Assuming you have exported your theme
import { Property } from '@/store/interfaces/Property';
import NavigationHeader from '@/components/NavigationHeader';

const hardcodedProperty: Property = {
  _id: '12345',
  price: 1200,
  availability: true,
  description: 'A beautiful apartment in the city center with modern amenities and a stunning view.',
  shortDescription: 'Modern City Center Apartment',
  propertyType: 'Apartment',
  roomsAvailable: 2,
  bathrooms: 1,
  distanceFromUniversity: 3,
  images: [],
  houseAddress: {
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    townCity: 'Dublin',
    county: 'Dublin',
    eircode: 'D01 ABC2',
  },
  lenderId: 'landlord123',
  lastUpdated: new Date().toISOString(),
};

export default function ManagePropertyScreen() {
  const router = useRouter();

  const handleEdit = () => {
    // Navigate to an edit screen or open a modal for editing
    // For now, just log to console
    console.log('Edit property');
  };

  const handleDelete = () => {
    // Confirm and delete the property
    // For now, just log to console
    console.log('Delete property');
  };

  const handleViewApplications = () => {
    // Navigate to applications screen
    console.log('View applications');
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        <NavigationHeader title="Manage Property" />

        <ScrollView showsVerticalScrollIndicator={false} padding="$4">
          {/* Property Details */}
          <Card
            bordered
            elevate
            padding="$4"
            marginBottom="$4"
            borderRadius="$4"
            backgroundColor="white"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
          >
            <YStack space="$3">
              <Text fontSize={20} fontWeight="bold" color={rentalAppTheme.textDark}>
                {hardcodedProperty.shortDescription}
              </Text>
              <XStack space="$2" alignItems="center">
                <Feather name="map-pin" size={16} color={rentalAppTheme.textLight} />
                <Text fontSize={16} color={rentalAppTheme.textLight}>
                  {`${hardcodedProperty.houseAddress.addressLine1}, ${hardcodedProperty.houseAddress.townCity}, ${hardcodedProperty.houseAddress.county}`}
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather name="dollar-sign" size={16} color={rentalAppTheme.textLight} />
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  €{hardcodedProperty.price.toLocaleString()}/month
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather name="home" size={16} color={rentalAppTheme.textLight} />
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  {`${hardcodedProperty.propertyType} • ${hardcodedProperty.roomsAvailable} ${
                    hardcodedProperty.roomsAvailable === 1 ? 'room' : 'rooms'
                  }`}
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather name="check-circle" size={16} color={rentalAppTheme.textLight} />
                <Text
                  fontSize={16}
                  color={
                    hardcodedProperty.availability
                      ? rentalAppTheme.primaryLight
                      : rentalAppTheme.accentDarkRed
                  }
                >
                  {hardcodedProperty.availability ? 'Available' : 'Rented'}
                </Text>
              </XStack>
            </YStack>
          </Card>

          {/* Action Buttons */}
          <YStack space="$3" marginBottom="$4">
            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
              borderRadius="$4"
              onPress={handleEdit}
            >
              <XStack alignItems="center" space="$2">
                <Feather name="edit" size={20} color="white" />
                <Text color="white" fontSize={16} fontWeight="bold">
                  Edit Property
                </Text>
              </XStack>
            </Button>

            <Button
              backgroundColor={rentalAppTheme.accentDarkRed}
              pressStyle={{ backgroundColor: '#a80000' }}
              borderRadius="$4"
              onPress={handleDelete}
            >
              <XStack alignItems="center" space="$2">
                <Feather name="trash-2" size={20} color="white" />
                <Text color="white" fontSize={16} fontWeight="bold">
                  Delete Property
                </Text>
              </XStack>
            </Button>

            <Button
              backgroundColor={rentalAppTheme.primaryLight}
              pressStyle={{ backgroundColor: rentalAppTheme.primaryDark }}
              borderRadius="$4"
              onPress={handleViewApplications}
            >
              <XStack alignItems="center" space="$2">
                <Feather name="users" size={20} color="white" />
                <Text color="white" fontSize={16} fontWeight="bold">
                  View Applications
                </Text>
              </XStack>
            </Button>
          </YStack>

          {/* Description */}
          <Card
            bordered
            elevate
            padding="$4"
            marginBottom="$4"
            borderRadius="$4"
            backgroundColor="white"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
          >
            <YStack space="$3">
              <Text fontSize={18} fontWeight="bold" color={rentalAppTheme.textDark}>
                Description
              </Text>
              <Text fontSize={16} color={rentalAppTheme.textLight}>
                {hardcodedProperty.description}
              </Text>
            </YStack>
          </Card>

          {/* Additional Property Info */}
          <Card
            bordered
            elevate
            padding="$4"
            marginBottom="$4"
            borderRadius="$4"
            backgroundColor="white"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
          >
            <YStack space="$3">
              <Text fontSize={18} fontWeight="bold" color={rentalAppTheme.textDark}>
                Property Details
              </Text>
              <YStack space="$2">
                <XStack space="$2" alignItems="center">
                  <Feather name="arrow-right" size={16} color={rentalAppTheme.textLight} />
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    Bathrooms: {hardcodedProperty.bathrooms}
                  </Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Feather name="arrow-right" size={16} color={rentalAppTheme.textLight} />
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    Distance from University: {hardcodedProperty.distanceFromUniversity} km
                  </Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Feather name="arrow-right" size={16} color={rentalAppTheme.textLight} />
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    Eircode: {hardcodedProperty.houseAddress.eircode}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Placeholder for Images */}
          <Card
            bordered
            elevate
            padding="$4"
            marginBottom="$12"
            borderRadius="$4"
            backgroundColor="white"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={4}
          >
            <YStack space="$3">
              <Text fontSize={18} fontWeight="bold" color={rentalAppTheme.textDark}>
                Images
              </Text>
              <Text fontSize={16} color={rentalAppTheme.textLight}>
                Images here
              </Text>
            </YStack>
          </Card>
        </ScrollView>
      </YStack>
    </Theme>
  );
}