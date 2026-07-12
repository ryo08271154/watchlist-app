export async function redirectSystemPath({
  path,
  initial,
}: {
  path: string;
  initial: boolean;
}) {
  try {
    if (new URL(path).hostname === "expo-sharing") {
      return "/share";
    }
    return path;
  } catch {
    return "/";
  }
}
