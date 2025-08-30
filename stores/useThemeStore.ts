import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type ThemeState = {
  theme: "1" | "2";
  setTheme: (theme: "1" | "2") => void;
  loadTheme: () => Promise<void>;
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "1",
  setTheme: (theme: "1" | "2") => {
    AsyncStorage.setItem("theme", theme); // no await needed
    set({ theme });
  },
  loadTheme: async () => {
    const theme = await AsyncStorage.getItem("theme");
    if (theme === "1" || theme === "2") {
      set({ theme });
    }
  },
}));
