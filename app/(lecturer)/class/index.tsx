import { IMG } from "@/constants/Image";
import { BlurCard, Input, Typography } from "@/godui";
import { useThemeStore } from "@/stores/useThemeStore";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { AnimatePresence, MotiView } from "moti";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  },
];

// Filter options for demonstration
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Mon", value: "Mon" },
  { label: "Wed", value: "Wed" },
  { label: "Fri", value: "Fri" },
  { label: "Tue", value: "Tue" },
  { label: "Thu", value: "Thu" },
  { label: "Sat", value: "Sat" },
  { label: "Sun", value: "Sun" },
];



const Class = () => {
  const theme = useThemeStore((state) => state.theme);
  const isFocused = useIsFocused();
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState('all')

  // Filter and search logic
  const filteredClasses = useMemo(() => {
    let filtered = classList;
    if (activeFilter !== "all") {
      filtered = filtered.filter((cls) => cls.time.startsWith(activeFilter));
    }
    if (search.trim() !== "") {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          cls.name.toLowerCase().includes(s) ||
          cls.code.toLowerCase().includes(s) ||
          cls.location.toLowerCase().includes(s)
      );
    }
    return filtered;
  }, [search, activeFilter]);

  const AnimatedClassCard = ({ name, code, time, location, students, delay, id }: any) => (
    <MotiView
      from={{ opacity: 0, translateY: isFocused ? 0 : 30, scale: isFocused ? 1 : 0.97 }}
      animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 0, scale: isFocused ? 1 : 1 }}
      transition={{ type: "timing", duration: 300, delay }}
      className="mb-4"
    >
      {/* Main Info */}
     <BlurCard tint="light" radius="xl" classNames={{ content: "flex-row items-center rounded-3xl" }}>
      <View className="flex-1">
          <Text className="text-white text-base font-medium" numberOfLines={1}>
            {name}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-zinc-400 text-sm">{code}</Text>
            <View className="w-1 h-1 rounded-full bg-blue-400 mx-1" />
            <Text className="text-zinc-400 text-sm">{time}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color="#a1a1aa" style={{ marginRight: 3 }} />
            <Text className="text-zinc-400 text-sm">{location}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="people-outline" size={14} color="#a1a1aa" style={{ marginRight: 3 }} />
            <Text className="text-zinc-400 text-xs font-medium">{students} students</Text>
          </View>
        </View>
        {/* Chevron in a subtle circle */}
        <TouchableOpacity onPress={() => router.push(`../(lecturer)/class/student-class/${id}`)}>
          <View className="ml-2 p-2 rounded-full bg-blue-500/10">
            <Ionicons name="chevron-forward" size={20} color="#38bdf8" />
          </View>
        </TouchableOpacity>
      </BlurCard>
    </MotiView>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 50 }}
        transition={{ type: 'timing', duration: 300, delay: 400 }}
        className="w-full h-full absolute top-0 left-0"
      >
          <Image source={theme === "1" ? IMG.BGH : IMG.BGBH} resizeMode="cover" />
      </MotiView>
      <BlurCard intensity={70} classNames={{ wrapper: "absolute top-0 left-0 w-full z-10", content: "pt-4 px-2" }}>
         {/* Header */}
         <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          className="mb-4"
        >
          <Typography variant="h2">My Classes</Typography>
          <Text className="text-zinc-400 text-base">
            Overview of your current teaching schedule
          </Text>
        </MotiView>

        {/* Search Bar */}
        <View className="mb-4">
          <Input
            placeholder="Search by class name, code, or location"
            value={search}
            onChangeText={setSearch}
            startContent={<Ionicons name="search" size={20} color="#a1a1aa" />}
            variant="solid"
          />
        </View>
        {/* Filter Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row mb-4 gap-2">
            {filterOptions.map((filter) => {
              const isActive = activeFilter === filter.value
              return (
                <MotiView
                  key={filter.value}
                  from={{  opacity: 0, scale: isFocused ? 0.9 : 1 }}
                  animate={{opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                  transition={{ type: 'timing', duration: 350 }}
                >
                  <TouchableOpacity onPress={() => setActiveFilter(filter.value)} activeOpacity={0.7}>
                    {isActive ? (
                      <LinearGradient
                        colors={['#000', theme === "1" ? '#F31260' : '#006FEE']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1.4, y: 1 }}
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderRadius: 99,
                        }}
                      >
                        <Text className='text-white font-medium text-base'>{filter.label}</Text>
                      </LinearGradient>
                    ) : (
                      <View
                        style={{
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderRadius: 99,
                          backgroundColor: '#27272a',
                          opacity: 0.7,
                        }}
                      >
                        <Text className='text-white font-medium text-base'>{filter.label}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </MotiView>
              )
            })}
          </View>  
        </ScrollView>      
      </BlurCard>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 200, paddingHorizontal: 18 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
       

        {/* Class List */}
        {filteredClasses.length === 0 ? (
          <View className="items-center mt-10">
            <Ionicons name="alert-circle-outline" size={40} color="#64748b" />
            <Text className="text-zinc-400 text-base mt-2">No classes found.</Text>
          </View>
        ) : (
          filteredClasses.map((cls, idx) => (
            <AnimatedClassCard
              key={cls.id}
              {...cls}
              delay={100 + idx * 120}
            />
          ))
        )}

        {/* Show More Details */}
        <TouchableOpacity
          className="flex-row items-center justify-center mt-2"
          activeOpacity={0.8}
          onPress={() => setShowDetails((v) => !v)}
        >
          <Text className="text-blue-400 text-base font-semibold mr-2">
            {showDetails ? "Hide Details" : "Show More Details"}
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
                <Text className="text-zinc-200 text-base font-semibold mb-1">Upcoming Tasks</Text>
                <Text className="text-zinc-400 text-xs">
                  You have 2 assignments to review and 1 class to prepare this week.
                </Text>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Class;
