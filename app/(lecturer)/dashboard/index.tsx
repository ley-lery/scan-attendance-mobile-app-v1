import { Badge, BlurCard, Notification, Typography, useDisclosure } from '@/godui'
import { useThemeStore } from '@/stores/useThemeStore'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const user = {
  name: 'Dr. Sophano',
  id: 'SRA24334',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
}

const todayClasses = [
  {
    id: 1,
    courseName: 'Mobile App Development',
    className: 'CS401 - Group 1',
    startTime: '08:00',
    endTime: '10:00',
    room: 'A201',
    students: 45,
    icon: 'laptop-outline',
    color: '#38bdf8',
  },
  {
    id: 2,
    courseName: 'Database Systems',
    className: 'CS305 - Group 2',
    startTime: '10:30',
    endTime: '12:00',
    room: 'B102',
    students: 38,
    icon: 'server-outline',
    color: '#fbbf24',
  },
  {
    id: 3,
    courseName: 'Software Engineering',
    className: 'CS210 - Group 1',
    startTime: '13:00',
    endTime: '15:00',
    room: 'C303',
    students: 50,
    icon: 'construct-outline',
    color: '#22c55e',
  },
]

const overviewStats = [
  {
    icon: 'people',
    title: 'Total Students',
    value: 133,
    color: 'bg-blue-600',
  },
  {
    icon: 'book',
    title: 'Courses',
    value: 3,
    color: 'bg-pink-600',
  },
  {
    icon: 'calendar',
    title: 'Classes Today',
    value: 3,
    color: 'bg-yellow-500',
  },
]

const quickActions = [
  {
    icon: 'qr-code-outline',
    label: 'Generate QR',
    color: 'bg-primary',
  },
  {
    icon: 'person-add-outline',
    label: 'Add Student',
    color: 'bg-blue-500',
  },
  {
    icon: 'document-text-outline',
    label: 'Attendance',
    color: 'bg-green-500',
  },
  {
    icon: 'settings-outline',
    label: 'Settings',
    color: 'bg-zinc-700',
  },
]

const Dashboard = () => {
  const { t } = useTranslation()
  const theme = useThemeStore((state) => state.theme);
  const isFocused = useIsFocused();
  const [notifCount] = useState(1)
  const [showActions, setShowActions] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const notiData = [
      {
        id: 1,
        title: t('New Announcement'),
        message: t('Your class schedule has been updated.'),
        time: '2 min ago',
        icon: <Ionicons name="megaphone-outline" size={22} color="#fbbf24" style={{ marginRight: 8 }} />,
        read: false,
      },
      {
        id: 2,
        title: t('Attendance Reminder'),
        message: t('Don\'t forget to mark your attendance for today.'),
        time: '1 hr ago',
        icon: <Ionicons name="calendar-outline" size={22} color="#38bdf8" style={{ marginRight: 8 }} />,
        read: true,
      },
      {
        id: 3,
        title: t('Leave Approved'),
        message: t('Your leave request for tomorrow has been approved.'),
        time: 'Yesterday',
        icon: <Ionicons name="checkmark-circle-outline" size={22} color="#4ade80" style={{ marginRight: 8 }} />,
        read: true,
      },
    ]
    const notificationsRows = (notif: any) => (
      <View
        key={notif.id}
        className={`flex-row items-start gap-3 px-4 py-3 border-b rounded-xl border-zinc-800 ${notif.read ? 'bg-zinc-900' : 'bg-zinc-800/60'}`}
      >
        <View className="mt-1">
          {notif.icon}
         
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-zinc-200 font-semibold">{notif.title}</Text>
              {!notif.read ? <View className="w-2 h-2 rounded-full bg-primary" /> : ''}
            </View>
            <TouchableOpacity>
              <Ionicons name="close-outline" size={20} color="#71717a" />
            </TouchableOpacity>
          </View>
          <Text className="text-zinc-400 text-sm mt-0.5">{notif.message}</Text>
          <Text className="text-zinc-500 text-xs mt-1">{notif.time}</Text>
        </View>
      </View>
    )

  return (
    <View className="flex-1 bg-zinc-900">
       <Notification visible={isOpen} onClose={onClose} >
            <View className='gap-2'>
              {notiData.map((notif) => notificationsRows(notif))}
            </View>
          </Notification>
      {/* Header with BlurCard */}
      <BlurCard
        radius="lg"
        placementRadius="bottom-left"
        classNames={{
          wrapper: 'absolute top-0 left-0 right-0 z-10',
          blur: 'px-4 pb-2 pt-10',
        }}
        intensity={70}
      >
        <View className="flex-row items-center mb-6">
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <Image
              source={{ uri: user.avatar }}
              className={[
                'w-16 h-16 rounded-full border-2',
                theme === '1' ? 'border-theme1-primary' : 'border-theme2-primary',
              ].join(' ')}
            />
          </MotiView>
          <View className="ml-4 flex-1">
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 100 }}
            >
              <Text className="text-white text-xs">Good morning,</Text>
              <Text className="text-white text-lg font-bold">{user.name}</Text>
              <Text className="text-gray-400 text-xs">ID: {user.id}</Text>
            </MotiView>
          </View>
          <TouchableOpacity onPress={onOpen}>
            <MotiView
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'timing', duration: 500, delay: 200 }}
            >
              <Badge variant="solid" color="primary" content={notifCount}>
                <Ionicons name="notifications" size={24} color="#fff" />
              </Badge>
            </MotiView>
          </TouchableOpacity>
        </View>
      </BlurCard>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 110, paddingBottom: 70 }} showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Animated QR Card */}
          <MotiView
            from={{ opacity: 0, scale: isFocused ? 0.9 : 0 }}
            animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
            transition={{ type: 'timing', duration: 300, delay: 0 }}
            className="mb-4"
          >
            <LinearGradient
              colors={['#000', theme === '1' ? '#F31260' : '#006FEE']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1.4, y: 1 }}
              style={{ borderRadius: 30 }}
            >
              <View className="p-5">
                <Typography variant="subtitle">Enjoy</Typography>
                <Text className="text-white text-3xl font-bold mb-1">Generate QR for Class With</Text>
                <Typography variant="h1">UNISCAN</Typography>
                <Text className="text-zinc-300 text-sm">
                  Scan the QR code provided by your instructor to instantly record your attendance.
                </Text>
                <AnimatePresence>
                  {showActions && (
                    <MotiView
                      from={{ opacity: 0, translateY: 20 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      exit={{ opacity: 0, translateY: 20 }}
                      transition={{ type: 'timing', duration: 350 }}
                      className="flex-row gap-3 mt-4"
                    >
                      {quickActions.map((action, idx) => (
                        <TouchableOpacity
                          key={action.label}
                          className={`items-center justify-center ${action.color} rounded-xl w-16 h-16`}
                          activeOpacity={0.85}
                        >
                          <Ionicons name={action.icon as any} size={28} color="#fff" />
                          <Text className="text-xs text-white mt-1">{action.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </MotiView>
                  )}
                </AnimatePresence>
              </View>
            </LinearGradient>
          </MotiView>

          {/* Today's Classes */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 200, delay: 200 }}
            className="mt-2 mb-4"
          >
            <Text className='text-zinc-400 font-semibold text-base mb-1'>Today's Classes</Text>
            {todayClasses.length > 0 ? (
              todayClasses.map((classItem, idx) => (
                <MotiView
                  key={classItem.id}
                  from={{ opacity: 0, scale: isFocused ? 0.9 : 1 }}
                  animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                  transition={{ type: 'timing', duration: 300, delay: 100 + idx * 120 }}
                  className="bg-black rounded-2xl p-4 mt-3 flex-row"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold mb-1">{classItem.courseName}</Text>
                    <Text className="text-zinc-400 text-sm mb-1">{classItem.className}</Text>
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="time-outline" size={14} color="#a1a1aa" />
                      <Text className="text-zinc-400 text-sm ml-1">
                        {classItem.startTime} - {classItem.endTime}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="location-outline" size={14} color="#a1a1aa" />
                      <Text className="text-gray-400 text-sm ml-1">Room: {classItem.room}</Text>
                    </View>
                  </View>
                  <View className="items-center ml-2 absolute right-4 bottom-4">
                    <View className="flex-row items-center">
                      <Ionicons name="people-outline" size={16} color={theme === '1' ? '#F31260' : '#006FEE'} />
                      <Text className="text-sm font-medium ml-1" style={{ color: theme === '1' ? '#F31260' : '#006FEE' }}>{classItem.students}</Text>
                    </View>
                  </View>
                </MotiView>
              ))
            ) : (
              <View className="bg-zinc-900 rounded-2xl p-4 flex-row items-center">
                <Ionicons name="calendar-outline" size={24} color="#F31260" />
                <Text className="text-gray-400 text-sm ml-3">No classes scheduled for today.</Text>
              </View>
            )}
          </MotiView>

          {/* Overview Stats */}
          <Text className='text-zinc-400 font-semibold text-base mb-1'>Today's Overview</Text>
         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3 mt-3">
              {overviewStats.map((item, idx) => (
                <MotiView
                  key={item.title}
                  from={{ opacity: 0, scale: isFocused ? 0.9 : 1 }}
                  animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                  transition={{ type: 'timing', duration: 300, delay: 100 + idx * 100 }}
                  className="flex-1 bg-zinc-800/50 rounded-xl px-4 py-4 items-center min-w-60"
                >
                  <View className={`p-3 rounded-full mb-2 bg-zinc-800`}>
                    <Ionicons name={item.icon as any} size={24} color={theme === '1' ? '#F31260' : '#006FEE'} />
                  </View>
                  <Text className="text-zinc-200 font-medium text-base">{item.title}</Text>
                  <Typography variant="h2">{item.value}</Typography>
                </MotiView>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

export default Dashboard
