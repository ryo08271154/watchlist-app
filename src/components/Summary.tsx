import { SettingsContext } from "@/context/SettingsContext";
import { generate } from "@/utils/ai";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

type Props = {
  prompt: string;
  includeTitles?: boolean;
  includeEpisodes?: boolean;
  refreshing?: boolean;
};
export default function Summary({
  prompt,
  includeTitles = false,
  includeEpisodes = false,
  refreshing = false,
}: Props) {
  const { settings } = useContext(SettingsContext);
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!settings.useAi) return;
    if (!refreshing && summary) return;

    (async () => {
      setIsGenerating(true);
      const result = await generate(prompt, includeTitles, includeEpisodes);
      setSummary(result);
      setIsGenerating(false);
    })();
  }, [settings.useAi, refreshing]);

  if (!settings.useAi) return null;

  return (
    <>
      {settings.useAi && (
        <View>
          {isGenerating ? (
            <ActivityIndicator />
          ) : (
            <Text>{summary ?? "概要を取得できませんでした。"}</Text>
          )}
        </View>
      )}
    </>
  );
}
