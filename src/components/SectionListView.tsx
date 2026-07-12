import { SectionItem } from "@/types/section";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type Props = {
  data: SectionItem[];
  onRefresh: () => Promise<void>;
};

export function SectionListView({ data, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push(`/detail?url=${item.url}`)}
        >
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
        </TouchableOpacity>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await onRefresh();
            setRefreshing(false);
          }}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
