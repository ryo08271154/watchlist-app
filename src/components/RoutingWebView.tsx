import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { useNavigation, useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { Offline } from "./Offline";

type Props = {
  url: string;
  onNavigationStateChange?: (navState: any) => void;
};

export function RoutingWebView({ url, onNavigationStateChange }: Props) {
  const webviewRef = useRef<WebView>(null);
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const { settings } = useContext(SettingsContext);

  // タブで再読み込み
  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e: any) => {
      if (navigation.isFocused()) {
        webviewRef.current?.reload();
      }
    });
    return unsubscribe;
  }, [navigation]);

  //設定が正しいかチェック
  const { isValidating } = useServerValidation();
  if (isValidating) return <Offline />;

  if (!settings.serverUrl || !url) return null;
  const source = new URL(url, settings.serverUrl);
  source.searchParams.set("topbar", "1");

  return (
    <WebView
      style={{ flex: 1 }}
      ref={webviewRef}
      source={{ uri: source.toString() }}
      cacheEnabled={true}
      onNavigationStateChange={onNavigationStateChange}
      onShouldStartLoadWithRequest={(request) => {
        const newUrl = new URL(request.url);
        const currentUrl = new URL(`${settings.serverUrl}${url}`);

        if (!newUrl.searchParams.has("topbar")) {
          newUrl.searchParams.set("topbar", "1");
          webviewRef.current?.injectJavaScript(
            `window.location.href = "${newUrl}";true;`,
          );
          return false;
        }

        if (newUrl.pathname === currentUrl.pathname) return true;

        router.push(`/detail?url=${encodeURIComponent(newUrl.toString())}`);
        return false;
      }}
    />
  );
}
