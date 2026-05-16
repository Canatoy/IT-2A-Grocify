import { GroceryCategory, GroceryPriority, useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

const categories: GroceryCategory[] = ["Produce", "Dairy", "Bakery", "Pantry", "Snacks"];
const priorities: GroceryPriority[] = ["low", "medium", "high"];

const categoryMeta: Record<GroceryCategory, { icon: string; emoji: string }> = {
  Produce: { icon: "leaf",        emoji: "🥦" },
  Dairy:   { icon: "cow",         emoji: "🥛" },
  Bakery:  { icon: "bread-slice", emoji: "🍞" },
  Pantry:  { icon: "box-open",    emoji: "🥫" },
  Snacks:  { icon: "cookie-bite", emoji: "🍪" },
};

const priorityMeta: Record<GroceryPriority, { icon: string; color: string; label: string }> = {
  low:    { icon: "seedling", color: "#86efac", label: "Low"    },
  medium: { icon: "compass",  color: "#fde68a", label: "Medium" },
  high:   { icon: "bolt",     color: "#fca5a5", label: "High"   },
};

const PlannerFormCard = () => {
  const { error, addItem } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [name, setName]         = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<GroceryCategory>("Produce");
  const [priority, setPriority] = useState<GroceryPriority>("medium");

  const canCreate = name.trim().length > 0;
  const bg     = isDark ? "#0f172a" : "#ffffff";
  const bg2    = isDark ? "#1e293b" : "#f8fafc";
  const fg     = isDark ? "#f1f5f9" : "#0f172a";
  const muted  = isDark ? "#64748b" : "#94a3b8";
  const border = isDark ? "#1e293b" : "#e2e8f0";

  const createItem = async () => {
    await addItem({ name: name.trim(), category, priority, quantity });
    setName("");
    setQuantity(1);
    setCategory("Produce");
    setPriority("medium");
  };

  return (
    <View style={[styles.card, { backgroundColor: bg }]}>

      {/* NAME */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: muted }]}>What do you need?</Text>
        <View style={[styles.inputRow, { backgroundColor: bg2, borderColor: border }]}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Blueberries, Oat milk…"
            placeholderTextColor={muted}
            style={[styles.input, { color: fg }]}
          />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: border }]} />

      {/* QUANTITY */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: muted }]}>How many?</Text>
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={[styles.stepperBtn, { backgroundColor: bg2, borderColor: border }]}
          >
            <FontAwesome6 name="minus" size={14} color={muted} />
          </Pressable>
          <Text style={[styles.stepperNum, { color: fg }]}>{quantity}</Text>
          <Pressable
            onPress={() => setQuantity(quantity + 1)}
            style={[styles.stepperBtn, { backgroundColor: bg2, borderColor: border }]}
          >
            <FontAwesome6 name="plus" size={14} color={muted} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: border }]} />

      {/* CATEGORY */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: muted }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((opt) => {
            const active = opt === category;
            return (
              <Pressable
                key={opt}
                onPress={() => setCategory(opt)}
                style={[
                  styles.categoryTile,
                  {
                    backgroundColor: active ? "#1d4ed8" : bg2,
                    borderColor: active ? "#1d4ed8" : border,
                  },
                ]}
              >
                <Text style={{ fontSize: 20 }}>{categoryMeta[opt].emoji}</Text>
                <Text style={[styles.categoryTileText, { color: active ? "#fff" : muted }]}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: border }]} />

      {/* PRIORITY */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: muted }]}>Priority</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {priorities.map((opt) => {
            const active = opt === priority;
            const meta = priorityMeta[opt];
            return (
              <Pressable
                key={opt}
                onPress={() => setPriority(opt)}
                style={[
                  styles.priorityBtn,
                  {
                    backgroundColor: active ? meta.color + "33" : bg2,
                    borderColor: active ? meta.color : border,
                    borderWidth: active ? 2 : 1,
                  },
                ]}
              >
                <FontAwesome6 name={meta.icon} size={13} color={active ? meta.color : muted} />
                <Text style={[styles.priorityBtnText, { color: active ? meta.color : muted }]}>
                  {meta.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ADD BUTTON */}
      <Pressable
        onPress={createItem}
        disabled={!canCreate}
        style={[
          styles.addBtn,
          {
            backgroundColor: canCreate ? "#a3e635" : (isDark ? "#1e293b" : "#f1f5f9"),
            opacity: canCreate ? 1 : 0.6,
          },
        ]}
      >
        <FontAwesome6 name="plus" size={15} color={canCreate ? "#1a2e05" : muted} />
        <Text style={[styles.addBtnText, { color: canCreate ? "#1a2e05" : muted }]}>
          Add to list
        </Text>
      </Pressable>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: "#fca5a522", borderColor: "#fca5a5" }]}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#ef4444", textAlign: "center" }}>
            {error}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,           // ← sharp
    overflow: "hidden",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 0,           // ← sharp
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 0,           // ← sharp
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperNum: {
    flex: 1,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  categoryTile: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,           // ← sharp
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 4,
    minWidth: 60,
  },
  categoryTileText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  priorityBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 0,           // ← sharp
  },
  priorityBtnText: {
    fontSize: 13,
    fontWeight: "700",
  },
  addBtn: {
    margin: 20,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 0,           // ← sharp
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  errorBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 0,           // ← sharp
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});

export default PlannerFormCard;
