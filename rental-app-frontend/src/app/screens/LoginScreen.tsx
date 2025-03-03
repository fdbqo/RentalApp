import React, { useState } from "react";
import { useRouter } from "expo-router";
import { YStack, XStack, Text, Button, Input, Theme, Card, Spinner } from "tamagui";
import { rentalAppTheme } from "../../constants/Colors";
import { useUserStore } from "@/store/user.store";
import { AnimatePresence, View } from "moti";

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const error = useUserStore((state) => state.error);

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
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor={rentalAppTheme.backgroundLight} padding="$4">
        <AnimatePresence>
          <View from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 300 }}>
            <Card elevate shadowColor="gray" shadowOpacity={0.2} padding="$6" borderRadius="$6" width={350} backgroundColor="white">
              <YStack space="$4" alignItems="center">
                <Text fontSize={28} fontWeight="bold" color={rentalAppTheme.textDark}>
                  Welcome Back
                </Text>
                <Text fontSize={16} color={rentalAppTheme.textLight} textAlign="center" marginBottom="$4">
                  Sign in to continue
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
                  width="100%"
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
                  width="100%"
                />

                <Button
                  onPress={handleLogin}
                  backgroundColor={rentalAppTheme.primaryDark}
                  pressStyle={{ backgroundColor: rentalAppTheme.primaryLight }}
                  borderRadius="$4"
                  width="100%"
                  disabled={loading}
                >
                  {loading ? <Spinner color="white" size="small" /> : (
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
                  <Text color={rentalAppTheme.textDark} fontSize={16} textAlign="center">
                    Create an Account
                  </Text>
                </Button>

                <Button
                  variant="outlined"
                  borderColor={rentalAppTheme.border}
                  borderWidth={0}
                  borderRadius="$4"
                  width="100%"
                  onPress={() => router.replace("/(tabs)")}
                >
                  <Text color={rentalAppTheme.textDark} fontSize={16} textAlign="center">
                    Back to Listings
                  </Text>
                </Button>
              </YStack>
            </Card>
          </View>
        </AnimatePresence>
      </YStack>
    </Theme>
  );
}
