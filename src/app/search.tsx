import { RoutingWebView } from "@/components/RoutingWebView";
import { Stack } from "expo-router";
import { useState } from "react";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  return (
    <>
      <Stack.SearchBar
        placeholder="検索"
        autoFocus={true}
        onChangeText={(e) => {
          setQuery(e.nativeEvent.text);
        }}
      />
      <RoutingWebView key={query} url={`/search?topbar=1&q=${query}`} />
    </>
  );
}
