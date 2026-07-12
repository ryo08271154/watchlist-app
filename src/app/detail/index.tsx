import { useServerValidation } from "@/hooks/useServerValidation";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";

export default function DetailScreen() {
  const webviewRef = useRef<WebView>(null);
  const router = useRouter();
  const canGoBackRef = useRef(false);
  const { url } = useLocalSearchParams<{ url: string }>();
  const [title, setTitle] = useState("");
  const { isValidating } = useServerValidation();

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (canGoBackRef.current) {
            webviewRef.current?.goBack();
            return true;
          }

          return false;
        },
      );

      return () => subscription.remove();
    }, []),
  );

  function redirectToAppRoute(requestPathname: string) {
    if (requestPathname === "/") {
      router.replace("/");
    } else if (requestPathname === "/titles/") {
      router.replace("/titles");
    } else if (requestPathname === "/watch_schedule") {
      router.replace("/schedule");
    } else if (requestPathname === "/search") {
      router.replace("/search");
    } else if (
      requestPathname.startsWith("/mylist") &&
      requestPathname !== "/mylist/new" &&
      !requestPathname.includes("edit")
    ) {
      router.replace({
        pathname: "/(tabs)/mylist/[id]",
        params: {
          id: requestPathname.split("/")[2],
        },
      });
    } else if (requestPathname === "/mypage") {
      router.replace("/mypage");
    }
  }

  useEffect(() => {
    redirectToAppRoute(new URL(url).pathname);
  }, []);

  if (isValidating) return null;

  return (
    <>
      {title && (
        <Stack.Screen
          options={{
            title,
            headerRight: () => (
              <TouchableOpacity onPress={() => webviewRef.current?.reload()}>
                <Ionicons size={28} name="reload" />
              </TouchableOpacity>
            ),
          }}
        />
      )}
      <WebView
        style={{ flex: 1 }}
        ref={webviewRef}
        source={{ uri: `${url}?topbar=1` }}
        cacheEnabled={true}
        onNavigationStateChange={(navState) => {
          canGoBackRef.current = navState.canGoBack;
          if (navState.title) {
            setTitle(navState.title.trim().replace("視聴記録 ", ""));
          }

          //フォーム画面の再表示防止
          if (
            navState.canGoForward &&
            (navState.url.includes("new") || navState.url.includes("edit"))
          ) {
            webviewRef.current?.goBack();
          }
        }}
        onShouldStartLoadWithRequest={(request) => {
          if (!url) return false;
          try {
            const hostname = new URL(request.url).hostname;
            const serverHostname = new URL(url).hostname;
            const requestPathname = new URL(request.url).pathname;

            redirectToAppRoute(requestPathname);

            if (hostname !== serverHostname) {
              openBrowserAsync(request.url);
              return false;
            }

            const newUrl = new URL(request.url);

            if (!newUrl.searchParams.has("topbar")) {
              newUrl.searchParams.set("topbar", "1");
              webviewRef.current?.injectJavaScript(
                `window.location.href = "${newUrl}";true;`,
              );
              return false;
            }
          } catch (error) {
            return false;
          }
          return true;
        }}
      />
    </>
  );
}
