import Ionicons from "@react-native-vector-icons/ionicons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export function Offline() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.card}>
        <Ionicons
          name="cloud-offline-outline"
          size={28}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.title}>オフライン</Text>
        <Text style={styles.message}>
          サーバーに接続できないためこのページは表示できません
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  card: {
    backgroundColor: "#B00020",
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    minWidth: 220,
  },
  icon: {
    marginBottom: 6,
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
});
