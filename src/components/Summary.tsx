import { SettingsContext } from "@/context/SettingsContext";
import { generate } from "@/utils/ai";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

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
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    if (!settings.useAi) return;

    // 読み込みが完了してからAI概要を生成する
    if (refreshing) {
      setSummary("");
      setIsGenerating(true);
      return;
    }
    if (!refreshing && !isGenerating) return;

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
        <View style={styles.container}>
          <Text style={styles.title}>AI概要</Text>
          {isGenerating ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <Text style={styles.content}>
              {summary ?? "概要を取得できませんでした。"}
            </Text>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: "#333",
  },
  loading: {
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
