import React from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Theme,
  Card,
  Spinner,
  Circle,
  Select,
  Sheet,
  Adapt,
} from "tamagui";
import { AnimatePresence, View } from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";
import { useUserStore } from "@/store/user.store";
import { Feather } from "@expo/vector-icons";
import { ChevronDown, Check } from "@tamagui/lucide-icons";

// Counties and cities data
const countiesToCities = {
  Carlow: [
    "Carlow Town",
    "Tullow",
    "Muine Bheag (Borrisokane)",
    "Borris",
    "Leighlinbridge",
  ],
  Dublin: [
    "Dublin City",
    "Swords",
    "Tallaght",
    "Blanchardstown",
    "Malahide",
    "Lucan",
    "Clondalkin",
    "Dun Laoghaire",
  ],
  Cork: [
    "Cork City",
    "Ballincollig",
    "Carrigaline",
    "Cobh",
    "Midleton",
    "Mallow",
  ],
  Galway: [
    "Galway City",
    "Salthill",
    "Oranmore",
    "Athenry",
    "Ballinasloe",
    "Tuam",
  ],
  Kerry: [
    "Tralee",
    "Killarney",
    "Dingle",
    "Kenmare",
    "Listowel",
    "Castleisland",
  ],
  // Add more counties as needed...
};

export default function RegisterScreen() {
  const router = useRouter();

  const [userType, setUserType] = React.useState<"tenant" | "landlord">(
    "tenant"
  );
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
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const register = useUserStore((state) => state.register);
  const userError = useUserStore((state) => state.error);

  const availableCities =
    county && countiesToCities[county] ? countiesToCities[county] : [];

  const handleCountyChange = React.useCallback((value: string) => {
    setCounty(value);
    setCity(""); // Reset city when county changes
    setErrors((prev) => ({ ...prev, county: "", city: "" }));
  }, []);

  const handleCityChange = React.useCallback((value: string) => {
    setCity(value);
    setErrors((prev) => ({ ...prev, city: "" }));
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    const newErrors: { [key: string]: string } = {};

    if (userType === "landlord") {
      if (!addressLine) {
        newErrors.addressLine = "Address is required";
      }
      if (!county) {
        newErrors.county = "County is required";
      }
      if (!city) {
        newErrors.city = "City is required";
      }
      if (!eircode) {
        newErrors.eircode = "Eircode is required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }
    }

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
      userData.address = {
        addressLine1: addressLine,
        city,
        county,
        eircode,
      };
      if (licenseNumber) userData.licenseNumber = licenseNumber;
      userData.balance = 0;
    }

    try {
      await register(userData);
      router.push("/screens/LoginScreen");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: userError || "Registration failed",
      }));
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
              animation="lazy"
              enterStyle={{ opacity: 0, translateY: 20 }}
              exitStyle={{ opacity: 0, translateY: -20 }}
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
                  {errors.general && (
                    <Text color="red" textAlign="center">
                      {errors.general}
                    </Text>
                  )}

                  {/* User Type Selection */}
                  <YStack space="$2" width="100%">
                    <Text fontSize={14} color={rentalAppTheme.textDark}>
                      Register as
                    </Text>
                    <XStack space="$4" alignItems="center">
                      <XStack
                        alignItems="center"
                        onPress={() => setUserType("tenant")}
                      >
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
                      <XStack space="$4">
                        {/* County Dropdown */}
                        <YStack flex={1}>
                          <Text
                            fontSize="$4"
                            fontWeight="500"
                            color={rentalAppTheme.text.secondary}
                            marginBottom="$2"
                          >
                            County
                          </Text>
                          <Select
                            value={county}
                            onValueChange={handleCountyChange}
                            disablePreventBodyScroll
                          >
                            <Select.Trigger
                              backgroundColor="transparent"
                              borderColor={
                                errors.county
                                  ? rentalAppTheme.error
                                  : rentalAppTheme.border
                              }
                              borderWidth={1}
                              borderRadius="$4"
                              padding="$3"
                              iconAfter={ChevronDown}
                            >
                              <Select.Value placeholder="Select" />
                            </Select.Trigger>
                            <Adapt when="sm" platform="touch">
                              <Sheet
                                modal
                                dismissOnSnapToBottom
                                animation="medium"
                                snapPoints={[45]}
                                position={0}
                                zIndex={200000}
                              >
                                <Sheet.Overlay
                                  animation="lazy"
                                  enterStyle={{ opacity: 0 }}
                                  exitStyle={{ opacity: 0 }}
                                />
                                <Sheet.Frame>
                                  <Sheet.ScrollView>
                                    <Adapt.Contents />
                                  </Sheet.ScrollView>
                                </Sheet.Frame>
                              </Sheet>
                            </Adapt>
                            <Select.Content>
                              <Select.Viewport>
                                <Select.Group>
                                  <Select.Label>County</Select.Label>
                                  {Object.keys(countiesToCities).map(
                                    (county, i) => (
                                      <Select.Item
                                        key={county}
                                        value={county}
                                        index={i}
                                      >
                                        <Select.ItemText>
                                          {county}
                                        </Select.ItemText>
                                        <Select.ItemIndicator marginLeft="auto">
                                          <Check size={16} />
                                        </Select.ItemIndicator>
                                      </Select.Item>
                                    )
                                  )}
                                </Select.Group>
                              </Select.Viewport>
                            </Select.Content>
                          </Select>
                          {errors.county && (
                            <Text color={rentalAppTheme.error} fontSize="$2">
                              {errors.county}
                            </Text>
                          )}
                        </YStack>

                        {/* City Dropdown */}
                        <YStack flex={1}>
                          <Text
                            fontSize="$4"
                            fontWeight="500"
                            color={rentalAppTheme.text.secondary}
                            marginBottom="$2"
                          >
                            City
                          </Text>
                          <Select
                            value={city}
                            onValueChange={handleCityChange}
                            disablePreventBodyScroll
                          >
                            <Select.Trigger
                              backgroundColor="transparent"
                              borderColor={
                                errors.city
                                  ? rentalAppTheme.error
                                  : rentalAppTheme.border
                              }
                              borderWidth={1}
                              borderRadius="$4"
                              padding="$3"
                              iconAfter={ChevronDown}
                            >
                              <Select.Value
                                placeholder={
                                  county ? "Select" : "Select"
                                }
                              />
                            </Select.Trigger>
                            <Adapt when="sm" platform="touch">
                              <Sheet
                                modal
                                dismissOnSnapToBottom
                                animation="medium"
                                snapPoints={[45]}
                                position={0}
                                zIndex={200000}
                              >
                                <Sheet.Overlay
                                  animation="lazy"
                                  enterStyle={{ opacity: 0 }}
                                  exitStyle={{ opacity: 0 }}
                                />
                                <Sheet.Frame>
                                  <Sheet.ScrollView>
                                    <Adapt.Contents />
                                  </Sheet.ScrollView>
                                </Sheet.Frame>
                              </Sheet>
                            </Adapt>
                            <Select.Content>
                              <Select.Viewport>
                                <Select.Group>
                                  <Select.Label>City</Select.Label>
                                  {availableCities.length > 0 ? (
                                    availableCities.map((city, i) => (
                                      <Select.Item
                                        key={city}
                                        value={city}
                                        index={i}
                                      >
                                        <Select.ItemText>
                                          {city}
                                        </Select.ItemText>
                                        <Select.ItemIndicator marginLeft="auto">
                                          <Check size={16} />
                                        </Select.ItemIndicator>
                                      </Select.Item>
                                    ))
                                  ) : (
                                    <Select.Item value="" disabled index={0}>
                                      <Select.ItemText>
                                        No cities available
                                      </Select.ItemText>
                                    </Select.Item>
                                  )}
                                </Select.Group>
                              </Select.Viewport>
                            </Select.Content>
                          </Select>
                          {errors.city && (
                            <Text color={rentalAppTheme.error} fontSize="$2">
                              {errors.city}
                            </Text>
                          )}
                        </YStack>
                      </XStack>

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
                    pressStyle={{
                      backgroundColor: rentalAppTheme.primaryLight,
                    }}
                    borderRadius="$4"
                    width="100%"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner color="white" size="small" />
                    ) : (
                      <Text color="white" fontSize={16} textAlign="center">
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

                  <XStack marginTop="$2" justifyContent="center">
                    <Button
                      chromeless
                      onPress={() => router.replace("/(tabs)")}
                      pressStyle={{ opacity: 0.7 }}
                    >
                      <XStack space="$1.5" alignItems="center">
                        <Feather
                          name="arrow-left"
                          size={16}
                          color={rentalAppTheme.textLight}
                        />
                        <Text color={rentalAppTheme.textLight} fontSize={14}>
                          Back to Listings
                        </Text>
                      </XStack>
                    </Button>
                  </XStack>
                </YStack>
              </Card>
            </View>
          </AnimatePresence>
        </ScrollView>
      </YStack>
    </Theme>
  );
}
