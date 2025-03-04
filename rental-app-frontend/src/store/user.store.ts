import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/store/interfaces/User";
import { env } from "../../env";
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

const API_URL = env.EXPO_PUBLIC_API_URL;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Initiating login request:`, { email: email.toLowerCase() });
      console.log("Sending login request:", { email: email.toLowerCase(), password });
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.toLowerCase(),
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

      console.log(`[${timestamp}] Login successful - User ID: ${user._id}`);
      console.log(`[${timestamp}] Auth state updated - isAuthenticated: true`);
      console.log("User successfully logged in:", user);
      console.log("Token stored:", access_token);
    } catch (error: any) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Login failed:`, error.response?.data || error.message);
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
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Attempting to restore auth state`);
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");

      if (token && userString) {
        const user = JSON.parse(userString);
        console.log(`[${timestamp}] Auth state restored - User ID: ${user._id}`);
        console.log(`[${timestamp}] Token present: ${!!token}`);
        console.log("Restored user from AsyncStorage:", user);

        set({
          token,
          user,
          isAuthenticated: true,
          error: null,
        });
      } else {
        console.log(`[${timestamp}] No auth state to restore - Token: ${!!token}, User: ${!!userString}`);
        console.log("No user token found in AsyncStorage");
      }
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Auth state restoration failed:`, error);
      console.error("Failed to restore auth state:", error);
    }
  },

  register: async (userData: any) => {
    try {
      const normalizedUserData = {
        ...userData,
        email: userData.email.toLowerCase(),
      };
      
      const response = await axios.post(`${API_URL}/auth/register`, normalizedUserData);

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
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Initiating logout`);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });

      console.log(`[${timestamp}] Logout complete - Auth state cleared`);
      console.log("User successfully logged out, AsyncStorage cleared");
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Logout failed:`, error);
      console.error("Error during logout:", error);
    }
  },
}));
