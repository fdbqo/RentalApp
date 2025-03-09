import React, { useEffect, useState } from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  Spacer,
  Theme,
  ScrollView,
  Card,
  Input,
  Dialog,
  Spinner,
  Popover,
} from "tamagui";
import { Feather } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";
import { UserAvatar } from "@/components/UserAvatar";
import { AnimatePresence } from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";
import { Alert, RefreshControl, Platform } from "react-native";
import { useStripe, initStripe } from "@stripe/stripe-react-native";
import axios from "axios";
import { env } from "../../../env";
import { TopUpIAP } from "@/components/TopUpIAP";

export default function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);
  const refreshUserData = useUserStore((state) => state.refreshUserData);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const stripe = useStripe();
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    refreshUserData();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
    } finally {
      setRefreshing(false);
    }
  }, [refreshUserData]);

  // Initialize Stripe
  useEffect(() => {
    if (!env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      console.error("Stripe publishable key is not configured");
      return;
    }

    const init = async () => {
      try {
        await initStripe({
          publishableKey: env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        });
      } catch (error) {
        console.error("Error initializing Stripe:", error);
      }
    };

    init();
  }, []);

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

  const handleTopUp = async () => {
    if (Platform.OS === 'ios') {
      setShowTopUpDialog(true);
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${env.API_URL}/payment/create-payment-intent`,
        { amount: Number(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { clientSecret } = response.data;

      const { error: initError } = await stripe.initPaymentSheet({
        merchantDisplayName: "RentalApp",
        paymentIntentClientSecret: clientSecret,
        returnURL: "rentalapp://stripe-redirect",
      });

      if (initError) {
        console.error("Payment sheet initialization error:", initError);
        Alert.alert("Error", initError.message);
        return;
      }

      const { error: presentError } = await stripe.presentPaymentSheet();

      if (presentError) {
        console.error("Payment presentation error:", presentError);
        Alert.alert("Error", presentError.message);
      } else {
        Alert.alert("Success", "Payment successful!");
        setAmount("");
        setShowTopUpDialog(false);

        setTimeout(async () => {
          try {
            await refreshUserData();
            console.log("User data refreshed successfully");
          } catch (refreshError) {
            console.error("Error refreshing user data:", refreshError);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to process payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" paddingBottom="$2" paddingTop="$4" paddingHorizontal="$4">
          <Text fontSize={24} fontWeight="bold" color={rentalAppTheme.textDark}>
            Profile
          </Text>
          <Popover
            open={notificationOpen}
            onOpenChange={setNotificationOpen}
            placement="bottom"
            size="$5"
          >
            <Popover.Trigger asChild>
              <Button 
                variant="outlined" 
                padding="$2" 
                borderWidth={0}
                onPress={() => setNotificationOpen(true)}
              >
                <Feather name="bell" size={24} color={rentalAppTheme.textDark} />
              </Button>
            </Popover.Trigger>

            <Popover.Content
              borderWidth={1}
              borderColor="$gray4"
              enterStyle={{ y: -10, opacity: 0 }}
              exitStyle={{ y: -10, opacity: 0 }}
              elevate
              animation={[
                'quick',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              width="190%"
              maxWidth={400}
              borderRadius={20}
              backgroundColor="white"
              shadowColor={rentalAppTheme.textDark}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              padding="$5"
              alignSelf="center"
              x={-110}
              y={10}
            >
              <YStack space="$4" minHeight={250} justifyContent="center">
                <YStack alignItems="center" space="$3">
                  <Feather name="inbox" size={32} color={rentalAppTheme.textLight} />
                  <Text 
                    color={rentalAppTheme.textLight} 
                    textAlign="center"
                    fontSize={16}
                  >
                    No new notifications
                  </Text>
                </YStack>
              </YStack>
            </Popover.Content>
          </Popover>
        </XStack>

        {/* Main Content ScrollView */}
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            flexGrow: 1,
            marginTop: 12,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={rentalAppTheme.primaryDark}
              colors={[rentalAppTheme.primaryDark]}
            />
          }
        >
          {/* Profile Card */}
          <Card
            bordered
            elevate
            padding="$3"
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
              <XStack alignItems="center" space={16}>
                {user && (
                  <YStack padding="$2" borderRadius={100} margin="$1">
                    <UserAvatar
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size={80}
                    />
                  </YStack>
                )}
                <YStack space={4}>
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
              </XStack>
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

            {/* Balance Card - Only for Landlords */}
            {user?.userType === "landlord" && (
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
                      name="credit-card"
                      size={20}
                      color={rentalAppTheme.primaryDark}
                    />
                  </YStack>
                  <Text
                    fontSize={18}
                    fontWeight="600"
                    color={rentalAppTheme.textDark}
                  >
                    Balance
                  </Text>
                </XStack>
                <XStack
                  alignItems="center"
                  justifyContent="space-between"
                  paddingLeft="$1"
                >
                  <YStack>
                    <Text
                      fontSize={24}
                      fontWeight="bold"
                      color={rentalAppTheme.textDark}
                    >
                      €{user.balance?.toFixed(2) || "0.00"}
                    </Text>
                    <Text fontSize={14} color={rentalAppTheme.textLight}>
                      Available balance
                    </Text>
                  </YStack>
                  <Button
                    size="$3"
                    circular
                    backgroundColor={`${rentalAppTheme.primaryLight}30`}
                    pressStyle={{
                      backgroundColor: `${rentalAppTheme.primaryLight}50`,
                      scale: 0.97,
                    }}
                    onPress={() => setShowTopUpDialog(true)}
                    icon={
                      <Feather
                        name="plus"
                        size={20}
                        color={rentalAppTheme.primaryDark}
                      />
                    }
                  />
                </XStack>
              </Card>
            )}

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

        {/* Top Up Dialog */}
        <Dialog open={showTopUpDialog} onOpenChange={setShowTopUpDialog}>
          <Dialog.Portal>
            <Dialog.Overlay
              key="overlay"
              animation="quick"
              opacity={0.5}
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
              backgroundColor="rgba(0, 0, 0, 0.5)"
            />
            <Dialog.Content
              bordered
              elevate
              key="content"
              animation={[
                "quick",
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              padding="$5"
              borderRadius={20}
              backgroundColor="white"
              width={350}
              shadowColor={rentalAppTheme.textDark}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.15}
              shadowRadius={16}
            >
              <YStack space="$4">
                <YStack space="$2">
                  <Text
                    fontSize={24}
                    fontWeight="700"
                    color={rentalAppTheme.textDark}
                  >
                    Top Up Balance
                  </Text>
                  <Text fontSize={16} color={rentalAppTheme.textLight}>
                    {Platform.OS === 'ios' 
                      ? 'Select a top-up amount'
                      : 'Enter the amount you want to add'
                    }
                  </Text>
                </YStack>

                {Platform.OS === 'ios' ? (
                  <TopUpIAP onSuccess={() => setShowTopUpDialog(false)} />
                ) : (
                  <>
                    <Card
                      bordered
                      padding="$3"
                      borderRadius={16}
                      backgroundColor={`${rentalAppTheme.primaryLight}10`}
                      borderColor={`${rentalAppTheme.primaryLight}30`}
                    >
                      <XStack alignItems="center" space="$2">
                        <Text
                          fontSize={24}
                          fontWeight="bold"
                          color={rentalAppTheme.textDark}
                        >
                          €
                        </Text>
                        <Input
                          flex={1}
                          placeholder="0.00"
                          keyboardType="decimal-pad"
                          value={amount}
                          onChangeText={setAmount}
                          borderWidth={0}
                          backgroundColor="transparent"
                          fontSize={24}
                          fontWeight="bold"
                          color={rentalAppTheme.textDark}
                          placeholderTextColor={`${rentalAppTheme.textLight}50`}
                        />
                      </XStack>
                    </Card>

                    <YStack space="$3" marginTop="$2">
                      <Button
                        backgroundColor={rentalAppTheme.primaryDark}
                        pressStyle={{
                          backgroundColor: rentalAppTheme.primaryDarkPressed,
                          scale: 0.98,
                        }}
                        onPress={handleTopUp}
                        disabled={isLoading}
                        borderRadius={12}
                        height={50}
                      >
                        {isLoading ? (
                          <XStack space="$2" alignItems="center">
                            <Spinner color="white" />
                            <Text color="white" fontSize={16} fontWeight="600">
                              Processing...
                            </Text>
                          </XStack>
                        ) : (
                          <Text color="white" fontSize={16} fontWeight="600">
                            Confirm Payment
                          </Text>
                        )}
                      </Button>
                    </YStack>
                  </>
                )}

                <Button
                  variant="outlined"
                  borderColor={rentalAppTheme.border}
                  pressStyle={{
                    backgroundColor: `${rentalAppTheme.border}20`,
                    scale: 0.98,
                  }}
                  onPress={() => setShowTopUpDialog(false)}
                  borderRadius={12}
                  height={50}
                >
                  <Text color={rentalAppTheme.textDark} fontSize={16}>
                    Cancel
                  </Text>
                </Button>
              </YStack>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog>
      </YStack>
    </Theme>
  );
}
