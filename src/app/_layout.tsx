import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";

import * as Sentry from "@sentry/react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useThemeStore } from "@/store/theme-store";

import "../../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  integrations: [Sentry.feedbackIntegration()],
});

function ThemedApp() {
  const { mode, loadTheme, isLoaded } = useThemeStore();
  const { setColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setColorScheme(mode);
    }
  }, [mode, isLoaded]);

  const navTheme = mode === "dark" ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={navTheme}>
      {/*
        This View is the critical fix — it is the root canvas that receives
        the NativeWind "dark" class, causing all bg-background / text-foreground
        className-based tokens to resolve correctly across the whole tree.
      */}
      <View className="flex-1 bg-background" style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <KeyboardProvider>
        <ThemedApp />
      </KeyboardProvider>
    </ClerkProvider>
  );
});
