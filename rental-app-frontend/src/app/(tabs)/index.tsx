import React from "react";
import LandlordDashboardScreen from "@/app/screens/LandlordDashboardScreen";
import ListingsScreen from "@/app/screens/ListingsScreen";

// Hardcoded user type for now: "landlord" or "tenant"
const userType: "landlord" | "tenant" = "landlord";

export default function Home() {
  if (userType === "tenant") {
    return <LandlordDashboardScreen />;
  } else {
    return <ListingsScreen />;
  }
}
