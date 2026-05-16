import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

const statConfig = [
  { key: "pending",   label: "Pending",   icon: "clock",       accent: "#60a5fa" },
  { key: "completed", label: "Completed", icon: "check",       accent: "#a3e635" },
  { key: "total",     label: "Total",     icon: "layer-group", accent: "#c084fc" },
];

export default function InsightsStatsSection() {
  const { items } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const totalItems     = items.length;
  const completedItems = items.filter((i) => i.purchased).length;
  const pendingItems   = totalItems - completedItems;
  const completionRate = totalItems
    ? Math.round((completedItems / totalItems) * 100)
    : 0;

  const values: Record<string, number> = {
    pending:   pendingItems,
    completed: completedItems,
    total:     totalItems,
  };

  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const fg     = isDark ? "#f1f5f9" : "#0f172a";
  const muted  = isDark ? "#64748b" : "#94a3b8";

  return (
    <View style={{ gap: 10 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 4 }}
      >
        {statConfig.map(({ key, label, icon, accent }) => (
          <View
            key={key}
            style={[styles.bigCard, { backgroundColor: cardBg, borderLeftColor: accent }]}
          >
            <View style={[styles.iconBadge, { backgroundColor: accent + "22" }]}>
              <FontAwesome6 name={icon} size={14} color={accent} />
            </View>
            <Text style={[styles.bigNumber, { color: fg }]}>{values[key]}</Text>
            <Text style={[styles.bigLabel, { color: muted }]}>{label}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.rateCard, { backgroundColor: cardBg }]}>
        <View style={styles.rateHeader}>
          <Text style={[styles.rateTitle, { color: fg }]}>Completion rate</Text>
          <Text style={[styles.ratePct, { color: "#a3e635" }]}>{completionRate}%</Text>
        </View>

        <View style={styles.segRow}>
          {Array.from({ length: 10 }).map((_, i) => {
            const filled = i < Math.round(completionRate / 10);
            return (
              <View
                key={i}
                style={[
                  styles.seg,
                  { backgroundColor: filled ? "#a3e635" : isDark ? "#1e293b" : "#f1f5f9" },
                ]}
              />
            );
          })}
        </View>

        <Text style={[styles.rateSubtext, { color: muted }]}>
          {completedItems} of {totalItems} items checked off
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bigCard: {
    width: 130,
    borderRadius: 0,           // ← sharp
    padding: 16,
    gap: 8,
    borderLeftWidth: 4,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 2,           // ← nearly sharp
    alignItems: "center",
    justifyContent: "center",
  },
  bigNumber: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 44,
  },
  bigLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  rateCard: {
    borderRadius: 0,           // ← sharp
    padding: 18,
    gap: 12,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  ratePct: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  segRow: {
    flexDirection: "row",
    gap: 3,
  },
  seg: {
    flex: 1,
    height: 12,
    borderRadius: 0,           // ← sharp segments
  },
  rateSubtext: {
    fontSize: 12,
  },
});
