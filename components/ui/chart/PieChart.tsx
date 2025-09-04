import { Text } from "@/components/tag/Text";
import { useThemeStore } from "@/stores/useThemeStore";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text as TextNative, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

type Month = "January" | "February" | "March" | "April" | "May" | "June" | "July" | "August" | "September" | "October" | "November" | "December";

const monthlyData = {
    January: [
        { label: "Present", value: 50, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 30, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 20, color: "#db2777", gradientCenterColor: "#db2777" },
    ],
    February: [
        { label: "Present", value: 60, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 25, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 15, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    March: [
        { label: "Present", value: 47, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 40, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 13, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    April: [
        { label: "Present", value: 70, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 20, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 10, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    May: [
        { label: "Present", value: 80, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 10, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 10, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    June: [
        { label: "Present", value: 90, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 5, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 5, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    July: [
        { label: "Present", value: 85, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 10, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 5, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    August: [
        { label: "Present", value: 75, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 15, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 10, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    September: [
        { label: "Present", value: 65, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 20, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 15, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    October: [
        { label: "Present", value: 55, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 25, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 20, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    November: [
        { label: "Present", value: 45, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 30, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 25, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
    December: [
        { label: "Present", value: 40, color: "#009FFF", gradientCenterColor: "#06b6d4" },
        { label: "Late", value: 35, color: "#eab308", gradientCenterColor: "#eab308" },
        { label: "Absent", value: 25, color: "#FF7F97", gradientCenterColor: "#FF7F97" },
    ],
};

export const PieChartUI = () => {
    const { t } = useTranslation();
    const theme = useThemeStore((state) => state.theme);
    const [month, setMonth] = useState<Month>("January");
    const [focusedIndex, setFocusedIndex] = useState(0);

    const rawData = monthlyData[month];

    const pieData = rawData.map((item: any, index: number) => ({
        ...item,
        focused: index === focusedIndex,
    }));

    const handleClickAttd = (index: number) => {
        setFocusedIndex(index);
    };

    const renderDot = (color: string) => (
        <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />
    );

    const renderLegendComponent = () => (
        <View className="flex flex-wrap flex-row justify-center mt-2 gap-y-2">
            {rawData.map((item: any, index: number) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleClickAttd(index)}
                    className="flex-row items-center mx-2"
                >
                    {renderDot(item.color)}
                    <Text className="text-zinc-600 dark:text-white">
                        {t(`${item.label}`)}: {item.value}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderMonthSelector = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row mt-2 mb-4 px-2"
        >
            {Object.keys(monthlyData).map((m: any) => (
                <TouchableOpacity
                    key={m}
                    onPress={() => {
                        setMonth(m);
                        setFocusedIndex(0);
                    }}
                    className={`px-6 py-1.5 rounded-full mr-2 ${
                        month === m ? (theme === "1" ? "bg-theme1-primary" : "bg-theme2-primary") : "bg-zinc-200 dark:bg-white/10"
                    }`}
                >
                    <Text
                        className={
                            month === m
                                ? "text-white font-kregular"
                                : "text-zinc-600 dark:text-white font-kregular"
                        }
                    >
                        {t(`months.${m}`)}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    return (
        <View>
            <Text className="text-zinc-400 text-base font-mmedium mb-2">
                {t("monthlyAttendance")}
            </Text>
            {renderMonthSelector()}
            <View className="py-5 items-center">
                <PieChart
                    data={pieData}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={90}
                    innerRadius={60}
                    innerCircleColor={"#22333B"}
                    centerLabelComponent={() => (
                        <View className="items-center justify-center">
                            <TextNative className="text-white text-xl font-bold">
                                {rawData[focusedIndex].value}
                            </TextNative>
                            <TextNative className="text-white text-sm">
                                {rawData[focusedIndex].label}
                            </TextNative>
                        </View>
                    )}
                />
            </View>

            {renderLegendComponent()}
        </View>
    );
};

