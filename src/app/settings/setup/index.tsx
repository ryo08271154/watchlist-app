import { SettingsContext } from "@/context/SettingsContext";
import { getServerStatus } from "@/utils/server";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SetupScreen() {
  const { settings, setSettings, resetSettings } = useContext(SettingsContext);
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(settings.serverUrl);

  async function handleSave() {
    setIsLoading(true);
    const status = await getServerStatus(url);
    if (!status || status.name !== "視聴記録") {
      Alert.alert("エラー", "サーバーURLが正しいか確認してください");
      setIsLoading(false);
      return;
    } else if (status?.v !== 1) {
      Alert.alert("エラー", "アプリをアップデートしてください");
      setIsLoading(false);
      return;
    }

    // カレンダー関係だけ消さないようにする
    const calendarId = await AsyncStorage.getItem("calendarId");
    const calendarEventIds = await AsyncStorage.getItem("calendarEventIds");

    await AsyncStorage.clear();

    if (calendarId) {
      await AsyncStorage.setItem("calendarId", calendarId);
    }

    if (calendarEventIds) {
      await AsyncStorage.setItem("calendarEventIds", calendarEventIds);
    }

    setSettings({ ...settings, serverUrl: url });

    setIsLoading(false);

    router.replace("/");
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
        <Text>接続中</Text>
        <Text>完了まで数分かかる場合があります。</Text>
      </View>
    );
  }

  return (
    <>
      <Text>サーバーURL</Text>
      <TextInput value={url} onChangeText={setUrl} keyboardType="url" />
      <Button title="接続" onPress={handleSave} />
    </>
  );
}
