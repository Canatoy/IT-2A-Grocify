import { useGroceryStore } from "@/store/grocery-store";
import { Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

const categoryMeta: Record<string, { color: string; emoji: string }> = {
  Produce: { color: "#a3e635", emoji: "🥦" },
  Dairy:   { color: "#60a5fa", emoji: "🥛" },
  Bakery:  { color: "#fb923c", emoji: "🍞" },
  Pantry:  { color: "#c084fc", emoji: "🥫" },
  Snacks:  { color: "#f472b6", emoji: "🍪" },
};

export default function InsightsCategorySection() {
  const { items } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const total = items.length;
  const categories = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
  const categoryEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);

  const cardBg  = isDark ? "#0f172a" : "#ffffff";
  const trackBg = isDark ? "#1e293b" : "#f1f5f9";
  const fg      = isDark ? "#f1f5f9" : "#0f172a";
  const muted   = isDark ? "#64748b" : "#94a3b8";

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: fg }]}>By category</Text>
        <Text style={[styles.subtitle, { color: muted }]}>{categoryEntries.length} groups</Text>
      </View>

      {categoryEntries.length === 0 ? (
        <View style={[styles.emptyBox, { backgroundColor: trackBg }]}>
          <Text style={{ fontSize: 12, color: muted }}>
            Add items to see your category breakdown.
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {categoryEntries.map(([cat, count]) => {
            const pct  = total ? Math.max(6, Math.round((count / total) * 100)) : 6;
            const meta = categoryMeta[cat] ?? { color: "#94a3b8", emoji: "🛒" };

            return (
              <View key={cat} style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={[styles.emojiBox, { backgroundColor: meta.color + "22" }]}>
                    <Text style={{ fontSize: 15 }}>{meta.emoji}</Text>
                  </View>
                  <Text style={[styles.catName, { color: fg }]}>{cat}</Text>
                </View>

                <View style={styles.rowRight}>
                  <View style={[styles.track, { backgroundColor: trackBg }]}>
                    <View style={[styles.fill, { width: `${pct}%`, backgroundColor: meta.color }]} />
                  </View>
                  <Text style={[styles.countText, { color: meta.color }]}>{count}</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,           // ← sharp
    padding: 18,
    gap: 16,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  emptyBox: {
    borderRadius: 0,           // ← sharp
    padding: 14,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 100,
  },
  emojiBox: {
    width: 32,
    height: 32,
    borderRadius: 2,           // ← sharp
    alignItems: "center",
    justifyContent: "center",
  },
  catName: {
    fontSize: 13,
    fontWeight: "600",
  },
  rowRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: 0,           // ← sharp bar
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 0,
  },
  countText: {
    fontSize: 13,
    fontWeight: "800",
    width: 20,
    textAlign: "right",
  },
});
