import PlannerFormCard from "@/components/planner/PlannerFormCard";
import PlannerHeroImage from "@/components/planner/PlannerHeroImage";
import TabScreenBackground from "@/components/TabScreenBackground";
import { useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useColorScheme } from "nativewind";

const PlannerScreen = () => {
  const { items } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const bg     = isDark ? "#0a0f1e" : "#f8fafc";
  const cardBg = isDark ? "#0f172a" : "#ffffff";
  const fg     = isDark ? "#f1f5f9" : "#0f172a";
  const muted  = isDark ? "#64748b" : "#94a3b8";
  const border = isDark ? "#1e293b" : "#e2e8f0";

  const pendingCount = items.filter((item) => !item.purchased).length;
  const highPriorityCount = items.filter(
    (item) => !item.purchased && item.priority === "high"
  ).length;
  const totalQuantity = items
    .filter((item) => !item.purchased)
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <KeyboardAwareScrollView
      bottomOffset={80}
      contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: bg }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      <TabScreenBackground />

      <View style={[styles.headerCard, { backgroundColor: cardBg, borderColor: border }]}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={[styles.eyebrow, { color: muted }]}>Grocery planner</Text>
            <Text style={[styles.heroTitle, { color: fg }]}>
              Plan smarter,{"\n"}shop calmer.
            </Text>
            <Text style={[styles.heroSub, { color: muted }]}>
              Organize your next grocery run with categories, quantities, and priority.
            </Text>
          </View>
          <View style={[styles.iconBox, { backgroundColor: "#a3e635" }]}>
            <FontAwesome6 name="wand-magic-sparkles" size={18} color="#1a2e05" />
          </View>
        </View>

        <View style={[styles.statsRow, { borderTopColor: border }]}>
          {[
            { label: "Pending",  value: pendingCount },
            { label: "High Pri", value: highPriorityCount },
            { label: "Units",    value: totalQuantity },
          ].map(({ label, value }, i, arr) => (
            <View
              key={label}
              style={[
                styles.statCell,
                i < arr.length - 1 && { borderRightWidth: 1, borderRightColor: border },
              ]}
            >
              <Text style={[styles.statLabel, { color: muted }]}>{label}</Text>
              <Text style={[styles.statValue, { color: fg }]}>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      <PlannerHeroImage />

      <View style={{ paddingHorizontal: 2 }}>
        <Text style={[styles.sectionLabel, { color: muted }]}>Build your list</Text>
        <Text style={[styles.sectionSub, { color: muted }]}>
          Add items with the right quantity, category, and urgency.
        </Text>
      </View>

      <PlannerFormCard />
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 0,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroTitle: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  heroSub: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  statCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sectionSub: {
    marginTop: 4,
    fontSize: 13,
  },
});

export default PlannerScreen;
