import { SectionListView } from "@/components/SectionListView";
import { SettingsContext } from "@/context/SettingsContext";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import { useContext, useEffect, useState } from "react";

type Props = {
  type: string;
};

export function MyReview({ type }: Props) {
  const { settings } = useContext(SettingsContext);
  const [reviews, setReviews] = useState<SectionItem[]>([]);

  async function getReviews() {
    try {
      const response = await fetch(
        `${settings.serverUrl}/mypage/reviews?type=${type}`,
      );
      const sections = await parseSection(
        await response.text(),
        settings.serverUrl,
      );

      setReviews(sections.flat());
    } catch {}
  }

  useEffect(() => {
    getReviews();
  }, []);

  return <SectionListView data={reviews} onRefresh={getReviews} />;
}
