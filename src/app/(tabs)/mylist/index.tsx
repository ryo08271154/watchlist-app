import { SectionListView } from "@/components/SectionListView";
import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";

export default function MyListScreen() {
  const { settings } = useContext(SettingsContext);
  const { isValidating } = useServerValidation();
  const [myLists, setMyLists] = useState<SectionItem[]>([]);

  async function getMyLists() {
    try {
      const response = await fetch(`${settings.serverUrl}/mylist`);
      const section = await parseSection(
        await response.text(),
        settings.serverUrl,
      )[0];
      await AsyncStorage.setItem("myLists", JSON.stringify(section));
      setMyLists(section);
    } catch {}
  }

  useEffect(() => {
    (async () => {
      try {
        const cachedMyLists = await AsyncStorage.getItem("myLists");
        if (cachedMyLists) {
          setMyLists(JSON.parse(cachedMyLists));
        }
      } catch (error) {
        console.error(error);
      }
    })();

    if (isValidating) return;
    getMyLists();
  }, [isValidating]);

  return <SectionListView data={myLists} onRefresh={getMyLists} />;
}
