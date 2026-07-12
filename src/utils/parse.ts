import { SectionItem } from "@/types/section";
import { parseHTML } from "linkedom";

export function parseSection(
  html: string,
  watchlistUrl: string,
): SectionItem[][] {
  const { document } = parseHTML(html);

  const containers = document.getElementsByClassName("title-container");

  const results: SectionItem[][] = [];

  for (let i = 0; i < containers.length; i++) {
    const items = containers[i].getElementsByTagName("a");

    const group: SectionItem[] = [];

    for (let j = 0; j < items.length; j++) {
      const item = items[j];

      const href = item.getAttribute("href") ?? "";

      const h3s = [...item.getElementsByTagName("h3")];

      let name = h3s[0].textContent;
      let episodeTitle = "";

      //エピソードの場合
      if (h3s.length == 2) {
        name = h3s[1].textContent;
        episodeTitle = h3s[0].textContent;
      }

      group.push({
        id: href.split("/").pop() ?? "",
        name: name ?? "",
        description:
          Array.from(item.getElementsByTagName("p"))
            .map((p) => p.textContent?.trim() ?? "")
            .join("\n") ?? "",
        episodeTitle: episodeTitle ?? "",
        url: new URL(href, watchlistUrl).href,
      });
    }

    results.push(group);
  }

  return results;
}
