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
import { router } from "expo-router";
import { useUserStore } from "@/store/user.store";
import { useEffect, useState } from "react";
import { UserAvatar } from '@/components/UserAvatar';

const rentalAppTheme = {
  primaryDark: "#016180",
  primaryLight: "#1abc9c",
  backgroundLight: "#fff",
  accentDarkRed: "#8B0000",
  textDark: "#000",
};

export default function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const fullName = user ? `${user.firstName} ${user.lastName}` : '';

  const formattedAddress = user?.address ? {
    addressLine1: user.address.addressLine1,
    city: user.address.city,
    county: user.address.county,
    eircode: user.address.eircode,
  } : null;

  const handleLogout = () => {
    logout();
  };

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
            {/* Replace the existing Avatar with UserAvatar */}
            {user && (
              <UserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                size={100}
              />
            )}

            {/* Name & Email */}
            <Text
              fontSize={24}
              fontWeight="800"
              color={rentalAppTheme.textDark}
            >
              {fullName}
            </Text>
            <Text fontSize={18} color="gray">
              {user?.email}
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
            {user?.phone && (
              <XStack alignItems="center" space={16}>
                <Feather name="phone" size={20} color={rentalAppTheme.textDark} />
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  {user.phone}
                </Text>
              </XStack>
            )}
            <XStack alignItems="center" space={16}>
              <Feather name="mail" size={20} color={rentalAppTheme.textDark} />
              <Text fontSize={16} color={rentalAppTheme.textDark}>
                {user?.email}
              </Text>
            </XStack>
          </YStack>

          <Separator marginTop={24} marginBottom={24} />

          {/* Address Section */}
          {formattedAddress && (
            <YStack space={12}>
              <Text
                fontSize={20}
                fontWeight="600"
                color={rentalAppTheme.textDark}
              >
                Address
              </Text>
              <Text fontSize={16} color="gray">
                {formattedAddress.addressLine1}
              </Text>
              <Text fontSize={16} color="gray">
                {formattedAddress.city}, {formattedAddress.county}, {formattedAddress.eircode}
              </Text>
            </YStack>
          )}

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
              onPress={handleLogout}
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
