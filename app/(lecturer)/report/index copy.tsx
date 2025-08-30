import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatePresence, MotiView } from "moti";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const stats = [
  {
    icon: <Feather name="book" size={30} color="#f59e42" />,
    label: "totalCourses",
    value: 10,
    color: "bg-orange-900/60",
  },
  {
    icon: <MaterialCommunityIcons name="calendar-check-outline" size={32} color="#db2777" />,
    label: "yearsExperience",
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
    icon: <Feather name="award" size={28} color="#f59e42" />,
    color: "bg-yellow-900/60",
    description: "Average grade given in your courses.",
  },
  {
    title: "Feedback Score",
    value: "4.7/5",
    icon: <MaterialCommunityIcons name="star-circle-outline" size={28} color="#fbbf24" />,
    color: "bg-yellow-800/60",
    description: "Average feedback from students.",
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

const AnimatedStatCard = ({ icon, label, value, color, delay, t }: any) => (
  <MotiView
    from={{ opacity: 0, translateY: 30 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 500, delay }}
    className={`flex-1 mx-1 rounded-2xl p-4 items-center ${color}`}
    style={{ minWidth: 100 }}
  >
    <View className="mb-2">{icon}</View>
    <Text className="text-white text-2xl font-bold">{value}</Text>
    <Text className="text-zinc-300 text-xs mt-1 text-center">{t(label)}</Text>
  </MotiView>
);

const AnimatedReportCard = ({ icon, title, value, color, description, delay }: any) => (
  <MotiView
    from={{ opacity: 0, scale: 0.95, translateY: 30 }}
    animate={{ opacity: 1, scale: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 500, delay }}
    className={`flex-row items-center rounded-2xl p-4 mb-3 ${color}`}
  >
    <View className="mr-4">{icon}</View>
    <View className="flex-1">
      <Text className="text-zinc-200 text-base font-semibold">{title}</Text>
      <Text className="text-white text-xl font-bold">{value}</Text>
      <Text className="text-zinc-400 text-xs mt-1">{description}</Text>
    </View>
  </MotiView>
);

const BarChart = ({ data }: any) => {
  const maxValue = Math.max(...data.map((d: any) => d.value));
  return (
    <View className="flex-row items-end justify-between mt-2 mb-1" style={{ height: 120 }}>
      {data.map((d: any, idx: any) => (
        <MotiView
          key={d.label}
          from={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ type: "timing", duration: 600, delay: 200 + idx * 80 }}
          className="flex-1 items-center"
        >
          <View
            className="w-7 rounded-t-xl bg-blue-500"
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

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20, paddingHorizontal: 18 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          className="mb-4"
        >
          <Text className="text-2xl font-bold text-white mb-1">{t("Lecturer Report")}</Text>
          <Text className="text-zinc-400 text-base">{t("Overview of your teaching performance and statistics")}</Text>
        </MotiView>

        {/* Stats Row */}
        <View className="flex-row justify-between mb-4">
          {stats.map((stat, idx) => (
            <AnimatedStatCard
              key={stat.label}
              {...stat}
              delay={100 + idx * 120}
              t={t}
            />
          ))}
        </View>

        {/* Chart Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 400 }}
          className="rounded-2xl bg-zinc-900/80 p-4 mb-4"
        >
          <Text className="text-zinc-200 text-base font-semibold mb-2">{t("Monthly Classes Taught")}</Text>
          <BarChart data={chartData} />
        </MotiView>

        {/* Report Cards */}
        {reportData.map((item, idx) => (
          <AnimatedReportCard
            key={item.title}
            {...item}
            delay={500 + idx * 120}
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
              transition={{ type: "timing", duration: 400 }}
              className="overflow-hidden mt-2"
            >
              <View className="bg-zinc-900/80 rounded-2xl p-4">
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
