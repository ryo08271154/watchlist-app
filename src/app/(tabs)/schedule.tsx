import { SettingsContext } from "@/context/SettingsContext";
import { useServerValidation } from "@/hooks/useServerValidation";
import { SectionItem } from "@/types/section";
import { parseSection } from "@/utils/parse";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Calendar from "expo-calendar";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ScheduleScreen() {
  const { settings } = useContext(SettingsContext);
  const [sections, setSections] = useState<SectionItem[][]>([]);
  const calendarRef = useRef<Calendar.ExpoCalendar | null>(null);
  const isInitializing = useRef(false);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { isValidating } = useServerValidation();

  async function getSchedule() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    try {
      const response = await fetch(
        `${settings.serverUrl}/watch_schedule?status=watching&start_date=${startDate.toLocaleDateString("ja-JP").replaceAll("/", "-")}&end_date=${endDate.toLocaleDateString("ja-JP").replaceAll("/", "-")}`,
      );

      const sections = await parseSection(
        await response.text(),
        settings.serverUrl,
      );

      await AsyncStorage.setItem("schedule", JSON.stringify(sections));

      setSections(sections);
    } catch {}
  }

  useEffect(() => {
    (async () => {
      try {
        const cachedEpisodes = await AsyncStorage.getItem("schedule");
        if (cachedEpisodes) {
          setSections(JSON.parse(cachedEpisodes));
        }
      } catch (error) {
        console.log(error);
      }
    })();

    if (isValidating) return;
    getSchedule();
  }, [isValidating]);

  async function createCalendar() {
    const newCalendar = await Calendar.createCalendar({
      id: "watchlist",
      name: "視聴記録",
      title: "視聴記録",
      source: {
        type: "local",
        id: "watchlist",
        name: "視聴記録",
        isLocalAccount: true,
      },
      color: "blue",
      entityType: Calendar.EntityTypes.EVENT,
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
      ownerAccount: "watchlist",
      timeZone: "Asia/Tokyo",
    });

    console.log("createCalendar", newCalendar);

    calendarRef.current = newCalendar;
    await AsyncStorage.setItem("calendarId", newCalendar.id);
  }

  async function initializeCalendar() {
    try {
      const calendarId = await AsyncStorage.getItem("calendarId");
      if (!calendarId) {
        await createCalendar();
        return;
      }

      //カレンダー取得
      const calendar = await Calendar.ExpoCalendar.get(calendarId);

      if (!calendar || calendar.source.id !== "視聴記録") {
        Alert.alert(
          "カレンダーが見つかりません",
          "カレンダーを作成しますか？",
          [
            { text: "キャンセル", style: "cancel" },
            { text: "OK", onPress: createCalendar },
          ],
        );
        return;
      }

      calendarRef.current = calendar;
    } catch (e: any) {
      // カレンダーが消されたとき
      if (e.message === "setPrototypeOf argument is not coercible to Object") {
        createCalendar();
      }
    }
  }

  async function createEvent(
    calendar: Calendar.ExpoCalendar,
    title: string,
    url: string,
    notes: string,
    startDate: Date,
    endDate: Date,
  ) {
    // 重複防止
    const eventList = await calendar.listEvents(startDate, endDate);
    const event = eventList.find((event) => event.notes === notes);

    if (event) {
      // 更新する
      event.update({
        title: title,
        url: url,
        notes: notes,
        startDate: startDate,
        endDate: endDate,
        timeZone: "Asia/Tokyo",
      });

      console.log("updateEvent", event);
    } else {
      // 作成する
      const event = await calendar?.createEvent({
        title: title,
        url: url,
        notes: notes,
        startDate: startDate,
        endDate: endDate,
        timeZone: "Asia/Tokyo",
      });

      console.log("createEvent", event);
    }
  }

  async function addEpisodesToCalendarEvents() {
    if (!calendarRef.current) return;
    try {
      // 予定追加
      for (const section of sections) {
        for (const episode of section) {
          const descriptionLines = episode.description.split("\n");
          const title = descriptionLines[1];

          const date =
            descriptionLines[0]
              .replace("年", "-")
              .replace("月", "-")
              .replace("日", "T")
              .replace(":", ":") + ":00";

          const startDate = new Date(date);
          const endDate = new Date(startDate);
          endDate.setMinutes(endDate.getMinutes() + 30);

          await createEvent(
            calendarRef.current,
            `${title} ${episode.name}${episode.episodeTitle ? ` ${episode.episodeTitle}` : ""}`,
            episode.url,
            `${episode.url}`,
            startDate,
            endDate,
          );
        }
      }
    } catch (e: any) {}
  }

  // カレンダー作成
  useEffect(() => {
    if (
      Constants.appOwnership === "expo" ||
      Constants.executionEnvironment === "storeClient"
    ) {
      return;
    }

    if (!settings.useCalendar) return;

    (async () => {
      const { status } = await Calendar.requestCalendarPermissions();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "カレンダーの権限が許可されていません",
          text2: "設定から許可してください",
        });
        return;
      }

      if (!calendarRef.current && !isInitializing.current) {
        isInitializing.current = true;

        // カレンダー登録
        await initializeCalendar();

        isInitializing.current = false;
      }

      // 予定追加
      await addEpisodesToCalendarEvents();
    })();
  }, [sections]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getSchedule();
            setRefreshing(false);
          }}
        />
      }
    >
      {sections.map((items, index) => {
        // 何もない日は表示しない
        if (items.length === 0) return null;

        const date = new Date(
          items[0].description
            .split("\n")[0]
            .replace("年", "-")
            .replace("月", "-")
            .replace("日", "T")
            .replace(":", ":") + ":00",
        );

        return (
          <View key={index}>
            <Text style={styles.title}>
              {date.toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                weekday: "long",
              })}
            </Text>

            <ScrollView horizontal style={styles.section}>
              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.titleItem}
                  onPress={() => router.push(`/detail?url=${item.url}`)}
                >
                  <View style={styles.episodeItem}>
                    <Text style={styles.episodeTitle} numberOfLines={2}>
                      {item.episodeTitle}
                    </Text>
                  </View>

                  <Text numberOfLines={2}>{item.name}</Text>
                  <Text numberOfLines={2}>{item.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    minHeight: 200,
  },
  titleItem: {
    width: 150,
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },

  episodeItem: {
    height: 100,
    backgroundColor: "#e0f2f7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  episodeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1565c0",
    textAlign: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  text: {
    fontSize: 12,
    color: "#000",
    marginBottom: 2,
  },
});
