import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePropertyStore } from '@/store/property.store';
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
import { rentalAppTheme } from '@/constants/Colors';
import NavigationHeader from '@/components/NavigationHeader';

export default function ManagePropertyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties, deleteProperty } = usePropertyStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const property = properties.find(p => p._id === id);

  if (!property) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Property not found</Text>
      </YStack>
    );
  }

  const handleEdit = () => {
    // router.push({
    //   pathname: "/screens/EditPropertyScreen",
    //   params: { id: id as string }
    // });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProperty(id as string);
      router.back();
    } catch (error) {
      console.error('Failed to delete property:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewApplications = () => {

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
                {property.shortDescription}
              </Text>
              <XStack space="$2" alignItems="center">
                <Feather name="map-pin" size={16} color={rentalAppTheme.textLight} />
                <Text fontSize={16} color={rentalAppTheme.textLight}>
                  {`${property.houseAddress.addressLine1}, ${property.houseAddress.townCity}, ${property.houseAddress.county}`}
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather name="dollar-sign" size={16} color={rentalAppTheme.textLight} />
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  €{property.price.toLocaleString()}/month
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather name="home" size={16} color={rentalAppTheme.textLight} />
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  {`${property.propertyType} • ${property.roomsAvailable} ${
                    property.roomsAvailable === 1 ? 'room' : 'rooms'
                  }`}
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather name="check-circle" size={16} color={rentalAppTheme.textLight} />
                <Text
                  fontSize={16}
                  color={
                    property.availability
                      ? rentalAppTheme.primaryLight
                      : rentalAppTheme.accentDarkRed
                  }
                >
                  {property.availability ? 'Available' : 'Rented'}
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
              disabled={isDeleting}
            >
              <XStack alignItems="center" space="$2">
                <Feather name="trash-2" size={20} color="white" />
                <Text color="white" fontSize={16} fontWeight="bold">
                  {isDeleting ? 'Deleting...' : 'Delete Property'}
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
                {property.description}
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
                    Bathrooms: {property.bathrooms}
                  </Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Feather name="arrow-right" size={16} color={rentalAppTheme.textLight} />
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    Distance from University: {property.distanceFromUniversity} km
                  </Text>
                </XStack>
                <XStack space="$2" alignItems="center">
                  <Feather name="arrow-right" size={16} color={rentalAppTheme.textLight} />
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    Eircode: {property.houseAddress.eircode}
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