import { SectionListView } from "@/components/SectionListView";
import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useState } from "react";

type Props = {
  type: string;
};

export function MyReviews({ type }: Props) {
  const { settings } = useContext(SettingsContext);
  const [reviews, setReviews] = useState<SectionItem[]>([]);
  const { isValidating } = useServerValidation();

  async function getReviews() {
    if (isValidating) return;

    try {
      const response = await fetch(
        `${settings.serverUrl}/mypage/reviews?type=${type}`,
      );
      const sections = await parseSection(
        await response.text(),
        settings.serverUrl,
      );
      const flatSections = sections.flat();
      setReviews(flatSections);

      await AsyncStorage.setItem(
        `myReviews:${type}`,
        JSON.stringify(flatSections),
      );
    } catch {}
  }

  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(`myReviews:${type}`);
        if (cached) {
          setReviews(JSON.parse(cached));
        }
      } catch (error) {
        console.log(error);
      }
    })();

    getReviews();
  }, [isValidating]);

  return <SectionListView data={reviews} onRefresh={getReviews} />;
}
