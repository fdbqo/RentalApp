import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "tamagui";
import { Feather } from "@expo/vector-icons";

interface NavigationHeaderProps {
  title: string;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({ title }) => {
  const router = useRouter();

  const rentalAppTheme = {
    primaryDark: "#016180",
    primaryLight: "#1abc9c",
    backgroundLight: "#fff",
    accentDarkRed: "#8B0000",
    textDark: "#000",
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#fff",
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color={rentalAppTheme.primaryDark} />
      </TouchableOpacity>
      
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          textAlign: "center",
          flex: 1,
        }}
      >
        {title}
      </Text>

      <View style={{ width: 24 }} />
    </View>
  );
};

export default NavigationHeader;
