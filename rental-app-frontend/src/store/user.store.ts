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
  refreshUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,

  refreshUserData: async () => {
    try {
      const token = get().token;
      const user = get().user;

      if (!token || !user) {
        return;
      }

      const response = await axios.get(`${env.API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = response.data;
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const timestamp = new Date().toISOString();
      const response = await axios.post(
        `${env.API_URL}/auth/login`,
        {
          email: email.toLowerCase(),
          password,
        }
      );
      const { user, access_token } = response.data;


      await AsyncStorage.setItem("token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        token: access_token,
        isAuthenticated: true,
        error: null,
      });

    } catch (error: any) {
      const timestamp = new Date().toISOString();
      console.error(
        `[${timestamp}] Login failed:`,
        error.response?.data || error.message
      );
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
      const token = await AsyncStorage.getItem("token");
      const userString = await AsyncStorage.getItem("user");

      if (token && userString) {
        const user = JSON.parse(userString);


        set({
          token,
          user,
          isAuthenticated: true,
          error: null,
        });
      } else {
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

      const response = await axios.post(
        `${env.API_URL}/auth/register`,
        normalizedUserData
      );

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
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });

    } catch (error) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Logout failed:`, error);
      console.error("Error during logout:", error);
    }
  },
}));
