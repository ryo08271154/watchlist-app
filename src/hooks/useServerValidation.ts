import { SettingsContext } from "@/context/SettingsContext";
import { checkServerStatus } from "@/utils/server";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export function useServerValidation() {
  const { settings } = useContext(SettingsContext);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    if (!settings.serverUrl) {
      router.replace("/settings/setup");
      return;
    }

    (async () => {
      if (!(await checkServerStatus(settings.serverUrl))) {
        Toast.show({
          type: "error",
          text1: "サーバーに接続できませんでした",
          text2: "現在オフラインのため一部のページの表示のみできます。",
        });
      } else {
        setIsValidating(false);
      }
    })();
  }, [settings.serverUrl]);
  return { isValidating };
}
