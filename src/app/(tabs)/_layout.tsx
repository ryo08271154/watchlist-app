import { SettingsContext } from "@/context/SettingsContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Tabs, useRouter } from "expo-router";
import { useContext } from "react";
import { TouchableOpacity, View } from "react-native";

export default function TabLayout() {
  const router = useRouter();
  const { settings } = useContext(SettingsContext);

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "ホーム",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home" color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Ionicons size={28} name="search" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="titles"
        options={{
          title: "タイトル一覧",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="list" color={color} />
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push(
                  `/detail?url=${settings.serverUrl}/titles/import/external`,
                )
              }
            >
              <Ionicons size={28} name="add" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "視聴スケジュール",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mylist"
        options={{
          title: "マイリスト",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="bookmark" color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="mypage"
        options={{
          title: "マイページ",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person" color={color} />
          ),
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/detail?url=${settings.serverUrl}/accounts/profile`,
                  )
                }
              >
                <Ionicons size={28} name="person-circle" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/settings")}>
                <Ionicons size={28} name="settings" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
