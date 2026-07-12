import * as Application from "expo-application";
import * as Device from "expo-device";
import { useEffect, useState } from "react";

export function useUpdateCheck() {
  const [latestVersion, setLatestVersion] = useState<string>("");
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [updateDescription, setUpdateDescription] = useState<string>("");

  useEffect(() => {
    (async () => {
      if (Device.brand === "oculus") return;

      try {
        const currentVersion = Application.nativeApplicationVersion;
        if (!currentVersion) return;

        const response = await fetch(
          "https://api.github.com/repos/ryo08271154/watchlist-app/releases/latest",
        );
        if (!response.ok) return;

        const data = await response.json();
        const fetchedVersion = data.tag_name.replace("v", "");

        setLatestVersion(fetchedVersion);
        setIsUpdateAvailable(currentVersion !== fetchedVersion);
        setUpdateDescription(data.body);
      } catch (error) {
        console.log("Failed to check for updates:", error);
      }
    })();
  }, []);

  return {
    latestVersion,
    isUpdateAvailable,
    updateDescription,
  };
}
