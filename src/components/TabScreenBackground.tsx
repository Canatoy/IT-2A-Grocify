import { Image } from "expo-image";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";

// Soft blurred grocery texture — used as a decorative background watermark
const TEXTURE_URI =
  "https://images.unsplash.com/photo-1543168256-418811576931?w=600&q=40&blur=20";

export default function TabScreenBackground() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Grocery texture top-right */}
      <Image
        source={{ uri: TEXTURE_URI }}
        style={[styles.texture, { opacity: isDark ? 0.04 : 0.06 }]}
        contentFit="cover"
        blurRadius={30}
      />

      {/* Lime accent glow top-left */}
      <View
        style={[
          styles.blob,
          styles.blobTopLeft,
          { backgroundColor: isDark ? "rgba(163,230,53,0.06)" : "rgba(163,230,53,0.10)" },
        ]}
      />

      {/* Blue accent glow top-right */}
      <View
        style={[
          styles.blob,
          styles.blobTopRight,
          { backgroundColor: isDark ? "rgba(29,78,216,0.08)" : "rgba(29,78,216,0.06)" },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  texture: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  blob: {
    position: "absolute",
    borderRadius: 9999,
  },
  blobTopLeft: {
    width: 220,
    height: 220,
    top: -60,
    left: -60,
  },
  blobTopRight: {
    width: 260,
    height: 260,
    top: 40,
    right: -80,
  },
});
