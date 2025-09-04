import { useIsFocused } from "@react-navigation/native";
import { MotiView } from "moti";
import React from "react";
import { Platform, SafeAreaView } from "react-native";
import GetLocation from "./get-location";
const Location = () => {
    const isFocused = useIsFocused();
    return (
        <SafeAreaView className="bg-zinc-200 dark:bg-zinc-900 flex-1">
            <MotiView
                from={{ opacity: 0, scale: isFocused ? 1 : 0.98 }}
                animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.98 }}
                transition={{ type: 'timing', duration: 200, delay: 0 }}
                className='flex-1 bg-zinc-100 dark:bg-black/95'
            >

                {
                    Platform.OS === "web" ? (
                        null
                    ) : (
                        <GetLocation show={true} type="standard" />
                    )
                }
            </MotiView>
        </SafeAreaView>
    );
};

export default Location;
