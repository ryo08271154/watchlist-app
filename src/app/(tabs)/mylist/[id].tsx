import { SectionListView } from "@/components/SectionListView";
import Summary from "@/components/Summary";
import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { BackHandler, TouchableOpacity } from "react-native";

export default function MyListDetailScreen() {
  const { settings } = useContext(SettingsContext);
  const router = useRouter();
  const [titles, setTitles] = useState<SectionItem[]>([]);
  const { isValidating } = useServerValidation();
  const [title, setTitle] = useState("");
  const { id } = useLocalSearchParams<{ id: string }>();

  async function getTitles() {
    try {
      const cachedMyLists = await AsyncStorage.getItem("myLists");
      if (!cachedMyLists) return;
      const myLists = JSON.parse(cachedMyLists) as SectionItem[];
      setTitle(myLists.find((item) => item.id === id)?.name ?? "");

      const response = await fetch(`${settings.serverUrl}/mylist/${id}`);

      const section = await parseSection(
        await response.text(),
        settings.serverUrl,
      )[0];

      await AsyncStorage.setItem(`myLists:${id}`, JSON.stringify(section));
      setTitles(section);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const cachedTitles = await AsyncStorage.getItem(`myLists:${id}`);

        if (cachedTitles) {
          setTitles(JSON.parse(cachedTitles));
        }
      } catch (error) {
        console.error(error);
      }
    })();

    if (isValidating) return;

    getTitles();
  }, [isValidating]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          router.replace("/mylist");
          return true;
        },
      );

      return () => subscription.remove();
    }, []),
  );

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/detail?url=${settings.serverUrl}/mylist/${id}/edit`,
                )
              }
            >
              <Ionicons size={28} name="pencil" />
            </TouchableOpacity>
          ),
        }}
      />
      <SectionListView
        data={titles}
        onRefresh={getTitles}
        header={
          titles.length > 0 ? (
            <Summary
              prompt={`以下はマイリスト「${title}」に登録されている作品の一覧です。作品名、説明から読み取れる内容だけを使い、一覧全体の特徴や共通点、注目すべき作品を日本語で簡潔に5文程度で概要としてまとめてください。データにない作品情報や評価を推測せず、作品をすべて列挙するのではなく、一覧の傾向が伝わる文章にしてください。登録作品:
                ${JSON.stringify(
                  titles.map(({ id, episodeTitle, url, ...rest }: any) => rest),
                )}`}
            />
          ) : null
        }
      />
    </>
  );
}
