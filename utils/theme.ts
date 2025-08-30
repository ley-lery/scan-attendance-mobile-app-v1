import { useColorScheme } from "react-native";

export const useThemeColor = (): string => {
    const colorScheme = useColorScheme();
    return colorScheme === "dark" ? "#fff" : "#000";
};
