import React from "react";
import { useRouter } from "expo-router";
import {
  YStack,
  Text,
  Button,
  Input,
  Select,
  XStack,
  Circle,
  Theme,
} from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";

export default function RegisterScreen() {
  const router = useRouter();
  const [userType, setUserType] = React.useState("tenant");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [addressLine, setAddressLine] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [eircode, setEircode] = React.useState("");

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

          {/* Name */}
          <Input
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />

          {/* Email */}
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

          {/* Phone */}
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

          {/* Address Line */}
          <Input
            placeholder="Address Line"
            value={addressLine}
            onChangeText={setAddressLine}
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />

          {/* City */}
          <Input
            placeholder="City"
            value={city}
            onChangeText={setCity}
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />

          {/* County */}
          <Input
            placeholder="County"
            value={country}
            onChangeText={setCountry}
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />

          {/* Eircode */}
          <Input
            placeholder="Eircode"
            value={eircode}
            onChangeText={setEircode}
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />

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
