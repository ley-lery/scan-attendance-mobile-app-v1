import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    (async () => {
      try {
        const storedValue = await AsyncStorage.getItem(key);
        if (storedValue) {
          setValue(JSON.parse(storedValue));
        }
      } catch (err) {
        console.error("AsyncStorage Error:", err);
      }
    })();
  }, [key]);

  const updateValue = async (newValue: T) => {
    setValue(newValue);
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue] as const;
}
