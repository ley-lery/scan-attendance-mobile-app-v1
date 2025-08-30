import { Typography } from "@/godui";
import { useThemeStore } from "@/stores/useThemeStore";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { AnimatePresence, MotiView } from "moti";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from 'react-native-virtualized-view';
const stats = [
  {
    id:1,
    icon: <Feather name="book" size={30} color="#f59e42" />,
    label: "totalCourses",
    value: 10,
    color: "bg-orange-900/60",
  },
  {
    id:2,
    icon: <MaterialCommunityIcons name="calendar-check-outline" size={32} color="#db2777" />,
    label: "yearsExperience",
    value: 5,
    color: "bg-pink-900/60",
  },
  {
    id:3,
    icon: <MaterialCommunityIcons name="calendar-check-outline" size={32} color="#db2777" />,
    label: "totalSessions",
    value: 5,
    color: "bg-pink-900/60",
  },
  {
    id:4,
    icon: <Ionicons name="time-outline" size={32} color="#db2777" />,
    label: "totalStudents",
    value: 5,
    color: "bg-pink-900/60",
  },
];

const reportData = [
  {
    title: "Attendance Rate",
    value: "95%",
    icon: <Ionicons name="checkmark-done-circle-outline" size={28} color="#22d3ee" />,
    color: "bg-cyan-900/60",
    description: "Average attendance rate across all classes.",
  },
  {
    title: "Average Grade",
    value: "B+",
    icon: <Ionicons name="school-outline" size={28} color="#f59e42" />,
    color: "bg-yellow-900/60",
    description: "Average grade given in your courses.",
  },
  {
    title: "Feedback Score",
    value: "4.7/5",
    icon: <Ionicons name="star-outline" size={28} color="#fbbf24" />,
    color: "bg-yellow-800/60",
    description: "Average feedback from students.",
  },
  {
    title: "Average Duration",
    value: "120 h",
    icon: <Ionicons name="time-outline" size={28} color="#db2777" />,
    color: "bg-secondary",
    description: "Average duration of classes.",
  },
];

const chartData = [
  { label: "Jan", value: 8 },
  { label: "Feb", value: 7 },
  { label: "Mar", value: 9 },
  { label: "Apr", value: 6 },
  { label: "May", value: 10 },
  { label: "Jun", value: 8 },
];

const screenWidth = Dimensions.get("window").width;

const AnimatedStatCard = ({ icon, label, value, delay, t, isFocused, id }: any) => (
  <MotiView
    key={id}
    from={{ opacity: 0, scale: isFocused ? 1 : 0.9 }}
    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
    transition={{ type: "timing", duration: 500, delay }}
    className={`flex-1 mx-1 rounded-xl p-4 mb-4 items-center bg-zinc-800`}
    style={{ minWidth: 100 }}
  >
    <View className="mb-2">{icon}</View>
    <Text className="text-white text-2xl font-bold">{value}</Text>
    <Text className="text-zinc-300 text-xs mt-1 text-center">{t(label)}</Text>
  </MotiView>
);

const AnimatedReportCard = ({ icon, title, value, color, description, delay, isFocused }: any) => (
  <MotiView
    from={{ opacity: 0, scale: isFocused ? 1 : 0.95, translateY: isFocused ? 0 : 30 }}
    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.95, translateY: isFocused ? 0 : 30 }}
    transition={{ type: "timing", duration: 500, delay }}
    className={`flex-row items-center rounded-2xl p-4 mb-3 bg-zinc-800`}
  >
    <View className="mr-4 bg-zinc-900 p-4 rounded-md">{icon}</View>
    <View className="flex-1">
      <Text className="text-zinc-200 text-base font-semibold">{title}</Text>
      <Typography variant="h3">{value}</Typography>
      <Text className="text-zinc-400 text-xs mt-1">{description}</Text>
    </View>
  </MotiView>
);

const BarChart = ({ data, isFocused }: any) => {
  const maxValue = Math.max(...data.map((d: any) => d.value));
  const theme = useThemeStore((state) => state.theme);
  return (
    <View className="flex-row items-end justify-between mt-2 mb-1 " style={{ height: 120 }}>
      {data.map((d: any, idx: any) => (
        <MotiView
          key={d.label}
          from={{ scaleY: isFocused ? 1 : 0.9 }}
          animate={{ scaleY: isFocused ? 1 : 0.9 }}
          transition={{ type: "timing", duration: 500, delay: 200 + idx * 80 }}
          className="flex-1 items-center "
        >
          <View
            className={[
              "w-7 rounded-t-xl",
              theme === "1" ? "bg-theme1-primary" : "bg-theme2-primary",
            ].join(" ")}
            style={{
              height: (d.value / maxValue) * 100 + 20,
              marginHorizontal: 2,
            }}
          />
          <Text className="text-xs text-zinc-400 mt-1">{d.label}</Text>
        </MotiView>
      ))}
    </View>
  );
};

const Report = () => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const isFocused = useIsFocused();

  return (
    <SafeAreaView className="flex-1 bg-zinc-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20, paddingHorizontal: 18 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          className="mb-4"
        >
          <Text className="text-2xl font-bold text-white mb-1">{t("lecturerReport")}</Text>
          <Text className="text-zinc-400 text-base">{t("desc.lecturerReport")}</Text>
        </MotiView>

        {/* Stats Row */}
        <FlatList
          data={stats}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 8 }}
          renderItem={({item}) => <AnimatedStatCard key={item.id} {...item} delay={100 + item.id * 120} t={t} isFocused={isFocused} />}
        />

        {/* Chart Section */}
        <MotiView
          from={{ opacity: 0, scale: isFocused ? 1 : 0.9 }}
          animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
          transition={{ type: "timing", duration: 300, delay: 200 }}
          className="rounded-2xl bg-zinc-800 p-4 mb-4"
        >
          <Text className="text-zinc-200 text-base font-semibold mb-2">{t("Monthly Classes Taught")}</Text>
          <BarChart data={chartData} isFocused={isFocused}/>
        </MotiView>

        {/* Report Cards */}
        {reportData.map((item, idx) => (
          <AnimatedReportCard
            key={item.title}
            {...item}
            delay={250 + idx * 120}
            isFocused={isFocused}
          />
        ))}

        {/* Details Toggle */}
        <TouchableOpacity
          className="flex-row items-center justify-center mt-4"
          activeOpacity={0.8}
          onPress={() => setShowDetails((v) => !v)}
        >
          <Text className="text-blue-400 text-base font-semibold mr-2">
            {showDetails ? t("Hide Details") : t("Show More Details")}
          </Text>
          <Ionicons
            name={showDetails ? "chevron-up" : "chevron-down"}
            size={20}
            color="#38bdf8"
          />
        </TouchableOpacity>

        <AnimatePresence>
          {showDetails && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 120 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "timing", duration: 300 }}
              className="overflow-hidden mt-2"
            >
              <View className="bg-zinc-800 rounded-2xl p-4">
                <Text className="text-zinc-200 text-base font-semibold mb-1">{t("Recent Activity")}</Text>
                <Text className="text-zinc-400 text-xs">
                  {t("You have completed 3 classes this month. 2 new feedbacks received. All attendance records are up to date.")}
                </Text>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Report;
