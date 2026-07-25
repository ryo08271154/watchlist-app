import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SectionListView } from "./SectionListView";

const Title = [
  "視聴中",
  "視聴済み",
  "未視聴",
  "視聴中断",
  "視聴状況不明",
  "マイリスト",
  "視聴中",
  "視聴済み",
  "未視聴",
  "視聴中断",
  "視聴状況不明",
];

type Props = {
  tab: "titles" | "episodes";
};

export function Mypage({ tab }: Props) {
  const router = useRouter();
  const { settings } = useContext(SettingsContext);
  const [sections, setSections] = useState<SectionItem[][]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isValidating } = useServerValidation();

  async function getSections() {
    if (isValidating) return;

    try {
      const response = await fetch(`${settings.serverUrl}/mypage`);
      const data = await parseSection(
        await response.text(),
        settings.serverUrl,
      );

      setSections(data);

      await AsyncStorage.setItem("mypage", JSON.stringify(data));
    } catch {}
  }
  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem("mypage");
        if (cached) {
          setSections(JSON.parse(cached));
        }
      } catch (error) {
        console.log(error);
      }
    })();

    getSections();
  }, [isValidating]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getSections();
            setRefreshing(false);
          }}
        />
      }
    >
      {sections.map((section, index) => {
        if (tab === "titles" && index >= 5) return null;
        if (tab === "episodes" && index <= 5) return null;

        return (
          <View key={index} style={styles.section}>
            <Text style={styles.title}>{Title[index]}</Text>
            {section.length !== 0 && (
              <SectionListView
                data={[
                  ...section,
                  {
                    id: "",
                    name: "",
                    description: "もっと見る",
                    episodeTitle: "",
                    url: `${settings.serverUrl}/mypage/reviews`,
                  },
                ]}
                horizontal={true}
              />
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 16,
    height: 200,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    width: 150,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
});
