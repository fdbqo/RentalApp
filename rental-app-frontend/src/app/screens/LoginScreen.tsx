import React, { useState } from "react";
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
} from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";
import { useUserStore } from "@/store/user.store";
import { AnimatePresence, View } from "tamagui";
import { Feather } from "@expo/vector-icons";
import { Alert } from "react-native";

// Validation helper functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const error = useUserStore((state) => state.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err?.response?.status === 401) {
        Alert.alert(
          "Login Failed",
          "Invalid email or password. Please try again.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Login Error",
          "An error occurred while trying to log in. Please try again.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Theme name="light">
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={rentalAppTheme.backgroundLight}
        padding="$4"
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
                <Text
                  fontSize={28}
                  fontWeight="bold"
                  color={rentalAppTheme.textDark}
                >
                  Welcome Back
                </Text>
                <Text
                  fontSize={16}
                  color={rentalAppTheme.textLight}
                  textAlign="center"
                  marginBottom="$4"
                >
                  Sign in to continue
                </Text>

                {error && (
                  <Text color="red" textAlign="center">
                    {error}
                  </Text>
                )}

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

                <Button
                  onPress={handleLogin}
                  backgroundColor={rentalAppTheme.primaryDark}
                  pressStyle={{ backgroundColor: rentalAppTheme.primaryDarkPressed }}
                  borderRadius="$4"
                  width="100%"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner color="white" size="small" />
                  ) : (
                    <Text color="white" fontSize={16} textAlign="center">
                      Login
                    </Text>
                  )}
                </Button>

                <Button
                  variant="outlined"
                  borderColor={rentalAppTheme.border}
                  borderWidth={1}
                  borderRadius="$4"
                  width="100%"
                  onPress={() => router.push("/screens/RegisterScreen")}
                >
                  <Text
                    color={rentalAppTheme.textDark}
                    fontSize={16}
                    textAlign="center"
                  >
                    Create an Account
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
      </YStack>
    </Theme>
  );
}
