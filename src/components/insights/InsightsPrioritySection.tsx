import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

export default function InsightsPrioritySection() {
  const { items } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const highPriority   = items.filter((i) => i.priority === "high"   && !i.purchased).length;
  const mediumPriority = items.filter((i) => i.priority === "medium" && !i.purchased).length;
  const lowPriority    = items.filter((i) => i.priority === "low"    && !i.purchased).length;
  const allClear = highPriority === 0;

  const cardBg  = isDark ? "#0f172a" : "#ffffff";
  const fg      = isDark ? "#f1f5f9" : "#0f172a";
  const muted   = isDark ? "#64748b" : "#94a3b8";
  const trackBg = isDark ? "#1e293b" : "#f1f5f9";

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.heroRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.heroLabel, { color: muted }]}>High priority remaining</Text>
          <Text style={[styles.heroNumber, { color: highPriority > 0 ? "#fca5a5" : "#a3e635" }]}>
            {highPriority}
          </Text>
          <Text style={[styles.heroSub, { color: muted }]}>
            {allClear
              ? "You're all clear — nice work! 🎉"
              : `${highPriority} item${highPriority > 1 ? "s" : ""} need attention first`}
          </Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: allClear ? "#a3e63522" : "#fca5a522" }]}>
          <FontAwesome6
            name={allClear ? "circle-check" : "triangle-exclamation"}
            size={20}
            color={allClear ? "#a3e635" : "#fca5a5"}
          />
          <Text style={[styles.statusText, { color: allClear ? "#a3e635" : "#fca5a5" }]}>
            {allClear ? "Clear" : "Action"}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }]} />

      <View style={{ flexDirection: "row", gap: 6 }}>
        {[
          { label: "Medium", value: mediumPriority, color: "#fde68a", icon: "compass"  },
          { label: "Low",    value: lowPriority,    color: "#86efac", icon: "seedling" },
        ].map(({ label, value, color, icon }) => (
          <View key={label} style={[styles.miniCard, { backgroundColor: trackBg }]}>
            <FontAwesome6 name={icon} size={12} color={color} />
            <Text style={[styles.miniNumber, { color: fg }]}>{value}</Text>
            <Text style={[styles.miniLabel, { color: muted }]}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,           // ← sharp
    padding: 18,
    gap: 14,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroNumber: {
    fontSize: 64,
    fontWeight: "900",
    letterSpacing: -3,
    lineHeight: 68,
    marginTop: 4,
  },
  heroSub: {
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    borderRadius: 0,           // ← sharp
    padding: 16,
    alignItems: "center",
    gap: 6,
    minWidth: 72,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
  },
  miniCard: {
    flex: 1,
    borderRadius: 0,           // ← sharp
    padding: 14,
    gap: 4,
  },
  miniNumber: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
    marginTop: 4,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});
