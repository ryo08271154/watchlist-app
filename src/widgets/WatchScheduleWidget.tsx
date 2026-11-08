import { SectionItem } from "@/types/section";
import { Box, Column, LazyColumn, Text } from "@expo/ui/jetpack-compose";
import {
  background,
  fillMaxWidth,
  padding,
} from "@expo/ui/jetpack-compose/modifiers";
import { createWidget } from "expo-widgets";

type WatchScheduleWidgetProps = {
  sections: SectionItem[][];
};

function WatchScheduleWidget({ sections }: WatchScheduleWidgetProps) {
  "widget";

  return (
    <LazyColumn modifiers={[background("#fff")]}>
      {sections.map((items, index) => {
        // 何もない日は表示しない
        if (items.length === 0) return null;

        const date = new Date(
          items[0].description
            .split("\n")[0]
            .replace("年", "-")
            .replace("月", "-")
            .replace("日", "T") + ":00",
        );

        return (
          <Column key={index} verticalArrangement={{ spacedBy: 12 }}>
            <Text style={{ typography: "titleLarge" }}>
              {date.toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                weekday: "long",
              })}
            </Text>

            <Column
              verticalArrangement={{ spacedBy: 12 }}
              modifiers={[background("#ddd")]}
            >
              {items.map((item) => (
                <Box
                  key={item.id}
                  modifiers={[fillMaxWidth(), padding(12, 12, 12, 12)]}
                >
                  <Column verticalArrangement={{ spacedBy: 6 }}>
                    <Text style={{ fontSize: 20 }}>{item.episodeTitle}</Text>

                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                    <Text style={{ fontSize: 12 }}>{item.description}</Text>
                  </Column>
                </Box>
              ))}
            </Column>
          </Column>
        );
      })}
    </LazyColumn>
  );
}

export default createWidget("WatchScheduleWidget", WatchScheduleWidget);
