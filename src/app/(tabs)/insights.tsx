import ClearCompletedButton from "@/components/insights/ClearCompletedButton";
import InsightsCategorySection from "@/components/insights/InsightsCategorySection";
import InsightsPrioritySection from "@/components/insights/InsightsPrioritySection";
import InsightsStatsSection from "@/components/insights/InsightsStatsSection";
import SentryFeedbackButton from "@/components/insights/SentryFeedbackButton";
import ThemeToggle from "@/components/insights/ThemeToggle";
import UserProfile from "@/components/insights/UserProfile";
import TabScreenBackground from "@/components/TabScreenBackground";
import { ScrollView, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

const InsightsScreen = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const bg = isDark ? "#0a0f1e" : "#f8fafc";
  const fg = isDark ? "#f1f5f9" : "#0f172a";
  const muted = isDark ? "#64748b" : "#94a3b8";

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: bg }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 120 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <TabScreenBackground />

        <View style={{ gap: 4, paddingTop: 20 }}>
          <Text style={{ fontSize: 10, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase", color: muted }}>
            Your stats
          </Text>
          <Text style={{ fontSize: 30, fontWeight: "900", letterSpacing: -0.5, color: fg }}>
            Insights
          </Text>
        </View>

        <UserProfile />
        <ThemeToggle />
        <InsightsStatsSection />
        <InsightsCategorySection />
        <InsightsPrioritySection />
        <ClearCompletedButton />
      </ScrollView>

      <SentryFeedbackButton />
    </>
  );
};

export default InsightsScreen;
