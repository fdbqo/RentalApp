import React from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  Spacer,
  Theme,
  ScrollView,
  Card,
} from "tamagui";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";
import { UserAvatar } from "@/components/UserAvatar";
import { AnimatePresence } from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";

export default function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  const formattedAddress = user?.address
    ? {
        addressLine1: user.address.addressLine1,
        city: user.address.city,
        county: user.address.county,
        eircode: user.address.eircode,
      }
    : null;

  const handleLogout = () => {
    logout();
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" padding="$4">
          <Text fontSize={24} fontWeight="bold" color={rentalAppTheme.textDark}>
            Profile
          </Text>
          <Button variant="outlined" padding="$2" borderWidth={0}>
            <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
          </Button>
        </XStack>

        {/* Main Content ScrollView */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <Card
            bordered
            elevate
            padding="$5"
            marginTop="-$8"
            marginHorizontal="$2"
            borderRadius={20}
            backgroundColor="white"
            shadowColor={rentalAppTheme.textDark}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.1}
            shadowRadius={8}
          >
            <AnimatePresence>
              <YStack alignItems="center" space={16} marginBottom={16}>
                {user && (
                  <YStack padding="$2" borderRadius={100} marginTop="-$8">
                    <UserAvatar
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size={100}
                    />
                  </YStack>
                )}
                <YStack alignItems="center" space={4}>
                  <Text
                    fontSize={24}
                    fontWeight="800"
                    color={rentalAppTheme.textDark}
                  >
                    {fullName}
                  </Text>
                  <Text fontSize={16} color={rentalAppTheme.textLight}>
                    {user?.email}
                  </Text>
                </YStack>
              </YStack>
            </AnimatePresence>
          </Card>

          {/* Info Cards */}
          <YStack space={16} marginTop={24} paddingHorizontal="$2" flex={1}>
            {/* User Type Card */}
            <Card
              bordered
              elevate
              padding="$4"
              borderRadius={16}
              backgroundColor="white"
              animation="bouncy"
              scale={0.97}
              hoverStyle={{ scale: 1 }}
              pressStyle={{ scale: 0.96 }}
              shadowColor={rentalAppTheme.textDark}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
            >
              <XStack alignItems="center" space={12} marginBottom="$3">
                <YStack
                  backgroundColor={`${rentalAppTheme.primaryLight}30`}
                  padding="$2"
                  borderRadius={12}
                >
                  <Feather
                    name="user"
                    size={20}
                    color={rentalAppTheme.primaryDark}
                  />
                </YStack>
                <Text
                  fontSize={18}
                  fontWeight="600"
                  color={rentalAppTheme.textDark}
                >
                  Account Type
                </Text>
              </XStack>
              <XStack
                alignItems="center"
                space={16}
                marginBottom={user?.userType === "landlord" ? 12 : 0}
                paddingLeft="$1"
              >
                <Text
                  fontSize={16}
                  color={rentalAppTheme.textDark}
                  textTransform="capitalize"
                >
                  {user?.userType}
                </Text>
              </XStack>
              {user?.userType === "landlord" && user?.licenseNumber && (
                <XStack alignItems="center" space={16} paddingLeft="$1">
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    License: {user.licenseNumber}
                  </Text>
                </XStack>
              )}
            </Card>

            {/* Contact Card */}
            <Card
              bordered
              elevate
              padding="$4"
              borderRadius={16}
              backgroundColor="white"
              animation="bouncy"
              scale={0.97}
              hoverStyle={{ scale: 1 }}
              pressStyle={{ scale: 0.96 }}
              shadowColor={rentalAppTheme.textDark}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
            >
              <XStack alignItems="center" space={12} marginBottom="$3">
                <YStack
                  backgroundColor={`${rentalAppTheme.primaryLight}30`}
                  padding="$2"
                  borderRadius={12}
                >
                  <Feather
                    name="phone"
                    size={20}
                    color={rentalAppTheme.primaryDark}
                  />
                </YStack>
                <Text
                  fontSize={18}
                  fontWeight="600"
                  color={rentalAppTheme.textDark}
                >
                  Contact Information
                </Text>
              </XStack>
              {user?.phone && (
                <XStack
                  alignItems="center"
                  space={16}
                  marginBottom={12}
                  paddingLeft="$1"
                >
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    {user.phone}
                  </Text>
                </XStack>
              )}
              <XStack alignItems="center" space={16} paddingLeft="$1">
                <Text fontSize={16} color={rentalAppTheme.textDark}>
                  {user?.email}
                </Text>
              </XStack>
            </Card>

            {/* Address Card */}
            {formattedAddress && (
              <Card
                bordered
                elevate
                padding="$4"
                borderRadius={16}
                backgroundColor="white"
                animation="bouncy"
                scale={0.97}
                hoverStyle={{ scale: 1 }}
                pressStyle={{ scale: 0.96 }}
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
              >
                <XStack alignItems="center" space={12} marginBottom="$3">
                  <YStack
                    backgroundColor={`${rentalAppTheme.primaryLight}30`}
                    padding="$2"
                    borderRadius={12}
                  >
                    <Feather
                      name="map-pin"
                      size={20}
                      color={rentalAppTheme.primaryDark}
                    />
                  </YStack>
                  <Text
                    fontSize={18}
                    fontWeight="600"
                    color={rentalAppTheme.textDark}
                  >
                    Address
                  </Text>
                </XStack>
                <YStack space={4} paddingLeft="$1">
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    {formattedAddress.addressLine1}
                  </Text>
                  <Text fontSize={16} color={rentalAppTheme.textLight}>
                    {formattedAddress.city}, {formattedAddress.county}
                  </Text>
                  <Text fontSize={16} color={rentalAppTheme.textLight}>
                    {formattedAddress.eircode}
                  </Text>
                </YStack>
              </Card>
            )}
          </YStack>

          {/* Logout Button */}
          <YStack
            space={12}
            alignItems="center"
            marginTop={32}
            paddingHorizontal="$2"
          >
            <Button
              width="100%"
              height={50}
              backgroundColor={rentalAppTheme.accentDarkRed}
              pressStyle={{
                backgroundColor: "#a80000",
                scale: 0.98,
              }}
              animation="bouncy"
              scale={1}
              borderRadius={16}
              onPress={handleLogout}
              shadowColor={rentalAppTheme.accentDarkRed}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
              shadowRadius={8}
            >
              <XStack space={8} alignItems="center">
                <Feather name="log-out" size={18} color="white" />
                <Text
                  color="white"
                  fontSize={16}
                  fontWeight="bold"
                  textAlign="center"
                >
                  Log Out
                </Text>
              </XStack>
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </Theme>
  );
}