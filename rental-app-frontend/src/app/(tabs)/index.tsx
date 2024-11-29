import React from "react";
import { useUserStore } from "@/store/user.store";
import ListingsScreen from "@/app/screens/ListingsScreen";
import LandlordDashboardScreen from "@/app/screens/LandlordDashboardScreen";

export default function Home() {
  const userType = useUserStore((state) => state.user?.userType);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (isAuthenticated && userType === "landlord") {
    return <LandlordDashboardScreen />;
  } else {
    return <ListingsScreen />;
  }
}
