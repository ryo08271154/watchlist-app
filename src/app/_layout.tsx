import { SettingsProvider } from "@/context/SettingsContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ title: "検索" }} />
        <Stack.Screen name="settings" options={{ title: "設定" }} />
        <Stack.Screen
          name="settings/setup"
          options={{ title: "サーバーURL設定" }}
        />
        <Stack.Screen name="detail" options={{ title: "詳細" }} />
        <Stack.Screen
          name="share"
          options={{
            title: "共有から検索",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.replace("/")}>
                <Ionicons size={28} name="arrow-back" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="myReviews"
          options={{
            title: "マイレビュー",
          }}
        />
      </Stack>
      <StatusBar style="dark" />
      <Toast />
    </SettingsProvider>
  );
}
