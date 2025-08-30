import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Switch } from "react-native";
const ButtonSwitch = () => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [isEnabled, setIsEnabled] = useState(colorScheme === "dark");

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem("theme");
            if (savedTheme === "dark" || savedTheme === "light") {
                setColorScheme(savedTheme);
                setIsEnabled(savedTheme === "dark");
            }
        };
        loadTheme();
    }, [setColorScheme]);

    const toggleSwitch = () => {
        const newScheme = isEnabled ? "light" : "dark";
        setIsEnabled(!isEnabled);
        setColorScheme(newScheme);
        AsyncStorage.setItem("theme", newScheme);
        Haptics.selectionAsync();
    };

    return <Switch onValueChange={toggleSwitch} value={isEnabled} />;
};

export default ButtonSwitch;
