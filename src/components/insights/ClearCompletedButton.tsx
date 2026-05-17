import { useGroceryStore } from "@/store/grocery-store";
import { useColorScheme } from "nativewind";
import { Pressable, Text } from "react-native";

export default function ClearCompletedButton() {
  const { clearPurchased } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      onPress={clearPurchased}
      style={{
        borderRadius: 0,
        backgroundColor: isDark ? "#1d4ed8" : "#1d4ed8",
        paddingVertical: 14,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: "700", color: "#ffffff" }}>
        Clear completed items
      </Text>
    </Pressable>
  );
}
