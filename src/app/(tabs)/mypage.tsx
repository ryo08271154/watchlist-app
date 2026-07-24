import { Mypage } from "@/components/Mypage";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function MyPageScreen() {
  return (
    <>
      <Tab.Navigator>
        <Tab.Screen name="タイトル" component={() => <Mypage tab="titles" />} />
        <Tab.Screen
          name="エピソード"
          component={() => <Mypage tab="episodes" />}
        />
      </Tab.Navigator>
    </>
  );
}
