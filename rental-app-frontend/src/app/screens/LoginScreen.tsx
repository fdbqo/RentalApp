import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { YStack, XStack, Text, Button, Input, Theme } from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";
import { useUserStore } from "@/store/user.store";

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const error = useUserStore((state) => state.error);
  const userType = useUserStore((state) => state.user?.userType);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
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
            Welcome Back
          </Text>
          <Text
            fontSize={14}
            color={rentalAppTheme.textLight}
            textAlign="center"
          >
            Please sign in to continue
          </Text>

          {error && (
            <Text color="red" textAlign="center">
              {error}
            </Text>
          )}

          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text.toLowerCase())}
            keyboardType="email-address"
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            padding="$3"
            borderRadius="$4"
          />

          <Button
            onPress={handleLogin}
            backgroundColor={rentalAppTheme.primaryDark}
            pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
            borderRadius="$4"
            marginTop="$2"
            disabled={loading}
          >
            <Text
              color="white"
              fontSize={16}
              fontWeight="bold"
              textAlign="center"
            >
              {loading ? "Logging in..." : "Login"}
            </Text>
          </Button>

          <Button
            variant="outlined"
            borderColor={rentalAppTheme.border}
            borderWidth={1}
            borderRadius="$4"
            marginTop="$2"
            onPress={() => router.push("/screens/RegisterScreen")}
          >
            <Text
              color={rentalAppTheme.textDark}
              fontSize={16}
              fontWeight="bold"
              textAlign="center"
            >
              Create an Account
            </Text>
          </Button>

          {/* Back to Listings Button */}
          <Button
            variant="outlined"
            borderColor={rentalAppTheme.border}
            borderWidth={0}
            borderRadius="$4"
            marginTop="$4"
            onPress={() => router.replace("/(tabs)")}
          >
            <Text
              color={rentalAppTheme.textDark}
              fontSize={16}
              fontWeight="bold"
              textAlign="center"
            >
              Back to Listings
            </Text>
          </Button>
        </YStack>
      </YStack>
    </Theme>
  );
}
