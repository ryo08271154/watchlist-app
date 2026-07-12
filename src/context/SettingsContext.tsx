import { Settings } from "@/types/settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

type SettingsContextType = {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  resetSettings: () => Promise<void>;
};
export const SettingsContext = createContext<SettingsContextType>({
  settings: { serverUrl: "", useCalendar: false },
  setSettings: () => {},
  resetSettings: async () => {},
});

export const SettingsProvider: FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] = useState<Settings>({
    serverUrl: "",
    useCalendar: false,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  async function loadSettings() {
    const data = await AsyncStorage.getItem("settings");
    if (data) {
      const saved: Settings = JSON.parse(data);
      setSettings(saved);
    }

    setIsLoaded(true);
  }

  async function saveSettings(data: Settings) {
    await AsyncStorage.setItem("settings", JSON.stringify(data));
  }

  async function resetSettings() {
    await AsyncStorage.removeItem("settings");
    setSettings({ serverUrl: "", useCalendar: false });
    await loadSettings();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveSettings(settings);
  }, [settings]);

  if (!isLoaded) return null;
  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
