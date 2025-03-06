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
  const { properties, deleteProperty, updateProperty } = usePropertyStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
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

  const handleToggleRentedStatus = async () => {
    try {
      setIsUpdating(true);
      await updateProperty(id as string, { isRented: !property.isRented });
      setIsUpdating(false);
    } catch (error) {
      console.error("Failed to update property status:", error);
      setIsUpdating(false);
    }
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        <NavigationHeader title="Manage Property" />

        <ScrollView showsVerticalScrollIndicator={false} padding="$4">
          {/* Images */}
          {property.images && property.images.length > 0 && (
            <Card
              elevate
              bordered
              borderRadius="$6"
              backgroundColor="white"
              padding="$4"
              marginBottom="$4"
              shadowColor={rentalAppTheme.textDark}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.1}
              shadowRadius={8}
            >
              <YStack space="$4">
                <XStack space="$2" alignItems="center">
                  <Card
                    backgroundColor={`${rentalAppTheme.primaryDark}10`}
                    padding="$2"
                    borderRadius="$4"
                  >
                    <Feather
                      name="image"
                      size={20}
                      color={rentalAppTheme.primaryDark}
                    />
                  </Card>
                  <Text
                    fontSize="$6"
                    fontWeight="bold"
                    color={rentalAppTheme.textDark}
                  >
                    Images
                  </Text>
                </XStack>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack space="$2">
                    {property.images.map((image, index) => (
                      <Card
                        key={`${image.uri}-${index}`}
                        elevate
                        bordered
                        borderRadius="$4"
                        overflow="hidden"
                      >
                        <Image
                          source={{
                            uri: image.uri,
                            cache: "force-cache",
                          }}
                          style={{
                            width: 200,
                            height: 150,
                            borderRadius: 8,
                          }}
                        />
                      </Card>
                    ))}
                  </XStack>
                </ScrollView>
              </YStack>
            </Card>
          )}

          {/* Property Details */}
          <Card
            elevate
            bordered
            borderRadius="$6"
            backgroundColor="white"
            padding="$4"
            marginBottom="$4"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={8}
          >
            <YStack space="$4">
              <XStack space="$2" alignItems="center">
                <Card
                  backgroundColor={`${rentalAppTheme.primaryDark}10`}
                  padding="$2"
                  borderRadius="$4"
                >
                  <Feather
                    name="home"
                    size={20}
                    color={rentalAppTheme.primaryDark}
                  />
                </Card>
                <Text
                  fontSize="$6"
                  fontWeight="bold"
                  color={rentalAppTheme.textDark}
                >
                  Property Details
                </Text>
              </XStack>

              <YStack space="$3">
                <Text
                  fontSize={20}
                  fontWeight="bold"
                  color={rentalAppTheme.textDark}
                >
                  {property.shortDescription}
                </Text>

                <XStack space="$2" alignItems="center">
                  <Card
                    backgroundColor={property.isRented ? "$red2" : "$green2"}
                    padding="$2"
                    borderRadius="$4"
                  >
                    <XStack space="$2" alignItems="center">
                      <Feather
                        name="check-circle"
                        size={16}
                        color={property.isRented ? "$red9" : "$green9"}
                      />
                      <Text
                        fontSize={14}
                        color={property.isRented ? "$red9" : "$green9"}
                        fontWeight="500"
                      >
                        {property.isRented ? "Rented" : "Available"}
                      </Text>
                    </XStack>
                  </Card>
                </XStack>

                <XStack space="$2" alignItems="center">
                  <Card backgroundColor="$gray2" padding="$2" borderRadius="$4">
                    <Feather
                      name="map-pin"
                      size={16}
                      color={rentalAppTheme.textDark}
                    />
                  </Card>
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
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
                  <Card backgroundColor="$gray2" padding="$2" borderRadius="$4">
                    <Feather
                      name="dollar-sign"
                      size={16}
                      color={rentalAppTheme.textDark}
                    />
                  </Card>
                  <Text
                    fontSize={16}
                    fontWeight="600"
                    color={rentalAppTheme.textDark}
                  >
                    €{property.price.toLocaleString()}
                    <Text fontSize={16} color={rentalAppTheme.textDark}>
                      /month
                    </Text>
                  </Text>
                </XStack>

                <XStack space="$2" alignItems="center">
                  <Card backgroundColor="$gray2" padding="$2" borderRadius="$4">
                    <Feather
                      name="home"
                      size={16}
                      color={rentalAppTheme.textDark}
                    />
                  </Card>
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
                  <Card backgroundColor="$gray2" padding="$2" borderRadius="$4">
                    <Feather
                      name="calendar"
                      size={16}
                      color={rentalAppTheme.textDark}
                    />
                  </Card>
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    {property.availability === "available_from" &&
                    property.availableFrom
                      ? `Available from ${property.availableFrom}`
                      : "Available immediately"}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Description */}
          <Card
            elevate
            bordered
            borderRadius="$6"
            backgroundColor="white"
            padding="$4"
            marginBottom="$4"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.1}
            shadowRadius={8}
          >
            <YStack space="$4">
              <XStack space="$2" alignItems="center">
                <Card
                  backgroundColor={`${rentalAppTheme.primaryDark}10`}
                  padding="$2"
                  borderRadius="$4"
                >
                  <Feather
                    name="file-text"
                    size={20}
                    color={rentalAppTheme.primaryDark}
                  />
                </Card>
                <Text
                  fontSize="$6"
                  fontWeight="bold"
                  color={rentalAppTheme.textDark}
                >
                  Description
                </Text>
              </XStack>
              <Text fontSize={16} color={rentalAppTheme.textDark}>
                {property.description}
              </Text>
            </YStack>
          </Card>

          {/* Action Buttons */}
          <YStack space="$3" marginBottom="$8">
            {/* Edit Button */}
            <Button
              backgroundColor={rentalAppTheme.primaryDark}
              pressStyle={{
                backgroundColor: rentalAppTheme.primaryDarkPressed,
              }}
              borderRadius="$6"
              size="$5"
              elevation={4}
              onPress={handleEdit}
            >
              <XStack space="$2" justifyContent="center" alignItems="center">
                <Feather name="edit" size={20} color="white" />
                <Text color="white" fontSize={16} fontWeight="bold">
                  Edit Property
                </Text>
              </XStack>
            </Button>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <Card
                elevate
                bordered
                borderRadius="$6"
                backgroundColor="white"
                padding="$4"
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 4 }}
                shadowOpacity={0.1}
                shadowRadius={8}
                marginBottom="$4"
              >
                <YStack space="$4" alignItems="center">
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
                      borderRadius="$6"
                      size="$4"
                      elevation={4}
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
                      borderRadius="$6"
                      size="$4"
                      elevation={4}
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
                borderRadius="$6"
                size="$5"
                elevation={4}
                onPress={handleDeleteConfirmation}
                disabled={isDeleting}
              >
                <XStack space="$2" justifyContent="center" alignItems="center">
                  <Feather name="trash-2" size={20} color="white" />
                  <Text color="white" fontSize={16} fontWeight="bold">
                    Delete Property
                  </Text>
                </XStack>
              </Button>
            )}

            {/* Toggle Rented Status Button */}
            <Button
              backgroundColor={
                property.isRented
                  ? rentalAppTheme.primaryLight
                  : rentalAppTheme.primaryLight
              }
              pressStyle={{
                backgroundColor: property.isRented
                  ? rentalAppTheme.primaryLightPressed
                  : rentalAppTheme.primaryLightPressed,
              }}
              borderRadius="$6"
              size="$5"
              elevation={4}
              onPress={handleToggleRentedStatus}
              disabled={isUpdating}
            >
              <XStack space="$2" justifyContent="center" alignItems="center">
                <Feather
                  name={property.isRented ? "check-circle" : "check-circle"}
                  size={20}
                  color="white"
                />
                <Text color="white" fontSize={16} fontWeight="bold">
                  {isUpdating
                    ? "Updating..."
                    : property.isRented
                    ? "Mark As Available"
                    : "Mark As Rented"}
                </Text>
              </XStack>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
