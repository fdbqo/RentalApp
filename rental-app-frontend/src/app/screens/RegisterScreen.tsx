import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  YStack,
  Text,
  Button,
  Input,
  XStack,
  Circle,
  Theme,
} from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";

export default function RegisterScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState("tenant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [eircode, setEircode] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  const handleRegister = () => {
    // Registration logic here
    router.push("/screens/LandlordDashboardScreen");
  };

  return (
    <Theme name="light">
      <YStack
        flex={1}
        padding="$4"
        backgroundColor={rentalAppTheme.backgroundLight}
        justifyContent="center"
      >
        <YStack space="$4">
          <Text
            fontSize={24}
            fontWeight="bold"
            color={rentalAppTheme.textDark}
            textAlign="center"
          >
            Create Account
          </Text>
          <Text
            fontSize={14}
            color={rentalAppTheme.textLight}
            textAlign="center"
          >
            Please fill in the details below
          </Text>

          {/* User Type Selection */}
          <YStack space="$2">
            <Text fontSize={14} color={rentalAppTheme.textDark}>
              Register as
            </Text>
            <XStack space="$4" alignItems="center">
              <XStack alignItems="center" onPress={() => setUserType("tenant")}>
                <Circle
                  size={20}
                  borderWidth={1}
                  borderColor={rentalAppTheme.border}
                  backgroundColor={
                    userType === "tenant"
                      ? rentalAppTheme.primaryDark
                      : "transparent"
                  }
                  marginRight="$2"
                />
                <Text
                  onPress={() => setUserType("tenant")}
                  color={rentalAppTheme.textDark}
                >
                  Tenant
                </Text>
              </XStack>
              <XStack
                alignItems="center"
                onPress={() => setUserType("landlord")}
              >
                <Circle
                  size={20}
                  borderWidth={1}
                  borderColor={rentalAppTheme.border}
                  backgroundColor={
                    userType === "landlord"
                      ? rentalAppTheme.primaryDark
                      : "transparent"
                  }
                  marginRight="$2"
                />
                <Text
                  onPress={() => setUserType("landlord")}
                  color={rentalAppTheme.textDark}
                >
                  Landlord
                </Text>
              </XStack>
            </XStack>
          </YStack>

          {/* Required Fields */}
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />

          {/* Toggle Optional Fields */}
          <Button
            onPress={() => setShowOptional(!showOptional)}
            variant="outlined"
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          >
            <Text color={rentalAppTheme.textDark} fontSize={14}>
              {showOptional ? "Hide Optional Details" : "Optional Details"}
            </Text>
          </Button>

          {/* Optional Fields */}
          {showOptional && (
            <YStack space="$3">
              <Input
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                borderColor={rentalAppTheme.border}
                borderWidth={1}
                padding="$3"
                borderRadius="$4"
              />
              <Input
                placeholder="Address Line"
                value={addressLine}
                onChangeText={setAddressLine}
                borderColor={rentalAppTheme.border}
                borderWidth={1}
                padding="$3"
                borderRadius="$4"
              />
              <Input
                placeholder="City"
                value={city}
                onChangeText={setCity}
                borderColor={rentalAppTheme.border}
                borderWidth={1}
                padding="$3"
                borderRadius="$4"
              />
              <Input
                placeholder="Country"
                value={country}
                onChangeText={setCountry}
                borderColor={rentalAppTheme.border}
                borderWidth={1}
                padding="$3"
                borderRadius="$4"
              />
              <Input
                placeholder="Eircode"
                value={eircode}
                onChangeText={setEircode}
                borderColor={rentalAppTheme.border}
                borderWidth={1}
                padding="$3"
                borderRadius="$4"
              />
            </YStack>
          )}

          <Button
            onPress={handleRegister}
            backgroundColor={rentalAppTheme.primaryDark}
            pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
            borderRadius="$4"
            marginTop="$2"
          >
            <Text
              color="white"
              fontSize={16}
              fontWeight="bold"
              textAlign="center"
            >
              Register
            </Text>
          </Button>

          <Button
            variant="outlined"
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            borderRadius="$4"
            marginTop="$2"
            onPress={() => router.push("/screens/LoginScreen")}
          >
            <Text
              color={rentalAppTheme.textDark}
              fontSize={16}
              fontWeight="bold"
              textAlign="center"
            >
              Already have an account? Login
            </Text>
          </Button>
        </YStack>
      </YStack>
    </Theme>
  );
}
