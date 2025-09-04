import CardLongPress from '@/components/ui/long-press/CardLongPress'
import { Badge, BlurCard, Card, Icon, Loading, Notification, Text, Typography, useDisclosure, useHaptic } from '@/godui'
import { useUserStore } from '@/stores/userStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { Entypo, Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Clipboard, Image, ScrollView, Text as TextNative, TouchableOpacity, useColorScheme, View } from 'react-native'



const CardLeave = ({ icon, title, subtitle, navigate, isFocused }: { icon: string, title: string, subtitle: string, navigate: string, isFocused: boolean }) => (
  <Card transparent radius="2xl" classNames={{ wrapper: 'bg-white dark:bg-zinc-800' }} animation={{ type: 'timing', duration: 300, delay: 120, isFocused }}>
    <TouchableOpacity onPress={() => router.push(`../(student)/home/${navigate}`)} className='flex-row items-center justify-between'>
      <View className='flex-row items-center gap-4'>
        <View className='dark:bg-black bg-zinc-100 p-4 rounded-md dark:shadow dark:shadow-black' >
          <Icon name={icon as any} size={24}  />
        </View>
        <View className='gap-1'>
          <Text className="text-zinc-600 dark:text-zinc-200 font-medium text-base">{title}</Text>
          <Text className="text-zinc-400">{subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={17} color="#a1a1aa" />
    </TouchableOpacity>
  </Card>
)

interface InfoCardProps{
  title: string,
  subtitle: string,
  time: string,
  room: string,
  status: string,
  statusColor: string,
  isFocused: boolean,
  delay: number,
  label: string,
}

const InfoCard = ({ title,time,room,status,statusColor,isFocused,delay,label }: InfoCardProps) => (
  <MotiView
    from={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
    transition={{ type: 'timing', duration: 200, delay }}
  >
    <Text className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-1">{label}</Text>
    <Card radius="xl" classNames={{ content: 'flex-row items-center justify-between ' }}>
      <View className='flex-1 gap-1'> 
        <TextNative className="text-zinc-600 dark:text-zinc-200 font-semibold text-base mb-1">{title}</TextNative>
        <TextNative className="text-zinc-500 dark:text-zinc-400 text-sm">{time} → {room}</TextNative>
      </View>
      <View className="flex-row items-center">
        <Entypo name="dot-single" size={24} color={statusColor} />
        <TextNative className={`text-base ${status === 'Upcoming' ? 'text-warning' : 'text-success'}`}>{status}</TextNative>
      </View>
    </Card>
  </MotiView>
)

const cardData = [
  {
    id: 1,
    title: 'Web developer Senior',
    subtitle: 'Today class',
    content: 'Please join the class at 10:00 AM',
    time: '2 min ago',
    status: 'Upcoming',
    statusColor: '#fbbf24',
  },
]


const Dashboard = () => {
  const theme = useThemeStore((state) => state.theme);
  const themeColor = useColorScheme();
  const { trigger } = useHaptic()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useUserStore((state) => state.users);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const SectionGradientCard = ({
    children,
    style,
  }: {
    children: React.ReactNode,
    style?: object,
  }) => (
    <LinearGradient
      colors={[themeColor === 'dark' ? '#000' : '#fff', theme === "1" ? '#F31260' : '#006FEE']}
      start={{ x: .5, y: 0 }}
      end={{ x: 2, y: 4 }}
      style={[{ borderRadius: 30 }, style]}
    >
      {children}
    </LinearGradient>
  )

  const studentLeaveList = [
    { icon: 'time-outline', title: t('todayLeave'), subtitle: t('desc.todayLeave'), navigate: '../../lecturer-stack/dashboard/student-leave-req/student-tody-leave' },
    { icon: 'calendar-outline', title: t('otherLeaves'), subtitle: t('desc.otherLeaves'), navigate: '../../lecturer-stack/dashboard/student-leave-req/student-other-leave' },
  ]

  const cardTodayOverviewList = [
    { icon: 'time-outline', title: t('leaveSingleDay'), subtitle: t('requestLeaveForToday'), navigate: '../../lecturer-stack/dashboard/leaves/leave' },
    { icon: 'calendar-outline', title: t('extendedLeave'), subtitle: t('requestLeaveForMultipleDays'), navigate: '../../lecturer-stack/dashboard/leaves/extended-leave' },
    { icon: 'list', title: t('leaveHistory'), subtitle: t('desc.viewYourLeaveHistory'), navigate: '../../lecturer-stack/dashboard/leaves/leave-history/[id]' },
  ]
  

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
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
            <Text className="text-zinc-200 ">{notif.title}</Text>
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


  if (isLoading) return <Loading isLoading={isLoading} />
  return (
    <>
    <Notification visible={isOpen} onClose={onClose} >
      <View className='gap-2'>
        {notiData.map((notif) => notificationsRows(notif))}
      </View>
    </Notification>
      <View className='flex-1 bg-zinc-50 dark:bg-zinc-900'>
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 100 }}
          className="absolute top-0 left-0 right-0 z-10"
        >
          <BlurCard
            intensity={themeColor === 'dark' ? 90 : 100}
            tint="default"
            radius="2xl"
            placementRadius="bottom-left"
            classNames={{
              blur: 'px-4 pb-2 pt-10',
            }}
          >
            <View className="flex-row items-center mb-6">
              <Image
                source={{ uri: user?.avatar }}
                className={[
                  "w-16 h-16 rounded-full border-2",
                  theme === "1" ? "border-theme1-primary" : "border-theme2-primary",
                ].join(" ")}
                style={{ backgroundColor: "#222" }}
              />
              <View className="ml-4 flex-1">
                <Text className="text-zinc-600 dark:text-zinc-400 text-base font-normal">{t('goodMorning')}!</Text>
                <TextNative className="text-zinc-800 dark:text-white text-lg font-bold">{user?.name}</TextNative>
                <View className='flex-row items-center gap-2 mt-1'>
                  <TextNative className="text-zinc-600 dark:text-zinc-400 text-xs">ID: {user?.student_code}</TextNative>
                  <TouchableOpacity onPress={() => Clipboard.setString(user?.student_code as string)}>
                    <Ionicons name="copy-outline" size={14} color="#a1a1aa" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity onPress={() => {trigger(); onOpen()}}>
                <MotiView
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                  transition={{ type: 'timing', duration: 200, delay: 100 }}
                >
                  <Badge variant="solid" color="primary" content={1} >
                    <Ionicons name="notifications" size={24} color={themeColor === "dark" ? "#a1a1aa" : "#000"} />
                  </Badge>
                </MotiView>
              </TouchableOpacity>
            </View>
          </BlurCard>
        </MotiView>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingTop: 110, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View className='p-4 py-10'>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
              transition={{ type: 'timing', duration: 200, delay: 100 }}
            >
              <SectionGradientCard>
                <View className='py-4 px-6 gap-1'>
                  <Typography variant="subtitle">
                    Mark Attendance
                  </Typography>
                  <View>
                    <TextNative className="text-zinc-700 dark:text-white text-3xl font-bold">Lecturer Dashboard</TextNative>
                    <Typography variant="h2">QR Code Attendance Marking</Typography>
                  </View>
                  <TextNative className="text-zinc-600 dark:text-zinc-300 text-sm">
                    Use your lecturer dashboard to mark attendance for your students. Quickly scan the QR code on their device to mark their attendance.
                  </TextNative>
                </View>
              </SectionGradientCard>
            </MotiView>

            <Card radius="xl" classNames={{ wrapper: 'mt-4' }} animation={{ type: 'timing', duration: 300, delay: 120, isFocused }}>
              <View className='flex-row items-end justify-between  gap-4'>
                <View className='flex-1'>
                  <Text className="text-zinc-600 dark:text-zinc-300 font-semibold text-base mb-1">{t('viewTodayClasses')}</Text>
                  <Text className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {t('desc.viewTodayClasses')}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => router.push('../student-stack/home/today')} className='bg-zinc-100 dark:bg-zinc-800 py-2 px-5 rounded-md shadow-md shadow-white dark:shadow-zinc-800' >
                    <Typography variant="subtitle" >{t('seeNow')}</Typography>
                </TouchableOpacity>
              </View>
            </Card>

            <View className='mt-4'>
              <InfoCard
                title="Web Developer Senior"
                subtitle=""
                time="9:05 AM"
                room="Room C-101"
                status="Upcoming"
                statusColor="#f5a524"
                isFocused={isFocused}
                delay={300}
                label={t('todayClass')}
              />
            </View>
            
            <View className='mt-4'>
              <CardLongPress cardData={cardData} />
            </View>
            <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }} transition={{ type: 'timing', duration: 200, delay: 200 }} className='mt-4'>
              <Text className="text-zinc-400 font-medium text-sm mb-1">{t('leaves')}</Text>
              <View className="gap-2">
                {cardTodayOverviewList.map((item, index) => (
                  <CardLeave
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    navigate={item.navigate}
                    isFocused={isFocused}
                  />
                ))}
              </View>
            </MotiView>
            <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }} transition={{ type: 'timing', duration: 200, delay: 200 }} className='mt-4'>
              <Text className="text-zinc-400 font-medium text-sm mb-1">{t('studentLeave')}</Text>
              <View className="gap-2 mb-6">
                {studentLeaveList.map((item, index) => (
                  <CardLeave
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    navigate={item.navigate}
                    isFocused={isFocused}
                  />
                ))}
              </View>
            </MotiView>
          </View>
        </ScrollView>
      </View>
    </>
  )
}

export default Dashboard