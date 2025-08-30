import TabBar from "@/components/tab/TabBar";
import { useAuth } from "@/contexts/AuthContext";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";

export default function LecturerTabLayout() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            router.replace("/");
        } else if (user.role !== "lecturer") {
            router.replace("../(student)/home");
        }
    }, [user]);

    if (!user || user.role !== "lecturer") {
        return null;
    }


    return (
         <Tabs tabBar={(props: any) => <TabBar tab="lecturer" {...props} />} >
            <Tabs.Screen
                name="dashboard"
                options={{headerShown: false}}
            />
            <Tabs.Screen
                name="class"
                options={{headerShown: false}}
            />
            <Tabs.Screen
                name="report"
                options={{headerShown: false}}       
            />
            <Tabs.Screen
                name="profile"
               options={{headerShown: false}}
            />
        </Tabs>
    );
}
