import { Tabs } from "expo-router";
import React from "react";
import { Text, View, useColorScheme } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const tintColor = "#016180";

  const CustomTabIcon = ({ name, title, focused }) => (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Ionicons
        name={name}
        size={24}
        color={focused ? tintColor : "gray"}
      />
      <Text style={{ color: focused ? tintColor : "gray", fontSize: 12 }}>
        {title}
      </Text>
    </View>
  );

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
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon name="home" title="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) => (
            <CustomTabIcon name="chatbubble" title="Messages" focused={focused} />
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