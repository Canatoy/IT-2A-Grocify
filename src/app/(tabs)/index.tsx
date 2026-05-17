import PendingItemCard from "@/components/list/PendingItemCard";
import { useGroceryStore } from "@/store/grocery-store";
import { FlatList, Text, View } from "react-native";
import { useColorScheme } from "nativewind";

import CompletedItems from "@/components/list/CompletedItems";
import ListHeroCard from "@/components/list/ListHeroCard";
import TabScreenBackground from "@/components/TabScreenBackground";

export default function ListScreen() {
  const { items } = useGroceryStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const bg = isDark ? "#0a0f1e" : "#f8fafc";

  const pendingItems = items.filter((item) => !item.purchased);

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: bg }}
      data={pendingItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <PendingItemCard item={item} />}
      contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 120 }}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={{ gap: 14, paddingTop: 20 }}>
          <TabScreenBackground />
          <ListHeroCard />
          <View className="flex-row items-center justify-between px-1 mt-1">
            <Text className="text-xs font-bold uppercase tracking-[1.5px] text-muted-foreground">
              Shopping items
            </Text>
            <View className="bg-primary/10 px-3 py-1">
              <Text className="text-xs font-bold text-primary">
                {pendingItems.length} active
              </Text>
            </View>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View className="items-center justify-center py-12 gap-3">
          <View className="h-16 w-16 items-center justify-center bg-secondary">
            <Text style={{ fontSize: 32 }}>🛒</Text>
          </View>
          <Text className="text-base font-semibold text-foreground">All clear!</Text>
          <Text className="text-sm text-muted-foreground text-center px-8">
            No pending items. Head to Planner to add some.
          </Text>
        </View>
      }
      ListFooterComponent={<CompletedItems />}
    />
  );
}
