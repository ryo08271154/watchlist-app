import { SectionListView } from "@/components/SectionListView";
import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

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
      <SectionListView data={titles} onRefresh={getTitles} />
    </>
  );
}
