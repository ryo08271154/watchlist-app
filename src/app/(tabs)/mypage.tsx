import { Mypage } from "@/components/Mypage";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";

const routes = [
  { key: "titles", title: "タイトル" },
  { key: "episodes", title: "エピソード" },
];

export default function MyPageScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  return (
    <TabView
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderScene={({ route }) => (
        <Mypage tab={route.key === "titles" ? "titles" : "episodes"} />
      )}
    />
  );
}
