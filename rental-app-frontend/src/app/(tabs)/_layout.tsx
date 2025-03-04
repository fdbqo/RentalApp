import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";

export default function TabLayout() {
  const tintColor = "#016180";

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const userType = useUserStore((state) => state.user?.userType);

  const router = useRouter();

  const CustomTabIcon = ({
    name,
    title,
    focused,
  }: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    title: string;
    focused: boolean;
  }) => (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Ionicons name={name} size={24} color={focused ? tintColor : "gray"} />
      <Text style={{ color: focused ? tintColor : "gray", fontSize: 12 }}>
        {title}
      </Text>
    </View>
  );

  // If user is not authenticated, we'll just render a single screen without tabs
  if (!isAuthenticated) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' } // Hide the tab bar completely
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />
      </Tabs>
    );
  }

  // For authenticated users, show all tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: userType === "landlord" ? "Dashboard" : "Home",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              name="home"
              title={userType === "landlord" ? "Dashboard" : "Home"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon
              name="chatbubble"
              title="Messages"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon name="person" title="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
