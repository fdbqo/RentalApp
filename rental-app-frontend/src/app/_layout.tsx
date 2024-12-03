import React, { useEffect, useState } from "react";
import { StatusBar, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../tamagui.config";
import { useUserStore } from "@/store/user.store";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  const restoreAuthState = useUserStore((state) => state.restoreAuthState);

  useEffect(() => {
    restoreAuthState();
  }, [restoreAuthState]);

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <RootLayoutNav />
    </TamaguiProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  const router = useRouter();

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const userType = useUserStore((state) => state.user?.userType);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (loading) return;

    router.replace("/(tabs)");
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return null; // add loading spinner here
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <StatusBar
          barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="screens/LoginScreen" />
          <Stack.Screen name="screens/RegisterScreen" />
        </Stack>
      </SafeAreaView>
    </ThemeProvider>
  );
}
