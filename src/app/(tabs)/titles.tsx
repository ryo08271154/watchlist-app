import { SectionListView } from "@/components/SectionListView";
import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";

export default function TitlesScreen() {
  const { settings } = useContext(SettingsContext);
  const router = useRouter();
  const [titles, setTitles] = useState<SectionItem[]>([]);
  const { isValidating } = useServerValidation();

  async function getTitles() {
    try {
      const response = await fetch(`${settings.serverUrl}/titles/?sort=title`);
      const section = await parseSection(
        await response.text(),
        settings.serverUrl,
      )[0];

      await AsyncStorage.setItem("titles", JSON.stringify(section));
      setTitles(section);
    } catch {}
  }

  useEffect(() => {
    (async () => {
      try {
        const cachedTitles = await AsyncStorage.getItem("titles");

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
      <SectionListView data={titles} onRefresh={getTitles} />
    </>
  );
}
