import Ionicons from "@react-native-vector-icons/ionicons";
import * as Device from "expo-device";
import { openBrowserAsync } from "expo-web-browser";
import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
  version: string;
  description: string;
};

export function UpdateAvailable({ version, description }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Ionicons name="cloud-download-outline" size={16} />
        アップデート利用可能 ({version})
      </Text>
      <Text style={styles.description}>
        新しいバージョンが利用可能です。
        {"\n"}
        {description}
      </Text>
      <Button
        title="アップデート"
        color="green"
        onPress={() => {
          if (Device.brand === "oculus") {
          } else {
            openBrowserAsync(
              "https://github.com/ryo08271154/watchlist-app/releases/latest",
            );
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "orange",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    color: "#666",
  },
});
