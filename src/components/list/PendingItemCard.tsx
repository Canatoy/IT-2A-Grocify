import { GroceryItem, useGroceryStore } from "@/store/grocery-store";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";

const priorityBar: Record<string, string> = {
  low:    "#86efac",
  medium: "#fde68a",
  high:   "#fca5a5",
};

const priorityLabel: Record<string, string> = {
  low:    "LOW",
  medium: "MED",
  high:   "HIGH",
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PendingItemCard = ({ item }: { item: GroceryItem }) => {
  const { removeItem, updateQuantity, togglePurchased } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const scale = useSharedValue(1);
  const checkScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  const handleCheck = () => {
    checkScale.value = withSpring(0.6, { damping: 8 }, () => {
      checkScale.value = withSpring(1.3, { damping: 8 }, () => {
        checkScale.value = withSpring(1);
      });
    });
    togglePurchased(item.id);
  };

  const barColor = priorityBar[item.priority];

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = withSpring(0.97, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      style={cardStyle}
    >
      <View style={[
        styles.card,
        { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
      ]}>
        {/* Priority color slab on left */}
        <View style={[styles.prioritySlab, { backgroundColor: barColor }]}>
          <Text style={styles.prioritySlabText}>{priorityLabel[item.priority]}</Text>
        </View>

        {/* Main content */}
        <View style={styles.body}>
          {/* Top row: name + delete */}
          <View style={styles.topRow}>
            <Text style={[styles.itemName, { color: isDark ? "#f1f5f9" : "#0f172a" }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Pressable onPress={() => removeItem(item.id)} style={styles.deleteBtn} hitSlop={8}>
              <FontAwesome6 name="xmark" size={13} color={isDark ? "#475569" : "#94a3b8"} />
            </Pressable>
          </View>

          {/* Category chip — sharp */}
          <View style={[styles.categoryChip, { backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }]}>
            <Text style={[styles.categoryText, { color: isDark ? "#94a3b8" : "#64748b" }]}>
              {item.category}
            </Text>
          </View>

          {/* Bottom row: stepper + checkbox */}
          <View style={styles.bottomRow}>
            <Pressable
              onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              style={[styles.stepBtn, { borderColor: isDark ? "#1e293b" : "#e2e8f0" }]}
            >
              <FontAwesome6 name="minus" size={10} color={isDark ? "#64748b" : "#94a3b8"} />
            </Pressable>

            <Text style={[styles.qtyText, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
              {item.quantity}
            </Text>

            <Pressable
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              style={[styles.stepBtn, { borderColor: isDark ? "#1e293b" : "#e2e8f0" }]}
            >
              <FontAwesome6 name="plus" size={10} color={isDark ? "#64748b" : "#94a3b8"} />
            </Pressable>

            <View style={{ flex: 1 }} />

            <Animated.View style={checkStyle}>
              <Pressable
                onPress={handleCheck}
                style={[styles.checkbox, {
                  borderColor: "#1d4ed8",
                  backgroundColor: isDark ? "#1e3a8a22" : "#dbeafe",
                }]}
              >
                <FontAwesome6 name="check" size={9} color="#1d4ed8" />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 0,           // ← sharp
    overflow: "hidden",
    borderLeftWidth: 0,
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  prioritySlab: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  prioritySlabText: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "rgba(0,0,0,0.45)",
    transform: [{ rotate: "-90deg" }],
    width: 40,
    textAlign: "center",
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  deleteBtn: {
    padding: 4,
  },
  categoryChip: {
    alignSelf: "flex-start",
    borderRadius: 2,           // ← almost sharp
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 2,           // ← sharp
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "800",
    minWidth: 20,
    textAlign: "center",
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 2,           // ← sharp
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PendingItemCard;
