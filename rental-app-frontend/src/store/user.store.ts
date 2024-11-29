import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/store/interfaces/User";

const API_URL = "http://localhost:3000";

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  restoreAuthState: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      console.log("Sending login request:", { email, password });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { user, access_token } = response.data;

      console.log("Login response user data:", user);

      await AsyncStorage.setItem("token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        error: null,
      });

      console.log("User successfully logged in:", user);
      console.log("Token stored:", access_token);
    } catch (error: any) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      set({ error: error.response?.data?.message || "Login failed" });
      throw error;
    }
  },

  restoreAuthState: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");

      if (token && userString) {
        const user = JSON.parse(userString);
        console.log("Restored user from AsyncStorage:", user);

        set({
          token,
          user,
          isAuthenticated: true,
          error: null,
        });
      } else {
        console.log("No user token found in AsyncStorage");
      }
    } catch (error) {
      console.error("Failed to restore auth state:", error);
    }
  },

  register: async (userData: any) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);

      if (response.status === 201 || response.status === 200) {
        set({ error: null });
      } else {
        set({ error: "Registration failed" });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Registration failed" });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });

      console.log("User successfully logged out, AsyncStorage cleared");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));
