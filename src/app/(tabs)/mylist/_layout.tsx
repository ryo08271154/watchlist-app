import { SettingsContext } from "@/context/SettingsContext";
import Ionicons from "@react-native-vector-icons/ionicons";
import { router, Stack } from "expo-router";
import { useContext } from "react";
import { TouchableOpacity } from "react-native";

export default function MylistLayout() {
  const { settings } = useContext(SettingsContext);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "マイリスト",
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push(`/detail?url=${settings.serverUrl}/mylist/new`)
              }
            >
              <Ionicons size={28} name="add" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "マイリスト詳細",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/mylist")}>
              <Ionicons size={28} name="arrow-back" />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
