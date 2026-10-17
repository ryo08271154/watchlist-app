import { ConfigContext } from "expo/config";

module.exports = ({ config }: ConfigContext) => {
  const isMetaHorizonStore = process.env.EXPO_PUBLIC_STORE === "metahorizon";

  return {
    ...config,
    android: {
      ...config.android,
      blockedPermissions: isMetaHorizonStore
        ? [
            ...(config.android?.blockedPermissions ?? []),
            "android.permission.READ_CALENDAR",
            "android.permission.WRITE_CALENDAR",
          ]
        : config.android?.blockedPermissions,
    },
  };
};
