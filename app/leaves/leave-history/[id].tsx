import { Card, Icon } from '@/godui'
import { useIsFocused } from '@react-navigation/native'
import { useLocalSearchParams } from 'expo-router'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
interface LeaveItem {
  id: number;
  type: string;
  date: string;
  status: 'Approved' | 'Rejected' | 'Pending' | string;
  reason: string;
}

interface ClassItem {
  id: number;
  name: string;
  teacher: string;
  period: string;
  year: string;
  semester: string;
  course: string;
  history: LeaveItem[];
}
const mockLeaveHistory: ClassItem[] = [
  {
    id: 1,
    name: 'Mathematics 101',
    teacher: 'Mr. Smith',
    period: '2023-2024',
    year: 'Year 1',
    semester: 'Semester 1',
    course: 'Mathematics',
    history: [
      {
        id: 1,
        type: 'Sick Leave',
        date: '2024-06-10',
        status: 'Approved',
        reason: 'Fever and headache',
      },
      {
        id: 2,
        type: 'Personal Leave',
        date: '2024-05-28',
        status: 'Approved',
        reason: 'Family function',
      },
      {
        id: 3,
        type: 'Sick Leave',
        date: '2024-04-15',
        status: 'Rejected',
        reason: 'Not specified',
      },
      {
        id: 4,
        type: 'Casual Leave',
        date: '2024-03-20',
        status: 'Pending',
        reason: 'Personal work',
      },
    ]
  },
  {
    id: 2,
    name: 'English Literature',
    teacher: 'Ms. Johnson',
    period: '2023-2024',
    year: 'Year 2',
    semester: 'Semester 2',
    course: 'English',
    history: [
      {
        id: 1,
        type: 'Sick Leave',
        date: '2024-06-10',
        status: 'Approved',
        reason: 'Fever and headache',
      },
      {
        id: 2,
        type: 'Personal Leave',
        date: '2024-05-28',
        status: 'Approved',
        reason: 'Family function',
      },
      {
        id: 3,
        type: 'Sick Leave',
        date: '2024-04-15',
        status: 'Rejected',
        reason: 'Not specified',
      },
      {
        id: 4,
        type: 'Casual Leave',
        date: '2024-03-20',
        status: 'Pending',
        reason: 'Personal work',
      },
    ]
  },
  {
    id: 3,
    name: 'Physics Advanced',
    teacher: 'Dr. Brown',
    period: '2023-2024',
    year: 'Year 3',
    semester: 'Semester 1',
    course: 'Physics',
    history: [
      {
        id: 1,
        type: 'Sick Leave',
        date: '2024-06-10',
        status: 'Approved',
        reason: 'Fever and headache',
      },
      {
        id: 2,
        type: 'Personal Leave',
        date: '2024-05-28',
        status: 'Approved',
        reason: 'Family function',
      },
      {
        id: 3,
        type: 'Sick Leave',
        date: '2024-04-15',
        status: 'Rejected',
        reason: 'Not specified',
      },
      {
        id: 4,
        type: 'Casual Leave',
        date: '2024-03-20',
        status: 'Pending',
        reason: 'Personal work',
      },
    ]
  },
  {
    id: 4,
    name: 'Chemistry Basics',
    teacher: 'Mrs. Lee',
    period: '2023-2024',
    year: 'Year 4',
    semester: 'Semester 1',
    course: 'Chemistry',
    history: [
      {
        id: 1,
        type: 'Sick Leave',
        date: '2024-06-10',
        status: 'Approved',
        reason: 'Fever and headache',
      },
      {
        id: 2,
        type: 'Personal Leave',
        date: '2024-05-28',
        status: 'Approved',
        reason: 'Family function',
      },
      {
        id: 3,
        type: 'Sick Leave',
        date: '2024-04-15',
        status: 'Rejected',
        reason: 'Not specified',
      },
      {
        id: 4,
        type: 'Casual Leave',
        date: '2024-03-20',
        status: 'Pending',
        reason: 'Personal work',
      },
    ]
  },
  {
    id: 5,
    name: 'Physics Advanced',
    teacher: 'Dr. Brown',
    period: '2023-2024',
    year: 'Year 4',
    semester: 'Semester 2',
    course: 'Physics',
    history: [
      {
        id: 1,
        type: 'Sick Leave',
        date: '2024-06-10',
        status: 'Approved',
        reason: 'Fever and headache',
      },
      {
        id: 2,
        type: 'Personal Leave',
        date: '2024-05-28',
        status: 'Approved',
        reason: 'Family function',
      },
      {
        id: 3,
        type: 'Sick Leave',
        date: '2024-04-15',
        status: 'Rejected',
        reason: 'Not specified',
      },
      {
        id: 4,
        type: 'Casual Leave',
        date: '2024-03-20',
        status: 'Pending',
        reason: 'Personal work',
      },
    ]
  },
]

// ---------------- Helpers ----------------
const leaveTypeIcon = (type: string) => {
  switch (type) {
    case 'Sick Leave':
      return 'medkit-outline';
    case 'Personal Leave':
      return 'person-outline';
    case 'Casual Leave':
      return 'briefcase-outline';
    case 'Vacation Leave':
      return 'airplane-outline';
    default:
      return 'document-text-outline';
  }
};


// ---------------- LeaveCard ----------------
const LeaveCard = ({ leave, isFocused , index }: { leave: LeaveItem, isFocused: boolean, index: number }) => (
  <Card
    isShadow
    animation={{
      delay: index * 120,
      isFocused: isFocused
    }}
    transparent
    classNames={{ wrapper: 'bg-zinc-800'}}
    radius='xl'
  >
    <View className='flex-row items-center gap-4'>
      <View className='bg-black p-4 rounded-md' style={{shadowColor: '#000', shadowOffset: {width: 2, height: 2}, shadowOpacity: 0.8, shadowRadius: 4}}>
        <Icon
          name={leaveTypeIcon(leave.type)}
          size={28}
        />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-white font-bold text-base">{leave.type}</Text>
        <View className="flex-row items-center gap-1">
          <Icon name="calendar-outline" size={16} color="#a1a1aa" />
          <Text className="text-zinc-400 text-xs">{leave.date}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon name="document-text-outline" size={16} color="#a1a1aa" />
          <Text className="font-normal text-zinc-400 text-sm">{leave.reason}</Text>
        </View>
      </View>
      <View className="items-end">
        <View
          className={`flex-row items-center px-3 py-1 rounded-full`}
        >
          <Text className={`font-semibold text-xs ${leave.status === 'Approved' ? 'text-success' : leave.status === 'Rejected' ? 'text-danger' : 'text-warning'}`}>{leave.status}</Text>
        </View>
      </View>
    </View>
  </Card>
);

const LeaveHistory = () => {
  const [totalLeave, setTotalLeave] = useState(0);
  const isFocused = useIsFocused();
  const { id } = useLocalSearchParams();
  const leaveHistory = mockLeaveHistory.find((c) => c.id === Number(id));

  useEffect(() => {
    if (leaveHistory) {
      setTotalLeave(leaveHistory.history.length);
    }
  }, [leaveHistory]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-900">
      <View className="p-4 flex-1 gap-4">
        {/* Header */}
        <Card
          isShadow
          transparent
          animation={{
            isFocused: isFocused
          }}
          radius='xl'
        >
          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'web') window.history.back();
                else if (typeof require !== 'undefined') {
                  const { router } = require('expo-router');
                  router.back();
                }
              }}
              className="bg-zinc-800 p-3 rounded-md mr-3"
              style={{
                shadowColor: '#27272a',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
              }}
            >
              <Icon name="chevron-back" size={20} />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-zinc-200">
              Leave History - {leaveHistory?.name}
            </Text>
          </View>
          <Text className="text-zinc-400 text-base">
            View leave history, see request details, and request new leaves as
            needed.
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Text className="text-zinc-400 text-sm">Total Leave: </Text>
            <Text className="text-zinc-200 text-sm">{totalLeave} Leaves</Text>
          </View>
        </Card>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Leave List */}
          <View className="flex-1">
            {leaveHistory?.history.length === 0 ? (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 400, delay: 200 }}
                className="bg-zinc-800 rounded-2xl p-6 items-center justify-center mt-8"
              >
                <Text className="text-zinc-300 text-base">
                  No leave history found.
                </Text>
              </MotiView>
            ) : (
              <View className="flex-1 gap-2">
                {leaveHistory?.history.map((leave, idx) => (
                  <LeaveCard leave={leave} index={idx} key={leave.id} isFocused={isFocused} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LeaveHistory;
