import { RoutingWebView } from "@/components/RoutingWebView";
import { SettingsContext } from "@/context/SettingsContext";
import { Stack, useRouter } from "expo-router";
import { useIncomingShare } from "expo-sharing";
import { useContext } from "react";
export default function ShareScreen() {
  const router = useRouter();
  const { settings } = useContext(SettingsContext);
  const { resolvedSharedPayloads, isResolving } = useIncomingShare();

  if (isResolving) {
    return <></>;
  }

  return (
    <>
      <Stack.Screen />
      <RoutingWebView
        url={`/share?text=${resolvedSharedPayloads.map((payload) => payload.value).join(" ")}`}
      />
    </>
  );
}
