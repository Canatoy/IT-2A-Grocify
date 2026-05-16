import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

const CompletedItems = () => {
  const { removeItem, togglePurchased, items } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const completedItems = items.filter((item) => item.purchased);

  if (!completedItems.length) return null;

  return (
    <View style={{ marginTop: 8 }}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionLabel, { color: isDark ? "#475569" : "#94a3b8" }]}>
          DONE · {completedItems.length}
        </Text>
        <View style={[styles.headerLine, { backgroundColor: isDark ? "#1e293b" : "#e2e8f0" }]} />
      </View>

      <View style={{ gap: 1, marginTop: 8 }}>
        {completedItems.map((item) => (
          <View
            key={item.id}
            style={[
              styles.row,
              { backgroundColor: isDark ? "#0f172a55" : "#f8fafc" },
            ]}
          >
            <Pressable
              onPress={() => togglePurchased(item.id)}
              style={[styles.doneCheck, { backgroundColor: isDark ? "#1e3a8a44" : "#dbeafe" }]}
            >
              <FontAwesome6 name="check" size={10} color="#1d4ed8" />
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={[styles.doneName, { color: isDark ? "#475569" : "#94a3b8" }]}>
                {item.name}
              </Text>
              <Text style={[styles.doneMeta, { color: isDark ? "#334155" : "#cbd5e1" }]}>
                {item.category} · ×{item.quantity}
              </Text>
            </View>

            <Pressable onPress={() => removeItem(item.id)} hitSlop={8} style={{ padding: 4 }}>
              <FontAwesome6 name="xmark" size={11} color={isDark ? "#334155" : "#cbd5e1"} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  headerLine: {
    flex: 1,
    height: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 0,           // ← sharp
  },
  doneCheck: {
    width: 24,
    height: 24,
    borderRadius: 2,           // ← sharp
    alignItems: "center",
    justifyContent: "center",
  },
  doneName: {
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "line-through",
  },
  doneMeta: {
    fontSize: 11,
    marginTop: 1,
  },
});

export default CompletedItems;
