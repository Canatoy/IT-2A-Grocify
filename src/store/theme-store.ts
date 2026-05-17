import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const THEME_KEY = "grocify_theme";

type ThemeMode = "light" | "dark";

type ThemeStore = {
  mode: ThemeMode;
  isLoaded: boolean;
  loadTheme: () => Promise<void>;
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: "light",
  isLoaded: false,

  loadTheme: async () => {
    try {
      const saved = await SecureStore.getItemAsync(THEME_KEY);
      if (saved === "dark" || saved === "light") {
        set({ mode: saved, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  setTheme: async (mode: ThemeMode) => {
    set({ mode });
    try {
      await SecureStore.setItemAsync(THEME_KEY, mode);
    } catch {
      // fail silently — UI still updates
    }
  },

  toggleTheme: async () => {
    const next = get().mode === "dark" ? "light" : "dark";
    set({ mode: next });
    try {
      await SecureStore.setItemAsync(THEME_KEY, next);
    } catch {}
  },
}));
