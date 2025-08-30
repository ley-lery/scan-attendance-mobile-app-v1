import Onboarding from "@/components/ui/onboarding/Onboarding";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

const Index = () => {
    const user = useUserStore((state) => state.users);
    useEffect(() => {
        if (user) {
            router.replace("/(auth)/sign-in");
            console.log(user, 'user');
            return;
        }
    }, [user]);
    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Onboarding />
            {/* <SplashScreen /> */}
        </View>
    );
};

export default Index;
