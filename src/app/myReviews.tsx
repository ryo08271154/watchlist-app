import { MyReview } from "@/components/MyReview";
import { useServerValidation } from "@/hooks/useServerValidation";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function Layout() {
  const { isValidating } = useServerValidation();
  if (isValidating) return null;

  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="タイトル"
          component={() => <MyReview type="record" />}
        />
        <Tab.Screen
          name="エピソード"
          component={() => <MyReview type="episode_record" />}
        />
      </Tab.Navigator>
    </>
  );
}
