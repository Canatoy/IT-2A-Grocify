import { useGroceryStore } from "@/store/grocery-store";
import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";

const TAB_ICONS: Record<string, string> = {
  index:    "☰",
  planner:  "+",
  insights: "◎",
};

const TAB_LABELS: Record<string, string> = {
  index:    "List",
  planner:  "Planner",
  insights: "Insights",
};

function TabButton({
  routeName,
  isFocused,
  onPress,
}: {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0.95);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1.08 : 0.95, { damping: 14, stiffness: 180 });
  }, [isFocused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPlanner = routeName === "planner";

  if (isPlanner) {
    return (
      <Pressable onPress={onPress} style={styles.plannerWrapper}>
        <Animated.View
          style={[
            styles.plannerButton,
            animStyle,
            { backgroundColor: isDark ? "#a3e635" : "#1d4ed8" },
          ]}
        >
          <Text style={styles.plannerIcon}>+</Text>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <Animated.View style={[styles.tabInner, animStyle]}>
        {isFocused && (
          <View
            style={[
              styles.activePill,
              { backgroundColor: isDark ? "rgba(163,230,53,0.12)" : "rgba(29,78,216,0.08)" },
            ]}
          />
        )}
        <Text
          style={[
            styles.tabIcon,
            {
              color: isFocused
                ? isDark ? "#a3e635" : "#1d4ed8"
                : isDark ? "#6b7280" : "#9ca3af",
              fontSize: routeName === "insights" ? 16 : 18,
            },
          ]}
        >
          {TAB_ICONS[routeName]}
        </Text>
        <Text
          style={[
            styles.tabLabel,
            {
              color: isFocused
                ? isDark ? "#a3e635" : "#1d4ed8"
                : isDark ? "#6b7280" : "#9ca3af",
              fontWeight: isFocused ? "700" : "500",
            },
          ]}
        >
          {TAB_LABELS[routeName]}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function FloatingTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[styles.dockContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.dock,
          {
            backgroundColor: isDark ? "rgba(15,23,42,0.92)" : "rgba(255,255,255,0.95)",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
            shadowColor: isDark ? "#000" : "#1e3a8a",
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => (
          <TabButton
            key={route.key}
            routeName={route.name}
            isFocused={state.index === index}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) navigation.navigate(route.name);
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { loadItems } = useGroceryStore();

  useEffect(() => { loadItems(); }, []);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="planner" />
      <Tabs.Screen name="insights" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dock: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,           // ← sharp dock, tiny bevel
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: "100%",
    maxWidth: 400,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,           // ← sharp active pill
    position: "relative",
    minWidth: 64,
  },
  activePill: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 4,           // ← matches tabInner
  },
  tabIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  plannerWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  plannerButton: {
    width: 48,
    height: 48,
    borderRadius: 4,           // ← sharp planner button
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  plannerIcon: {
    fontSize: 26,
    color: "#fff",
    lineHeight: 30,
    fontWeight: "300",
  },
});
