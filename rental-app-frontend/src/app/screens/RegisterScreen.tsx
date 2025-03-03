import React from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { YStack, XStack, Text, Button, Input, Theme, Card, Spinner, Circle } from "tamagui";
import { AnimatePresence, View } from "moti";
import { rentalAppTheme } from "../../constants/Colors";
import { useUserStore } from "@/store/user.store";

export default function RegisterScreen() {
  const router = useRouter();

  const [userType, setUserType] = React.useState<"tenant" | "landlord">("tenant");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [licenseNumber, setLicenseNumber] = React.useState("");
  const [addressLine, setAddressLine] = React.useState("");
  const [city, setCity] = React.useState("");
  const [county, setCounty] = React.useState("");
  const [eircode, setEircode] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const register = useUserStore((state) => state.register);
  const userError = useUserStore((state) => state.error);

  const handleRegister = async () => {
    setLoading(true);
    const userData: any = {
      firstName,
      lastName,
      email,
      password,
      userType,
    };

    if (phone) {
      userData.phone = phone;
    }

    if (userType === "landlord") {
      if (!addressLine || !city || !county || !eircode) {
        setError("Please fill in all address fields");
        setLoading(false);
        return;
      }

      userData.address = {
        addressLine1: addressLine,
        city,
        county,
        eircode,
      };
      if (licenseNumber) userData.licenseNumber = licenseNumber;
    }

    try {
      await register(userData);
      router.push("/screens/LoginScreen");
    } catch (err) {
      setError(userError || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor={rentalAppTheme.backgroundLight}>
        {/* ScrollView ensures content is scrollable on mobile */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <AnimatePresence>
            <View
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 300 }}
            >
              <Card
                elevate
                shadowColor="gray"
                shadowOpacity={0.2}
                padding="$6"
                borderRadius="$6"
                width={350}
                backgroundColor="white"
              >
                <YStack space="$4" alignItems="center">
                  <Text fontSize={28} color={rentalAppTheme.textDark}>
                    Create Account
                  </Text>
                  <Text
                    fontSize={16}
                    color={rentalAppTheme.textLight}
                    textAlign="center"
                    marginBottom="$4"
                  >
                    Please fill in the details below
                  </Text>

                  {/* Error Message */}
                  {error && (
                    <Text color="red" textAlign="center">
                      {error}
                    </Text>
                  )}

                  {/* User Type Selection */}
                  <YStack space="$2" width="100%">
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
                      <XStack alignItems="center" onPress={() => setUserType("landlord")}>  
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

                  {/* First Name */}
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    borderColor={rentalAppTheme.border}
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />

                  {/* Last Name */}
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    borderColor={rentalAppTheme.border}
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />

                  {/* Email */}
                  <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    keyboardType="email-address"
                    borderColor={rentalAppTheme.border}
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />

                  {/* Password */}
                  <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    borderColor={rentalAppTheme.border}
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />

                  {/* Phone */}
                  <Input
                    placeholder="Phone (Optional)"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    borderColor={rentalAppTheme.border}
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />

                  {/* License Number - Landlord Only */}
                  {userType === "landlord" && (
                    <Input
                      placeholder="License Number"
                      value={licenseNumber}
                      onChangeText={setLicenseNumber}
                      borderColor={rentalAppTheme.border}
                      borderWidth={1}
                      padding="$3"
                      borderRadius="$4"
                      width="100%"
                    />
                  )}

                  {/* Address - Landlord Only */}
                  {userType === "landlord" && (
                    <YStack space="$4" width="100%">
                      <Input
                        placeholder="Address Line"
                        value={addressLine}
                        onChangeText={setAddressLine}
                        borderColor={rentalAppTheme.border}
                        borderWidth={1}
                        padding="$3"
                        borderRadius="$4"
                        width="100%"
                      />
                      <Input
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                        borderColor={rentalAppTheme.border}
                        borderWidth={1}
                        padding="$3"
                        borderRadius="$4"
                        width="100%"
                      />
                      <Input
                        placeholder="County"
                        value={county}
                        onChangeText={setCounty}
                        borderColor={rentalAppTheme.border}
                        borderWidth={1}
                        padding="$3"
                        borderRadius="$4"
                        width="100%"
                      />
                      <Input
                        placeholder="Eircode"
                        value={eircode}
                        onChangeText={setEircode}
                        borderColor={rentalAppTheme.border}
                        borderWidth={1}
                        padding="$3"
                        borderRadius="$4"
                        width="100%"
                      />
                    </YStack>
                  )}

                  {/* Register Button */}
                  <Button
                    onPress={handleRegister}
                    backgroundColor={rentalAppTheme.primaryDark}
                    pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
                    borderRadius="$4"
                    width="100%"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner color="white" size="small" />
                    ) : (
                      <Text
                        color="white"
                        fontSize={16}
                        textAlign="center"
                      >
                        Register
                      </Text>
                    )}
                  </Button>

                  {/* Already have an account? Login */}
                  <Button
                    variant="outlined"
                    borderColor={rentalAppTheme.border}
                    borderWidth={1}
                    borderRadius="$4"
                    width="100%"
                    onPress={() => router.push("/screens/LoginScreen")}
                  >
                    <Text
                      color={rentalAppTheme.textDark}
                      fontSize={16}
                      textAlign="center"
                    >
                      Already have an account? Login
                    </Text>
                  </Button>
                </YStack>
              </Card>
            </View>
          </AnimatePresence>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
