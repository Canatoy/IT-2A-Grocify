import { useThemeStore } from "@/store/theme-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useThemeStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const thumbX = useSharedValue(isDark ? 1 : 0);

  useEffect(() => {
    thumbX.value = withSpring(isDark ? 1 : 0, { damping: 16, stiffness: 200 });
  }, [isDark]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(thumbX.value, [0, 1], [2, 22]) }],
  }));

  const trackBg = isDark ? "#1d4ed8" : "#e2e8f0";
  const cardBg  = isDark ? "#0f172a" : "#ffffff";
  const fg      = isDark ? "#f1f5f9" : "#0f172a";
  const muted   = isDark ? "#64748b" : "#94a3b8";
  const border  = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.row}>
        <View style={styles.labelBlock}>
          <Text style={[styles.title, { color: fg }]}>
            {isDark ? "Dark mode" : "Light mode"}
          </Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            {isDark ? "Easy on the eyes at night" : "Bright and clear for daytime"}
          </Text>
        </View>

        <Pressable onPress={toggleTheme} style={[styles.track, { backgroundColor: trackBg }]} hitSlop={8}>
          <Animated.View
            style={[styles.thumb, thumbStyle, { backgroundColor: isDark ? "#a3e635" : "#ffffff" }]}
          >
            <FontAwesome6
              name={isDark ? "moon" : "sun"}
              size={10}
              color={isDark ? "#1a2e05" : "#f59e0b"}
            />
          </Animated.View>
        </Pressable>
      </View>

      <View style={[styles.chipRow, { borderTopColor: border }]}>
        {(["light", "dark"] as const).map((m) => {
          const active = mode === m;
          return (
            <Pressable
              key={m}
              onPress={() => useThemeStore.getState().setTheme(m)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? (isDark ? "#1e293b" : "#f1f5f9") : "transparent",
                  borderColor: active ? (isDark ? "#334155" : "#e2e8f0") : "transparent",
                },
              ]}
            >
              <FontAwesome6
                name={m === "dark" ? "moon" : "sun"}
                size={12}
                color={active ? (isDark ? "#a3e635" : "#1d4ed8") : muted}
              />
              <Text style={[styles.chipText, { color: active ? (isDark ? "#a3e635" : "#1d4ed8") : muted }]}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,           // ← sharp
    overflow: "hidden",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
  },
  labelBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: { fontSize: 12 },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,          // ← toggle pill stays rounded (UX convention)
    justifyContent: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,          // ← thumb stays circular
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 0,           // ← sharp chips
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "700",
  },
});
