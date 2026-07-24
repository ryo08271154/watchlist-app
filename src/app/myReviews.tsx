import { MyReviews } from "@/components/MyReviews";
import { createMaterialTopTabNavigator } from "expo-router/js-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function MyReviewsScreen() {
  return (
    <>
      <Tab.Navigator>
        <Tab.Screen
          name="タイトル"
          component={() => <MyReviews type="record" />}
        />
        <Tab.Screen
          name="エピソード"
          component={() => <MyReviews type="episode_record" />}
        />
      </Tab.Navigator>
    </>
  );
}
