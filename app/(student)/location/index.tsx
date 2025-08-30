import React from "react";
import { Platform, SafeAreaView } from "react-native";
import GetLocation from "./get-location";
const Location = () => {
    return (
        <SafeAreaView className="bg-zinc-200 dark:bg-zinc-900 flex-1">
            {
                Platform.OS === "web" ? (
                    null
                ) : (
                    <GetLocation show={true} type="standard" />
                )
            }
        </SafeAreaView>
    );
};

export default Location;
