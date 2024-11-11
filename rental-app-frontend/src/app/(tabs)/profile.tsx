import React from "react";
import {
  YStack,
  XStack,
  Text,
  Avatar,
  Button,
  Separator,
  Spacer,
  Theme,
  ScrollView,
} from "tamagui";
import { Feather } from "@expo/vector-icons";

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

// Hardcoded user data
const userData = {
  name: "Conor Koritor",
  contactInfo: {
    email: "conor@example.com",
    phoneNumber: "+1234567890",
  },
  address: {
    houseNumber: "123",
    addressLine1: "Main St",
    addressLine2: "Apt 4B",
    townCity: "Sligo",
    county: "Ireland",
    eircode: "F11 D2345",
  },
};

export default function ProfileScreen() {
  const { name, contactInfo, address } = userData;

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        {/* Header */}
        <YStack paddingHorizontal="$4" paddingTop="$4">
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$1"
          >
            <Text
              fontSize={24}
              fontWeight="bold"
              color={rentalAppTheme.textDark}
            >
              Profile
            </Text>
            <Button variant="outlined" padding="$2" borderWidth={0}>
              <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
            </Button>
          </XStack>
        </YStack>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            flexGrow: 1,
          }}
        >
          {/* Profile Content */}
          <YStack alignItems="center" space={16} marginBottom={24}>
            {/* Avatar */}
            <Avatar
              circular
              size="$10"
              backgroundColor={rentalAppTheme.backgroundLight}
            >
              <Avatar.Image
                source={{ uri: "https://via.placeholder.com/150" }}
              />
            </Avatar>

            {/* Name & Email */}
            <Text
              fontSize={24}
              fontWeight="800"
              color={rentalAppTheme.textDark}
            >
              {name}
            </Text>
            <Text fontSize={18} color="gray">
              {contactInfo.email}
            </Text>
          </YStack>

          <Separator />

          {/* Contact Information Section */}
          <YStack space={12} marginTop={24}>
            <Text
              fontSize={20}
              fontWeight="600"
              color={rentalAppTheme.textDark}
            >
              Contact Information
            </Text>
            <XStack alignItems="center" space={16}>
              <Feather name="phone" size={20} color={rentalAppTheme.textDark} />
              <Text fontSize={16} color={rentalAppTheme.textDark}>
                {contactInfo.phoneNumber}
              </Text>
            </XStack>
            <XStack alignItems="center" space={16}>
              <Feather name="mail" size={20} color={rentalAppTheme.textDark} />
              <Text fontSize={16} color={rentalAppTheme.textDark}>
                {contactInfo.email}
              </Text>
            </XStack>
          </YStack>

          <Separator marginTop={24} marginBottom={24} />

          {/* Address Section */}
          <YStack space={12}>
            <Text
              fontSize={20}
              fontWeight="600"
              color={rentalAppTheme.textDark}
            >
              Address
            </Text>
            <Text fontSize={16} color="gray">
              {address.houseNumber} {address.addressLine1},{" "}
              {address.addressLine2}
            </Text>
            <Text fontSize={16} color="gray">
              {address.townCity}, {address.county}, {address.eircode}
            </Text>
          </YStack>

          <Spacer flex={1} />

          {/* Action Buttons */}
          <YStack space={12} alignItems="center" marginTop={20}>
            <Button
              width="70%"
              backgroundColor={rentalAppTheme.primaryDark}
              justifyContent="center"
              alignItems="center"
              borderRadius={8}
            >
              <Feather name="edit" size={18} color="white" />
              <Text fontWeight="600" fontSize={16} color="white">
                Edit Profile
              </Text>
            </Button>

            <Button
              width="70%"
              backgroundColor={rentalAppTheme.accentDarkRed}
              justifyContent="center"
              alignItems="center"
              borderRadius={8}
            >
              <Feather name="log-out" size={18} color="white" />
              <Text fontWeight="600" fontSize={16} color="white">
                Log Out
              </Text>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
