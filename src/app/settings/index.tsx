import { UpdateAvailable } from "@/components/UpdateAvailable";
import { SettingsContext } from "@/context/SettingsContext";
import { useUpdateCheck } from "@/hooks/useUpdateCheck";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reloadAppAsync } from "expo";
import * as Application from "expo-application";
import * as Calendar from "expo-calendar";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useContext } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
} from "react-native";

export default function SettingsScreen() {
  const { settings, setSettings, resetSettings } = useContext(SettingsContext);
  const { latestVersion, isUpdateAvailable, updateDescription } =
    useUpdateCheck();
  const router = useRouter();

  async function deleteCalendar() {
    try {
      const calendarId = await AsyncStorage.getItem("calendarId");
      if (!calendarId) return;

      const calendar = await Calendar.ExpoCalendar.get(calendarId);

      await AsyncStorage.removeItem("calendarId");
      calendar.delete();

      Alert.alert("削除", "カレンダーを削除しました", [
        { text: "OK", onPress: reloadAppAsync },
      ]);

      await AsyncStorage.removeItem("calendarEventIds");
    } catch {
      Alert.alert("エラー", "カレンダーを削除できませんでした");
    }
  }

  function launchNotice() {
    if (
      Constants.appOwnership === "expo" ||
      Constants.executionEnvironment === "storeClient"
    ) {
      // Expo Goでは表示不可
      Alert.alert(
        "Notice",
        "Open source licenses are not available in Expo Go.",
      );
      return;
    }
    const { ReactNativeLegal } = require("react-native-legal");
    ReactNativeLegal.launchLicenseListScreen("OSS Notice");
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>サーバーURL</Text>
      <Button
        onPress={() => router.replace("/settings/setup")}
        title="サーバーURL設定"
      />

      <Text style={styles.title}>
        カレンダーアプリに視聴スケジュールを表示する
      </Text>
      <Switch
        value={settings.useCalendar}
        onValueChange={async (value) => {
          if (value === false) {
            await deleteCalendar();
          }
          setSettings({ ...settings, useCalendar: value });
        }}
      />

      <Text style={styles.title}>このアプリについて</Text>
      <Text style={styles.description}>
        バージョン：{Application.nativeApplicationVersion}
      </Text>
      <Button
        onPress={() =>
          openBrowserAsync(
            "https://github.com/ryo08271154/watchlist-app/releases/latest",
          )
        }
        title="GitHub"
      />

      {isUpdateAvailable && (
        <UpdateAvailable
          version={latestVersion}
          description={updateDescription}
        />
      )}

      <Button onPress={launchNotice} title="オープンソースライセンス" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 24,
    gap: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "#666",
    marginBottom: 12,
  },
  emptyMessage: {
    color: "#999",
  },
  infoText: {
    color: "#333",
  },
});
