import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { usePropertyStore } from "@/store/property.store";
import { YStack, XStack, Text, Button, Card, ScrollView, Theme } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { rentalAppTheme } from "@/constants/Colors";
import NavigationHeader from "@/components/NavigationHeader";
import { Image } from "react-native";

export default function ManagePropertyScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties, deleteProperty } = usePropertyStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const property = properties.find((p) => p._id === id);

  if (!property) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>Property not found</Text>
      </YStack>
    );
  }

  const handleEdit = () => {
    router.push({
      pathname: "/screens/EditPropertyScreen",
      params: { id: id as string },
    });
  };

  const handleDeleteConfirmation = async () => {
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProperty(id as string);
      router.back();
    } catch (error) {
      console.error("Failed to delete property:", error);
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProperty(id as string);
      router.back();
    } catch (error) {
      console.error("Failed to delete property:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewApplications = () => {
    // Handle viewing applications
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        <NavigationHeader title="Manage Property" />

        <ScrollView showsVerticalScrollIndicator={false} padding="$4">
          {/* Images */}
          {property.images && property.images.length > 0 && (
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
                <Text
                  fontSize={18}
                  fontWeight="bold"
                  color={rentalAppTheme.textDark}
                >
                  Images
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack space="$2">
                    {property.images.map((image, index) => (
                      <Image
                        key={`${image.uri}-${index}`}
                        source={{ uri: image.uri }}
                        style={{
                          width: 200,
                          height: 150,
                          borderRadius: 8,
                        }}
                      />
                    ))}
                  </XStack>
                </ScrollView>
              </YStack>
            </Card>
          )}

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
              <Text
                fontSize={20}
                fontWeight="bold"
                color={rentalAppTheme.textDark}
              >
                {property.shortDescription}
              </Text>
              <XStack space="$2" alignItems="center">
                <Feather
                  name="map-pin"
                  size={16}
                  color={rentalAppTheme.textLight}
                />
                <Text fontSize={16} color={rentalAppTheme.textLight}>
                  {`${property.houseAddress.addressLine1}${
                    property.houseAddress.addressLine2
                      ? ", " + property.houseAddress.addressLine2
                      : ""
                  }, ${property.houseAddress.townCity}, ${
                    property.houseAddress.county
                  }, ${property.houseAddress.eircode}`}
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather
                  name="dollar-sign"
                  size={16}
                  color={rentalAppTheme.textLight}
                />
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  €{property.price.toLocaleString()}/month
                </Text>
              </XStack>
              <XStack space="$2" alignItems="center">
                <Feather
                  name="home"
                  size={16}
                  color={rentalAppTheme.textLight}
                />
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  {`${
                    property.propertyType.charAt(0).toUpperCase() +
                    property.propertyType.slice(1)
                  } • ${property.singleBedrooms} ${
                    property.singleBedrooms === 1
                      ? "single bedroom"
                      : "single bedrooms"
                  } • ${property.doubleBedrooms} ${
                    property.doubleBedrooms === 1
                      ? "double bedroom"
                      : "double bedrooms"
                  } • ${property.bathrooms} ${
                    property.bathrooms === 1 ? "bathroom" : "bathrooms"
                  }`}
                </Text>
              </XStack>

              <XStack space="$2" alignItems="center">
                <Feather
                  name="check-circle"
                  size={16}
                  color={rentalAppTheme.textLight}
                />
                <Text
                  fontSize={16}
                  color={
                    property.isRented
                      ? rentalAppTheme.accentDarkRed
                      : rentalAppTheme.primaryLight
                  }
                >
                  {property.availability ? "Rented" : "Available"}
                </Text>
              </XStack>
            </YStack>
          </Card>

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
              <Text
                fontSize={18}
                fontWeight="bold"
                color={rentalAppTheme.textDark}
              >
                Description
              </Text>
              <Text fontSize={16} color={rentalAppTheme.textLight}>
                {property.description}
              </Text>
            </YStack>
          </Card>

          {/* Action Buttons */}
          <YStack space="$3" marginBottom="$12">
            {/* Edit Button */}
            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{
                backgroundColor: rentalAppTheme.primaryDarkPressed,
              }}
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

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <Card
                bordered
                elevate
                padding="$4"
                borderRadius="$4"
                backgroundColor="white"
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
                marginBottom="$4"
              >
                <YStack space="$3" alignItems="center">
                  <Text
                    fontSize={18}
                    fontWeight="bold"
                    textAlign="center"
                    color={rentalAppTheme.textDark}
                  >
                    Are you sure you want to delete this property?
                  </Text>
                  <XStack space="$3" alignItems="center">
                    <Button
                      backgroundColor={rentalAppTheme.accentDarkRed}
                      pressStyle={{ backgroundColor: "#a80000" }}
                      borderRadius="$4"
                      onPress={confirmDelete}
                    >
                      <Text color="white" fontSize={16} fontWeight="bold">
                        Yes, Delete
                      </Text>
                    </Button>
                    <Button
                      backgroundColor={rentalAppTheme.primaryDark}
                      pressStyle={{
                        backgroundColor: rentalAppTheme.primaryDarkPressed,
                      }}
                      borderRadius="$4"
                      onPress={cancelDelete}
                    >
                      <Text color="white" fontSize={16} fontWeight="bold">
                        Cancel
                      </Text>
                    </Button>
                  </XStack>
                </YStack>
              </Card>
            )}

            {/* Delete Button */}
            {!showConfirmDialog && (
              <Button
                backgroundColor={rentalAppTheme.accentDarkRed}
                pressStyle={{ backgroundColor: "#a80000" }}
                borderRadius="$4"
                onPress={handleDeleteConfirmation}
                disabled={isDeleting}
              >
                <XStack alignItems="center" space="$2">
                  <Feather name="trash-2" size={20} color="white" />
                  <Text color="white" fontSize={16} fontWeight="bold">
                    Delete Property
                  </Text>
                </XStack>
              </Button>
            )}

            {/* View Applications Button */}
            <Button
              backgroundColor={rentalAppTheme.primaryLight}
              pressStyle={{
                backgroundColor: rentalAppTheme.primaryLightPressed,
              }}
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
        </ScrollView>
      </YStack>
    </Theme>
  );
}
