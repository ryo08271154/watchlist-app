import { SectionItem } from "@/types/section";
import { router } from "expo-router";
import { ReactElement, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  data: SectionItem[];
  onRefresh?: () => Promise<void>;
  horizontal?: boolean;
  header?: ReactElement | null;
  footer?: ReactElement | null;
};

export function SectionListView({
  data,
  onRefresh,
  horizontal = false,
  header,
  footer,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      horizontal={horizontal}
      ListHeaderComponent={header}
      ListFooterComponent={footer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.item, horizontal && { maxWidth: 150 }]}
          onPress={() => router.push(`/detail?url=${item.url}`)}
        >
          <Text style={styles.title}>{item.name}</Text>
          <Text>{item.description}</Text>
        </TouchableOpacity>
      )}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await onRefresh();
              setRefreshing(false);
            }}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    padding: 30,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
  },
});
