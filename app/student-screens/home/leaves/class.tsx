import { BottomSheetModalUi, Card, Checkbox, Icon, Text } from '@/godui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

interface ClassItem {
  id: number;
  name: string;
  teacher: string;
  period: string;
  year: string;
  semester: string;
  course: string;
}

const mockClasses: ClassItem[] = [
  {
    id: 1,
    name: 'Mathematics 101',
    teacher: 'Mr. Smith',
    period: '2023-2024',
    year: 'Year 1',
    semester: 'Semester 1',
    course: 'Mathematics',
  },
  {
    id: 2,
    name: 'English Literature',
    teacher: 'Ms. Johnson',
    period: '2023-2024',
    year: 'Year 2',
    semester: 'Semester 2',
    course: 'English',
  },
  {
    id: 3,
    name: 'Physics Advanced',
    teacher: 'Dr. Brown',
    period: '2023-2024',
    year: 'Year 3',
    semester: 'Semester 1',
    course: 'Physics',
  },
  {
    id: 4,
    name: 'Chemistry Basics',
    teacher: 'Mrs. Lee',
    period: '2022-2023',
    year: 'Year 4',
    semester: 'Semester 1',
    course: 'Chemistry',
  },
  {
    id: 5,
    name: 'Physics Advanced',
    teacher: 'Dr. Brown',
    period: '2023-2024',
    year: 'Year 4',
    semester: 'Semester 2',
    course: 'Physics',
  },
];

// -------------------- Class Card --------------------
interface ClassCardProps {
  cls: ClassItem;
  idx: number;
  isFocused: boolean;
  onPress: () => void;
}

const ClassCard = ({ cls, idx, isFocused, onPress }: ClassCardProps) => (
  <Card
    radius="xl"
    transparent
    isShadow
    classNames={{ wrapper: 'bg-white dark:bg-zinc-800' }}
    animation={{ delay: idx * 120, isFocused }}
  >
    <TouchableOpacity activeOpacity={0.92} onPress={onPress}>
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-zinc-900 dark:text-white font-bold text-lg mb-0.5">{cls.name}</Text>
          <Text className="text-zinc-900 dark:text-white/80 text-sm mb-0.5">
            Teacher: <Text className="font-medium">{cls.teacher}</Text>
          </Text>
          <View className="flex-row flex-wrap gap-2 mt-1">
            {[cls.period, cls.semester, cls.course].map((item) => (
              <Text
                key={item}
                className="text-zinc-900 dark:text-white/70 text-sm px-2 py-0.5 bg-zinc-100 dark:bg-black/20 rounded-full"
              >
                {item}
              </Text>
            ))}
          </View>
        </View>
        <View className="ml-3">
          <View className="dark:bg-black bg-zinc-100 px-4 py-2 rounded-full flex-row items-center dark:shadow-lg shadow-black">
            <Text className="text-zinc-900 dark:text-white font-semibold text-xs mr-1">View</Text>
            <Icon name="chevron-forward" size={16} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </Card>
);

const years = [
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
]

// -------------------- Main Component --------------------
const Class = () => {
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  const [showYear, setShowYear] = useState(new Set(['Year 1', 'Year 2', 'Year 3', 'Year 4']));

  const handleBack = () => {
    if (Platform.OS === 'web') window.history.back();
    else if (typeof require !== 'undefined') {
      const { router } = require('expo-router');
      router.back();
    }
  };

  return (
    <>
      <SafeAreaView className="bg-zinc-100 dark:bg-zinc-900 flex-1">
        <View className="p-4 flex-1 gap-4">
          {/* Header Card */}
          <Card
            radius="xl"
            transparent
            isShadow
            animation={{ isFocused }}
            classNames={{ wrapper: 'p-0' }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="dakr:bg-zinc-800 bg-zinc-200 dark:shadow-lg shadow-black p-3 rounded-md mr-3"
                  >
                    <Icon name="chevron-back" size={20} />
                  </TouchableOpacity>
                  <Text className="text-lg font-bold text-zinc-700 dark:text-zinc-200">
                    Your Classes
                  </Text>
                </View>
                <Text className="text-zinc-500 dark:text-zinc-400 text-base">
                  Select a class to view leave history and manage attendance.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.present()}
              >
                <Icon name="options" size={24} />
              </TouchableOpacity>
            </View>
          </Card>

          {/* Class List */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 32 }}
          >
            {mockClasses.length > 0 ? (
              mockClasses
                .filter((cls) => showYear.has(cls.year))
                .filter((cls) => cls.year).length > 0 ? (
                mockClasses
                  .filter((cls) => showYear.has(cls.year))
                  .filter((cls) => cls.year).map((cls, idx) => (
                    <ClassCard
                      key={cls.id}
                      cls={cls}
                      idx={idx}
                      isFocused={isFocused}
                      onPress={() =>
                        router.push(`../leaves/leave-history/${cls.id}`)
                      }
                    />
                  ))
              ) : (
                <View className="flex-1 min-h-96 items-center justify-center">
                  <Text className="text-zinc-400 text-lg">No data available</Text>
                </View>
              )
            ) : (
              <Text className="text-center text-zinc-400 text-xl">
                No data available
              </Text>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* BottomSheet Modal */}
      <BottomSheetModalUi bottomSheetRef={bottomSheetRef} snapPoints={['20%']}>
        <View className="px-4 h-full">
          <Text className="text-lg font-bold text-zinc-200">Show / Hide</Text>
          <View className="flex-row items-center gap-4 mt-2 p-4 justify-center h-full">
            {years.map((key) => (
              <Checkbox
                key={key}
                label={key}
                value={showYear.has(key)}
                onChange={(val) => setShowYear(val ? new Set([...showYear, key]) : new Set([...showYear].filter((item) => item !== key)))}
                radius="lg"
              />
            ))}
          </View>
        </View>
      </BottomSheetModalUi>
    </>
  );
};

export default Class;
