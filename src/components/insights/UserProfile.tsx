import { useClerk, useUser } from "@clerk/expo";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";
import { useGroceryStore } from "@/store/grocery-store";

const BANNER_URI =
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=75";

const UserProfile = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const { items } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const email = user?.primaryEmailAddress?.emailAddress;
  const displayName = user?.fullName || email?.split("@")[0];
  const initials = displayName
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const completedCount = items.filter((i) => i.purchased).length;
  const totalCount = items.length;

  return (
    <View style={[styles.card, { backgroundColor: isDark ? "#0f172a" : "#ffffff" }]}>
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={{ uri: BANNER_URI }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={400}
        />
        <LinearGradient
          colors={["rgba(10,20,60,0.3)", "rgba(10,20,60,0.65)"]}
          style={StyleSheet.absoluteFill}
        />
        <Pressable onPress={() => signOut()} style={styles.signOutBtn} hitSlop={8}>
          <FontAwesome6 name="right-from-bracket" size={13} color="rgba(255,255,255,0.8)" />
        </Pressable>
      </View>

      {/* Avatar */}
      <View style={styles.avatarRow}>
        <View style={[styles.avatarRing, { borderColor: isDark ? "#0f172a" : "#ffffff" }]}>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} style={{ width: "100%", height: "100%" }} />
          ) : (
            <>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=60" }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />
              <View style={styles.initialsOverlay}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Name + email */}
      <View style={styles.nameBlock}>
        <Text style={[styles.displayName, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
          {displayName}
        </Text>
        <Text style={[styles.email, { color: isDark ? "#64748b" : "#94a3b8" }]}>{email}</Text>
      </View>

      {/* Stats row */}
      <View style={[styles.statsRow, { borderTopColor: isDark ? "#1e293b" : "#f1f5f9" }]}>
        {[
          { label: "Total",     value: totalCount },
          { label: "Completed", value: completedCount },
          { label: "Pending",   value: totalCount - completedCount },
        ].map(({ label, value }, i, arr) => (
          <View
            key={label}
            style={[
              styles.statCell,
              i < arr.length - 1 && {
                borderRightWidth: 1,
                borderRightColor: isDark ? "#1e293b" : "#f1f5f9",
              },
            ]}
          >
            <Text style={[styles.statValue, { color: isDark ? "#f1f5f9" : "#0f172a" }]}>
              {value}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? "#64748b" : "#94a3b8" }]}>
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Achievement strip */}
      <View style={[styles.achievement, { backgroundColor: isDark ? "#1e293b" : "#f8fafc" }]}>
        <Text style={{ fontSize: 14 }}>🌿</Text>
        <Text style={[styles.achievementText, { color: isDark ? "#94a3b8" : "#64748b" }]}>
          Eco-Shopper — keep that list growing!
        </Text>
      </View>
    </View>
  );
};

const AVATAR_SIZE = 72;

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,           // ← sharp
    overflow: "hidden",
    shadowColor: "#1e3a8a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  banner: {
    height: 90,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 14,
    paddingRight: 16,
  },
  signOutBtn: { padding: 6 },
  avatarRow: {
    marginTop: -(AVATAR_SIZE / 2),
    paddingHorizontal: 20,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2, // ← circle stays circular
    borderWidth: 4,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,20,60,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
  },
  nameBlock: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    gap: 2,
  },
  displayName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  email: { fontSize: 13 },
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
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  achievement: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default UserProfile;
