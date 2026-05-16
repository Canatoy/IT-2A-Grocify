import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { View, Text, StyleSheet } from "react-native";

const GROCERY_PHOTOS = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=80",
  "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=800&q=80",
];
const heroPhoto = GROCERY_PHOTOS[Math.floor(Date.now() / 3600000) % GROCERY_PHOTOS.length];

const PlannerHeroImage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: heroPhoto }}
        style={styles.image}
        contentFit="cover"
        transition={400}
      />
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(0,0,0,0.35)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { bottom: "50%" }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={["transparent", "rgba(0,0,0,0.55)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { top: "50%" }]}
      />
      <View style={styles.labelContainer}>
        <View style={styles.labelBadge}>
          <Text style={styles.labelText}>🛒  Fresh picks await</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 0,           // ← sharp
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  labelContainer: {
    position: "absolute",
    bottom: 14,
    left: 14,
  },
  labelBadge: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 0,           // ← sharp
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  labelText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default PlannerHeroImage;
