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
import { UserAvatar } from '@/components/UserAvatar';
import { AnimatePresence } from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";

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
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            flexGrow: 1,
          }}
        >
          {/* Profile Card */}
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
            <AnimatePresence>
              <YStack alignItems="center" space={16} marginBottom={24}>
                {user && (
                  <UserAvatar
                    firstName={user.firstName}
                    lastName={user.lastName}
                    size={120}
                  />
                )}
                <YStack alignItems="center" space={4}>
                  <Text
                    fontSize={28}
                    fontWeight="800"
                    color={rentalAppTheme.textDark}
                  >
                    {fullName}
                  </Text>
                  <Text fontSize={18} color="gray">
                    {user?.email}
                  </Text>
                </YStack>
              </YStack>
            </AnimatePresence>
          </Card>

          {/* Info Cards */}
          <YStack space={16} marginTop={24}>
            {/* Contact Card */}
            <Card
              bordered
              elevate
              padding="$4"
              marginBottom="$4"
              borderRadius="$4"
              backgroundColor="white"
              shadowColor={rentalAppTheme.textDark}
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.05}
              shadowRadius={4}
            >
              <Text
                fontSize={20}
                fontWeight="600"
                color={rentalAppTheme.textDark}
                marginBottom={16}
              >
                Contact Information
              </Text>
              {user?.phone && (
                <XStack alignItems="center" space={16} marginBottom={12}>
                  <Feather name="phone" size={20} color={rentalAppTheme.primaryDark} />
                  <Text fontSize={16} color={rentalAppTheme.textDark}>
                    {user.phone}
                  </Text>
                </XStack>
              )}
              <XStack alignItems="center" space={16}>
                <Feather name="mail" size={20} color={rentalAppTheme.primaryDark} />
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
                marginBottom="$4"
                borderRadius="$4"
                backgroundColor="white"
                shadowColor={rentalAppTheme.textDark}
                shadowOffset={{ width: 0, height: 1 }}
                shadowOpacity={0.05}
                shadowRadius={4}
              >
                <Text
                  fontSize={20}
                  fontWeight="600"
                  color={rentalAppTheme.textDark}
                  marginBottom={16}
                >
                  Address
                </Text>
                <Text fontSize={16} color="gray" marginBottom={8}>
                  {formattedAddress.addressLine1}
                </Text>
                <Text fontSize={16} color="gray">
                  {formattedAddress.city}, {formattedAddress.county}, {formattedAddress.eircode}
                </Text>
              </Card>
            )}
          </YStack>

          <Spacer flex={1} />

          {/* Action Buttons */}
          <YStack space={12} alignItems="center" marginTop={32}>

            <Button
              width="85%"
              height={50}
              backgroundColor={rentalAppTheme.accentDarkRed}
              pressStyle={{ backgroundColor: "#a80000" }}
              borderRadius="$4"
              onPress={handleLogout}
              justifyContent="center"
              alignItems="center"
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
