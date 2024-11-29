import React from "react";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Theme,
} from "tamagui";
import { rentalAppTheme } from '../../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    // Login logic here
    router.replace("/(tabs)");
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
          >
            <Text
              color="white"
              fontSize={16}
              fontWeight="bold"
              textAlign="center"
            >
              Login
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
        </YStack>
      </YStack>
    </Theme>
  );
}