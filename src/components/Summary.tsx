import { SettingsContext } from "@/context/SettingsContext";
import { generate } from "@/utils/ai";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

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
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);

  useEffect(() => {
    if (!settings.useAi) return;
    if (!isSummaryVisible) return;

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

  if (!isSummaryVisible)
    return (
      <View style={styles.container}>
        <Ionicons
          name="chevron-down"
          size={20}
          onPress={() => setIsSummaryVisible(true)}
        />
      </View>
    );

  return (
    <>
      {settings.useAi && (
        <View style={styles.container}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Text style={styles.title}>AI概要</Text>
            <Ionicons
              name="information-circle"
              size={16}
              onPress={() =>
                Alert.alert(
                  "AI概要",
                  "AIが生成する回答には、誤りや不正確な情報が含まれる場合があります。\nAIの回答は参考情報として利用し、内容を必ずしも正しいものとして扱わないでください。",
                )
              }
            />
          </View>
          {isGenerating ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <Text style={styles.content}>
              {summary ?? "概要を取得できませんでした。"}
            </Text>
          )}
          <Ionicons
            name="chevron-up"
            size={20}
            onPress={() => setIsSummaryVisible(false)}
          />
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
