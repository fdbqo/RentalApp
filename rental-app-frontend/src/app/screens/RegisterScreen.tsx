import React from "react";
import { ScrollView, Alert } from "react-native";
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
import { countiesToCities } from "@/constants/irishPlaces";

// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return phone === "" || phoneRegex.test(phone); // Optional field
};

const isValidEircode = (eircode: string): boolean => {
  const eircodeRegex = /^[AC-FHKNPRTV-Y]\d{2}\s?[AC-FHKNPRTV-Y0-9]{4}$/i;
  return eircodeRegex.test(eircode);
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
    setCity("");
    setErrors((prev) => ({ ...prev, county: "", city: "" }));
  }, []);

  const handleCityChange = React.useCallback((value: string) => {
    setCity(value);
    setErrors((prev) => ({ ...prev, city: "" }));
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required for all users
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isValidPassword(password)) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (phone && !isValidPhone(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Additional validation for landlords
    if (userType === "landlord") {
      if (!licenseNumber) {
        newErrors.licenseNumber = "License number is required for landlords";
      } else if (licenseNumber.length < 5) {
        newErrors.licenseNumber =
          "License number must be at least 5 characters";
      }

      if (!addressLine.trim()) {
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
      } else if (!isValidEircode(eircode)) {
        newErrors.eircode = "Please enter a valid Irish Eircode";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

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
      userData.licenseNumber = licenseNumber;
      userData.address = {
        addressLine1: addressLine,
        city,
        county,
        eircode,
      };
      userData.balance = 0;
    }

    try {
      await register(userData);
      Alert.alert("Success", "Your account has been created successfully!", [
        {
          text: "Login Now",
          onPress: () => router.push("/screens/LoginScreen"),
        },
      ]);
    } catch (err: any) {
      console.error("Registration failed:", err);

      // Handle specific error cases
      if (err?.response?.data?.message) {
        if (err.response.data.message.includes("duplicate key error")) {
          Alert.alert(
            "Registration Failed",
            "An account with this email already exists.",
            [{ text: "OK" }]
          );
        } else {
          Alert.alert("Registration Failed", err.response.data.message, [
            { text: "OK" },
          ]);
        }
      } else {
        Alert.alert(
          "Registration Error",
          "An error occurred while creating your account. Please try again.",
          [{ text: "OK" }]
        );
      }
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
                  <YStack space="$1" width="100%">
                  <Input
                    placeholder="First Name"
                    value={firstName}
                      onChangeText={(text) => {
                        setFirstName(text);
                        if (errors.firstName) {
                          setErrors((prev) => ({ ...prev, firstName: "" }));
                        }
                      }}
                      borderColor={
                        errors.firstName
                          ? rentalAppTheme.error
                          : rentalAppTheme.border
                      }
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />
                    {errors.firstName && (
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.firstName}
                      </Text>
                    )}
                  </YStack>

                  {/* Last Name */}
                  <YStack space="$1" width="100%">
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                      onChangeText={(text) => {
                        setLastName(text);
                        if (errors.lastName) {
                          setErrors((prev) => ({ ...prev, lastName: "" }));
                        }
                      }}
                      borderColor={
                        errors.lastName
                          ? rentalAppTheme.error
                          : rentalAppTheme.border
                      }
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />
                    {errors.lastName && (
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.lastName}
                      </Text>
                    )}
                  </YStack>

                  {/* Email */}
                  <YStack space="$1" width="100%">
                  <Input
                    placeholder="Email"
                    value={email}
                      onChangeText={(text) => {
                        setEmail(text.toLowerCase());
                        if (errors.email) {
                          setErrors((prev) => ({ ...prev, email: "" }));
                        }
                      }}
                    keyboardType="email-address"
                      borderColor={
                        errors.email
                          ? rentalAppTheme.error
                          : rentalAppTheme.border
                      }
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />
                    {errors.email && (
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.email}
                      </Text>
                    )}
                  </YStack>

                  {/* Password */}
                  <YStack space="$1" width="100%">
                  <Input
                    placeholder="Password"
                    value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }));
                        }
                      }}
                    secureTextEntry
                      borderColor={
                        errors.password
                          ? rentalAppTheme.error
                          : rentalAppTheme.border
                      }
                    borderWidth={1}
                    padding="$3"
                    borderRadius="$4"
                    width="100%"
                  />
                    {errors.password && (
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.password}
                      </Text>
                    )}
                  </YStack>

                  {/* Phone */}
                  <YStack space="$1" width="100%">
                  <Input
                    placeholder="Phone (Optional)"
                    value={phone}
                      onChangeText={(text) => {
                        setPhone(text);
                        if (errors.phone) {
                          setErrors((prev) => ({ ...prev, phone: "" }));
                        }
                      }}
                    keyboardType="phone-pad"
                      borderColor={
                        errors.phone
                          ? rentalAppTheme.error
                          : rentalAppTheme.border
                      }
                      borderWidth={1}
                      padding="$3"
                      borderRadius="$4"
                      width="100%"
                    />
                    {errors.phone && (
                      <Text color={rentalAppTheme.error} fontSize="$2">
                        {errors.phone}
                      </Text>
                  )}
                  </YStack>

                  {/* License Number - Landlord Only */}
                  {userType === "landlord" && (
                    <YStack space="$1" width="100%">
                      <Input
                        placeholder="License Number"
                        value={licenseNumber}
                        onChangeText={(text) => {
                          setLicenseNumber(text);
                          if (errors.licenseNumber) {
                            setErrors((prev) => ({
                              ...prev,
                              licenseNumber: "",
                            }));
                          }
                        }}
                        borderColor={
                          errors.licenseNumber
                            ? rentalAppTheme.error
                            : rentalAppTheme.border
                        }
                        borderWidth={1}
                        padding="$3"
                        borderRadius="$4"
                        width="100%"
                      />
                      {errors.licenseNumber && (
                        <Text color={rentalAppTheme.error} fontSize="$2">
                          {errors.licenseNumber}
                        </Text>
                      )}
                    </YStack>
                  )}

                  {/* Address - Landlord Only */}
                  {userType === "landlord" && (
                    <YStack space="$2" width="100%">
                      <XStack space="$3">
                        {/* County Dropdown */}
                        <YStack marginBottom={6} space="$1" flex={1}>
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
                        <YStack marginBottom={6} space="$1" flex={1}>
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
                                placeholder={county ? "Select" : "Select"}
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

                      <YStack space="$1" marginVertical={6} width="100%">
                      <Input
                          placeholder="Address Line"
                          value={addressLine}
                          onChangeText={(text) => {
                            setAddressLine(text);
                            if (errors.addressLine) {
                              setErrors((prev) => ({
                                ...prev,
                                addressLine: "",
                              }));
                            }
                          }}
                          borderColor={
                            errors.addressLine
                              ? rentalAppTheme.error
                              : rentalAppTheme.border
                          }
                        borderWidth={1}
                        padding="$3"
                        borderRadius="$4"
                        width="100%"
                      />
                        {errors.addressLine && (
                          <Text color={rentalAppTheme.error} fontSize="$2">
                            {errors.addressLine}
                          </Text>
                        )}
                      </YStack>

                      <YStack space="$1" marginVertical={6} width="100%">
                      <Input
                        placeholder="Eircode"
                        value={eircode}
                          onChangeText={(text) => {
                            setEircode(text);
                            if (errors.eircode) {
                              setErrors((prev) => ({ ...prev, eircode: "" }));
                            }
                          }}
                          borderColor={
                            errors.eircode
                              ? rentalAppTheme.error
                              : rentalAppTheme.border
                          }
                        borderWidth={1}
                        padding="$3"
                        borderRadius="$4"
                        width="100%"
                      />
                        {errors.eircode && (
                          <Text color={rentalAppTheme.error} fontSize="$2">
                            {errors.eircode}
                          </Text>
                        )}
                      </YStack>
                    </YStack>
                  )}

                  {/* Register Button */}
                  <Button
                    onPress={handleRegister}
                    backgroundColor={rentalAppTheme.primaryDark}
                    pressStyle={{
                      backgroundColor: rentalAppTheme.primaryDarkPressed,
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
                      Already have an account?
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
