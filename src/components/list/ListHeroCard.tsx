import { useGroceryStore } from "@/store/grocery-store";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Text, View, StyleSheet } from "react-native";

const BG_PHOTOS = [
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=75",
  "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&q=75",
  "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=800&q=75",
];
const bgUri = BG_PHOTOS[Math.floor(Date.now() / 86400000) % BG_PHOTOS.length];

const ListHeroCard = () => {
  const { items } = useGroceryStore();

  const completedCount = items.filter((item) => item.purchased).length;
  const pendingCount   = items.length - completedCount;
  const completionRate = items.length
    ? Math.round((completedCount / items.length) * 100)
    : 0;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: bgUri }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={500}
      />
      <LinearGradient
        colors={["rgba(10,20,50,0.55)", "rgba(10,20,80,0.82)"]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Text style={styles.eyebrow}>Today's grocery run</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>items left</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBlock}>
            <Text style={[styles.statNumber, { color: "#a3e635" }]}>{completionRate}%</Text>
            <Text style={styles.statLabel}>complete</Text>
          </View>
        </View>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${completionRate}%` as `${number}%` }]} />
        </View>

        <Text style={styles.subtext}>
          {completedCount} done · {items.length} total
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,           // ← sharp
    overflow: "hidden",
    minHeight: 180,
  },
  content: {
    padding: 22,
    gap: 4,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 3,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 16,
  },
  statBlock: {
    gap: 2,
  },
  statNumber: {
    fontSize: 52,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -2,
    lineHeight: 56,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: 52,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 4,
  },
  track: {
    height: 4,
    borderRadius: 99,          // ← progress bar stays pill
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  fill: {
    height: 4,
    borderRadius: 99,
    backgroundColor: "#a3e635",
  },
  subtext: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
});

export default ListHeroCard;
