import { RoutingWebView } from "@/components/RoutingWebView";
import { useUpdateCheck } from "@/hooks/useUpdateCheck";
import { router } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
export default function HomeScreen() {
  const { latestVersion, isUpdateAvailable } = useUpdateCheck();

  useEffect(() => {
    if (isUpdateAvailable) {
      Toast.show({
        type: "info",
        text1: `アップデート利用可能 (${latestVersion})`,
        text2: "マイページにある設定からアップデートしてください",
        onPress: () => router.push("/settings"),
      });
    }
  }, [isUpdateAvailable]);

  return <RoutingWebView url="/" />;
}
