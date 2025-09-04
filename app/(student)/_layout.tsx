import TabBar from "@/components/tab/TabBar";
import { useAuth } from "@/contexts/AuthContext";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";

export default function TabsLayout() {
    
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.replace("/");
        } else if (user.role !== "student") {
            router.replace("../(lecturer)/dashboard");
        }
    }, [user]);

    if (!user || user.role !== "student") {
        return null;
    }

    return (
        <Tabs tabBar={(props: any) => <TabBar tab="student" {...props} />}>
            <Tabs.Screen
                name="home"
                options={{headerShown: false}}
            />
            <Tabs.Screen
                name="history"
                options={{headerShown: false}}
            />
            <Tabs.Screen
                name="scan"
                options={{ headerShown: false}}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        router.push("/student-screens/scan");
                    }
                }}
            />
            <Tabs.Screen
                name="location"
                options={{headerShown: false}}       
            />
            <Tabs.Screen
                name="profile"
               options={{headerShown: false}}
            />
        </Tabs>
    );
}
