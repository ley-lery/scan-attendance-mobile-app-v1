import { Icon, Text } from "@/godui";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { MotiView, SafeAreaView } from "moti";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text as TextNative, TouchableOpacity, View } from "react-native";

// Example attendance data for the student for today's sessions
const sessions = [
  {
    id: 1,
    title: "Session 1",
    subject: "Web Development",
    teacher: "Mr. John Doe",
    time: "07:30 AM - 08:50 AM",
    location: "Room 201",
    color: "bg-blue-700/80",
    status: "completed",
    statusColor: "#17c964",
  },
  {
    id: 2,
    title: "Session 2",
    subject: "Web Development",
    teacher: "Ms. Jane Smith",
    time: "09:05 AM - 10:35 AM",
    location: "Room 305",
    color: "bg-cyan-700/80",
    status: "upcoming",
    statusColor: "#f5a524",
  },
];
const yourAttendance = [
  {
    id: 1,
    title: "Session 1",
    subject: "Web Development",
    teacher: "Mr. John Doe",
    time: "07:30 AM - 08:50 AM",
    location: "Room 201",
    color: "bg-blue-700/80",
    status: "completed",
    statusColor: "#17c964",
    attendance: "present", 
  },
  {
    id: 2,
    title: "Session 2",
    subject: "Web Development",
    teacher: "Ms. Jane Smith",
    time: "09:05 AM - 10:35 AM",
    location: "Room 305",
    color: "bg-cyan-700/80",
    status: "upcoming",
    statusColor: "#f5a524",
    attendance: "late",
  },
];

const attendanceStatus = {
  Present: {
    label: "present",
    color: "#17c964",
    icon: <Entypo name="dot-single" size={22} color="#17c964" />,
  },
  Absent: {
    label: "absent",
    color: "#ef4444",
    icon: <Entypo name="dot-single" size={22} color="#ef4444" />,
  },
  Late: {
    label: "late",
    color: "#f59e42",
    icon: <Entypo name="dot-single" size={22} color="#f59e42" />,
  },
};

const TodayClass = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        className="flex-row items-center  p-4 mx-4 mt-8 bg-white dark:bg-black rounded-xl shadow-md dark:shadow-black/50 shadow-zinc-200"
      >
        <View className="flex-row items-center justify-between gap-2">
          <TouchableOpacity onPress={() => router.back()} className="bg-zinc-100 dark:bg-black p-4 rounded-md dark:shadow-md dark:shadow-black/50 " >
            <Icon name="chevron-back" size={20} />
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-bold text-zinc-700 dark:text-zinc-300">{t('todayClass')}</Text>
            <Text className="text-zinc-400 text-sm">Monday, 24 June 2024</Text>
          </View>
        </View>
      </MotiView>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4">

          {sessions.map((session, idx) => (
            <MotiView
              key={session.id}
              from={{ opacity: 0, scale: 0.95, translateY: 30 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 400, delay: 100 + idx * 120 }}
              className={`mt-4 rounded-2xl shadow-sm shadow-zinc-200 dark:shadow-black/50 dark:bg-zinc-800 bg-white p-5 flex-row items-center`}
            >
              <View className="flex-1">
                <TextNative className="text-zinc-700 dark:text-zinc-300 text-lg font-semibold mb-1">{session.subject}</TextNative>
                <View className="flex-row items-center mb-1">
                  <Ionicons name="person-outline" size={16} color="#a1a1aa" />
                  <TextNative className="text-zinc-400 dark:text-zinc-300 text-sm ml-1">{session.teacher}</TextNative>
                </View>
                <View className="flex-row items-center mb-1">
                  <Ionicons name="time-outline" size={16} color="#a1a1aa" />
                  <TextNative className="text-zinc-400 dark:text-zinc-300 text-sm ml-1">{session.time}</TextNative>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={16} color="#a1a1aa" />
                  <TextNative className="text-zinc-400 dark:text-zinc-300 text-sm ml-1">{session.location}</TextNative>
                </View>
              </View>
              <View className="flex-row items-center">
                <Entypo name="dot-single" size={30} color={session.statusColor} />
                <TextNative className="text-sm ml-1" style={{ color: session.statusColor }}>{t(session.status)}</TextNative>
              </View>
            </MotiView>
          ))}

          {/* If no sessions */}
          {sessions.length === 0 && (
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "timing", duration: 400, delay: 200 }}
              className="mx-5 mt-10 rounded-2xl bg-zinc-900/80 p-8 items-center"
            >
              <Ionicons name="happy-outline" size={48} color="#38bdf8" />
              <Text className="text-white text-lg font-semibold mt-4">{t('noClassesToday')}</Text>
              <Text className="text-zinc-400 text-base mt-2 text-center">
                {t('enjoyYourFreeDay')}
              </Text>
            </MotiView>
          )}

          {/* Attendance Section */}
          <View className="mt-4">
            <Text className="text-zinc-700 dark:text-zinc-300 text-lg font-semibold mb-2">{t('todayAttendance')}</Text>
            <View className="rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 p-4">
              {yourAttendance.map((session, idx) => {
                const att = attendanceStatus[session.attendance as keyof typeof attendanceStatus] || attendanceStatus.Absent;
                return (
                  <View
                    key={session.id}
                    className={`flex-row items-center justify-between py-2 ${idx !== 0 ? "border-t border-zinc-200 dark:border-zinc-800" : ""}`}
                  >
                    <View className="flex-1 gap-1">
                      <Text className="text-zinc-700 dark:text-zinc-300 text-base font-medium">{session.subject}</Text>
                      <Text className="text-zinc-400 dark:text-zinc-300 text-sm">{session.time} • {session.location}</Text>
                    </View>
                    <View className="flex-row items-center ml-4">
                      {att.icon}
                      <TextNative className="ml-1 text-base font-normal" style={{ color: att.color }}>
                        {t(att.label)}
                      </TextNative>
                    </View>
                  </View>
                );
              })}
              {/* Legend */}
              <View className="flex-row items-center justify-center mt-4 space-x-4">
                <View className="flex-row items-center mr-4">
                  <MaterialCommunityIcons name="check-circle-outline" size={18} color="#17c964" />
                  <Text className="ml-1 text-sm text-zinc-700 dark:text-zinc-300">{t('present')}</Text>
                </View>
                <View className="flex-row items-center mr-4">
                  <MaterialCommunityIcons name="clock-outline" size={18} color="#f59e42" />
                  <Text className="ml-1 text-sm text-zinc-700 dark:text-zinc-300">{t('late')}</Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="close-circle-outline" size={18} color="#ef4444" />
                  <Text className="ml-1 text-sm text-zinc-700 dark:text-zinc-300">{t('absent')}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <Stack.Screen name="today" options={{ headerShown: false }} />
    </SafeAreaView>
  );
};

export default TodayClass;