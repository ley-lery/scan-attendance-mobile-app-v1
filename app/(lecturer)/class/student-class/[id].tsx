import { IMG } from '@/constants/Image';
import { useThemeStore } from '@/stores/useThemeStore';
import { Entypo, Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const classList = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    code: "CS101",
    time: "Mon 09:00 - 11:00",
    location: "Room 201",
    students: 32,
    icon: <Feather name="book-open" size={28} color="#38bdf8" />,
    color: "bg-blue-900/60",
    description: "An introduction to the fundamental concepts of computer science, including algorithms, programming, and problem-solving.",
    studentsList: [
      { id: "s1", name: "Alice Johnson", code: "CS101", status: "Active" },
      { id: "s2", name: "Bob Smith", code: "CS202", status: "Inactive" },
      { id: "s3", name: "Charlie Brown", code: "CS303", status: "Active" },
      { id: "s4", name: "Diana Prince", code: "CS404", status: "Active" },
      { id: "s5", name: "Ethan Hunt", code: "CS505", status: "Active" },
    ],
  },
  {
    id: "2",
    name: "Data Structures",
    code: "CS202",
    time: "Wed 13:00 - 15:00",
    location: "Room 305",
    students: 28,
    icon: <MaterialCommunityIcons name="database-outline" size={28} color="#f59e42" />,
    color: "bg-yellow-900/60",
    description: "Covers the design, implementation, and analysis of data structures such as lists, stacks, queues, trees, and graphs.",
    studentsList: [
      { id: "s1", name: "Alice Johnson", code: "CS101", status: "Active" },
      { id: "s2", name: "Bob Smith", code: "CS202", status: "Inactive" },
      { id: "s3", name: "Charlie Brown", code: "CS303", status: "Active" },
      { id: "s4", name: "Diana Prince", code: "CS404", status: "Active" },
      { id: "s5", name: "Ethan Hunt", code: "CS505", status: "Active" },
    ],
  },
  {
    id: "3",
    name: "Software Engineering",
    code: "CS303",
    time: "Fri 10:00 - 12:00",
    location: "Room 110",
    students: 25,
    icon: <Ionicons name="construct-outline" size={28} color="#22d3ee" />,
    color: "bg-cyan-900/60",
    description: "Focuses on the principles and practices of software engineering, including design, development, and testing.",
    studentsList: [
      { id: "s1", name: "Alice Johnson", code: "CS101", status: "Active" },
      { id: "s2", name: "Bob Smith", code: "CS202", status: "Inactive" },
      { id: "s3", name: "Charlie Brown", code: "CS303", status: "Active" },
      { id: "s4", name: "Diana Prince", code: "CS404", status: "Active" },
      { id: "s5", name: "Ethan Hunt", code: "CS505", status: "Active" },
    ],
  },
];


const StudentClass = () => {
    const { t } = useTranslation();
    const theme = useThemeStore((state) => state.theme);
    const isFocused = useIsFocused();
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const classData = classList.find((c) => c.id === id);

    if (!classData) {
        return (
        <View className="flex-1 items-center justify-center bg-zinc-950">
            <Text className="text-zinc-300 text-lg font-semibold">Class not found</Text>
        </View>
        );
    }

  return (
    <View className="flex-1 bg-black">
        <MotiView
            from={{ opacity: 0, translateY: -50 }}
            animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : -50 }}
            transition={{ type: 'timing', duration: 400 }}
            className="w-full h-full absolute top-0 left-0 z-0"
        >
            <Image source={theme === "1" ? IMG.BGP : IMG.BGBP}  />
        </MotiView>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, scale: isFocused ? 1 : 0.9 }}
        animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
        transition={{ type: 'timing', duration: 300, delay: 0 }}
        className="flex-row items-center p-4 mx-4 mt-8 bg-zinc-900 rounded-xl gap-4"
      >
        <TouchableOpacity onPress={() => router.back()} className='bg-zinc-800 rounded-full p-2'>
          <Ionicons name="arrow-back" size={22} color="#e5e7eb" />
        </TouchableOpacity>
       <View>
            <Text className="text-zinc-100 text-base font-semibold">{classData.name}</Text>
            <Text className="text-zinc-300 text-sm font-normal">{t('student')}</Text>
       </View>
      </MotiView>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Class Info Card */}
        <MotiView
          from={{ opacity: 0, scale: isFocused ? 1 : 0.9 }}
          animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
          transition={{ type: 'timing', duration: 300, delay: 100 }}
          className="mx-4 mt-4 p-4 rounded-2xl bg-zinc-900/80 shadow-lg"
        >
          <Text className="text-lg font-semibold text-zinc-100 mb-1">{classData.name}</Text>
          <View className='my-2'>
            <View className="flex-row items-center gap-3 mb-2">
                <Ionicons name="calendar-outline" size={18} color="#fbbf24" />
                <Text className="text-zinc-300">{classData.time}</Text>
            </View>
            <View className="flex-row items-center gap-3 mb-2">
                <Ionicons name="location-outline" size={18} color="#38bdf8" />
                <Text className="text-zinc-300">{classData.location}</Text>
            </View>
            <View className="flex-row items-center gap-3 mb-2">
                <Ionicons name="people-outline" size={18} color="#22d3ee" />
                <Text className="text-zinc-300">{classData.students} students</Text>
            </View>
          </View>
          <Text className="text-zinc-400 mt-2">{classData.description}</Text>
        </MotiView>

        {/* Students List */}
        <MotiView
          from={{ opacity: 0, scale: isFocused ? 1 : 0.9 }}
          animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
          transition={{ type: 'timing', duration: 300, delay: 250 }}
          className="mx-4 mt-6 p-4 rounded-2xl bg-zinc-900/80"
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="ml-2 text-lg font-semibold text-zinc-100">{t('student')}</Text>
            <Text className="text-base font-normal text-zinc-400">{classData.studentsList.length} {t('numOfpeople')}</Text>
          </View>
          {classData.studentsList.length === 0 ? (
            <Text className="text-zinc-400 text-base">No students enrolled.</Text>
          ) : (
            classData.studentsList.map((student, idx) => (
              <MotiView
                key={student.id}
                from={{ opacity: 0, scale: isFocused ? 1 : 0.9 }}
                animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                transition={{ type: 'timing', duration: 300, delay: 100 + idx * 60 }}
                className="flex-row items-center justify-between py-2"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-full bg-zinc-800 items-center justify-center">
                    <Ionicons name="person-circle-outline" size={30} color="#a1a1aa" />
                  </View>
                  <View>
                    <Text className="text-zinc-200 text-base font-medium">{student.name}</Text>
                    <Text className="text-zinc-400 text-sm">{student.code}</Text>
                  </View>
                </View>
                <View className={` flex-row items-center gap-1 `}>
                    <Entypo name="dot-single" size={24} color={student.status == "Active" ? "#17c964" : "#db2777"} />
                    <Text className={`text-sm font-medium text-${student.status == "Active" ? "success" : "danger"}`}>{student.status}</Text>
                </View>
              </MotiView>
            ))
          )}
        </MotiView>
      </ScrollView>
    </View>
  );
};

export default StudentClass;
