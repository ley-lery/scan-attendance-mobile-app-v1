import { BlurCard, Card, Icon, Input, Loading, Text, Typography } from '@/godui'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useIsFocused } from '@react-navigation/native'
import { AnimatePresence, MotiView, ScrollView } from 'moti'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native'
import Filter from './filter'


export const HISTORY_DATA = [
  { id: 1, status: 'present', date: '2025-08-20', name: 'Web Developer', time: '08:00 AM', room: 'Room 101' },
  { id: 2, status: 'absent', date: '2025-08-21', name: 'UI/UX Designer', time: '09:00 AM', room: 'Room 102' },
  { id: 3, status: 'late', date: '2025-08-22', name: 'Project Manager', time: '08:30 AM', room: 'Room 103' },
  { id: 4, status: 'present', date: '2025-08-23', name: 'QA Tester', time: '08:00 AM', room: 'Room 104' },
  { id: 5, status: 'present', date: '2025-08-24', name: 'Backend Developer', time: '08:10 AM', room: 'Room 105' },
  { id: 6, status: 'absent', date: '2025-08-25', name: 'Frontend Developer', time: '09:20 AM', room: 'Room 106' },
  { id: 7, status: 'present', date: '2025-08-26', name: 'DevOps Engineer', time: '08:00 AM', room: 'Room 107' },
  { id: 8, status: 'late', date: '2025-08-27', name: 'Business Analyst', time: '08:45 AM', room: 'Room 108' },
  { id: 9, status: 'present', date: '2025-08-28', name: 'System Architect', time: '08:00 AM', room: 'Room 109' },
  { id: 10, status: 'absent', date: '2025-08-29', name: 'Mobile Developer', time: '09:00 AM', room: 'Room 110' },
  { id: 11, status: 'present', date: '2025-08-30', name: 'Database Admin', time: '08:05 AM', room: 'Room 111' },
  { id: 12, status: 'late', date: '2025-08-31', name: 'Security Specialist', time: '08:35 AM', room: 'Room 112' },
  { id: 13, status: 'absent', date: '2025-09-01', name: 'Content Writer', time: '09:15 AM', room: 'Room 113' },
  { id: 14, status: 'present', date: '2025-09-02', name: 'SEO Expert', time: '08:00 AM', room: 'Room 114' },
  { id: 15, status: 'late', date: '2025-09-03', name: 'Marketing Lead', time: '08:50 AM', room: 'Room 115' },
  { id: 16, status: 'absent', date: '2025-09-04', name: 'Support Specialist', time: '09:05 AM', room: 'Room 116' },
  { id: 17, status: 'present', date: '2025-09-05', name: 'Product Owner', time: '08:00 AM', room: 'Room 117' },
  { id: 18, status: 'late', date: '2025-09-06', name: 'Scrum Master', time: '08:40 AM', room: 'Room 118' },
  { id: 19, status: 'present', date: '2025-09-07', name: 'Data Scientist', time: '08:00 AM', room: 'Room 119' },
  { id: 20, status: 'absent', date: '2025-09-08', name: 'AI Developer', time: '09:10 AM', room: 'Room 120' }
];

// Icon and color mapping based on status
const STATUS_ICON = {
  present: { name: "checkmark-circle", color: "#22c55e" },  // green
  absent: { name: "close-circle", color: "#ef4444" },       // red
  late: { name: "alert-circle", color: "#eab308" },         // yellow
}

const History = () => {
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all')
  const bottomSheetRef = React.useRef<BottomSheetModal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter history data based on selected filter
  const filteredData = activeFilter === 'all'
    ? HISTORY_DATA
    : HISTORY_DATA.filter(item => item.status === activeFilter)

    const handleOpenFillter = () => {
      if (bottomSheetRef.current) {
          bottomSheetRef.current.present();
      }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const FILTERS = [
    { label: t('all'), value: 'all' },
    { label: t('present'), value: 'present' },
    { label: t('absent'), value: 'absent' },
    { label: t('late'), value: 'late' }
  ]
  
  if (isLoading) return <Loading isLoading={isLoading} />

  return (
    <View className='flex-1 bg-zinc-200 dark:bg-zinc-900'>
      {/* <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 50 }}
          transition={{ type: 'timing', duration: 300, delay: 400 }}
          className="w-full h-full absolute top-0 left-0"
        >
          <Image source={theme === "1" ? IMG.BGH : IMG.BGBH} resizeMode="cover" />
      </MotiView> */}
      <BlurCard 
        intensity={80} 
        tint='default' 
        placementRadius='bottom-left'
        classNames={{
          blur: 'pt-10 pb-2 px-4',
          wrapper: 'absolute top-0 left-0 right-0 z-10',
        }}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
          transition={{ type: 'timing', duration: 200 }}
          className='flex-row items-center justify-between'
        >
          <Text className="dark:text-white text-black font-medium text-2xl">{t('attendanceHistory')}</Text>
        </MotiView>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
          className='flex-row items-center gap-2'
        >
          <Input placeholder="Search by subject name" variant='solid' radius='md' className='mt-2 flex-1' startContent={<AntDesign name="search1" size={24} color="#52525b" />} size='md'/>
          <TouchableOpacity onPress={handleOpenFillter} className='dark:bg-black bg-white p-3 rounded-md shadow-lg shadow-white dark:shadow-black'>
            <Icon name="filter" size={24} />
          </TouchableOpacity>
        </MotiView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
            transition={{ type: 'timing', duration: 200, delay: 200 }}
            className='flex-row items-center gap-2 mt-2 p-1'
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.value
              return (
                  <MotiView
                    key={filter.value}
                    from={{
                      scale: 1,
                      opacity: 0,
                      translateY: -10,
                    }}
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      opacity: 1,
                      translateY: 0,
                    }}
                    transition={{
                      type: 'timing',
                      duration: 350,
                    }}
                  >
                    <TouchableOpacity onPress={() => setActiveFilter(filter.value)} activeOpacity={0.7}>
                      {isActive ? (
                        <View className='bg-white dark:bg-black py-2 px-6 rounded-full dark:shadow-lg dark:shadow-black' >
                          <Typography variant="body" >{filter.label}</Typography>
                        </View>
                      ) : (
                        <View className=' dark:bg-white/20 bg-black/20 py-2 px-6 rounded-full ' >
                          <Text className='dark:text-white text-zinc-600 font-medium text-base'>{filter.label}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </MotiView>
              )
            })}
          </MotiView>
        </ScrollView>
      </BlurCard>
      <ScrollView className='flex-1 px-4 pt-2' contentContainerStyle={{ paddingTop: 160, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
          transition={{ type: 'timing', duration: 200, delay: 200 }}
          className='mb-4'
        >
           <Card radius='xl' isShadow classNames={{ wrapper: 'p-6' }} animation={{ delay: 200, isFocused: isFocused }}>
              <View className='flex-row items-center justify-between gap-2'>
                <View className='items-center gap-0'>
                  <Text className='text-success text-lg font-semibold'>45</Text>
                  <Text className='text-success text-base'>{t('present')}</Text>
                </View>
                <View className='items-center gap-0'>
                  <Text className='text-danger text-lg font-semibold'>45</Text>
                  <Text className='text-danger text-base'>{t('absent')}</Text>
                </View>
                <View className='items-center gap-0'>
                  <Text className='text-warning text-lg font-semibold'>45</Text>
                  <Text className='text-warning text-base'>{t('late')}</Text>
                </View>
                <View className='items-center gap-0'>
                  <Text className='dark:text-white text-zinc-700 text-lg font-semibold'>45</Text>
                  <Text className='text-white text-base'>{t('total')}</Text>
                </View>
              </View>
           </Card>
        </MotiView>
        <AnimatePresence>
          {filteredData.length === 0 ? (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 10 }}
              exit={{ opacity: 0, translateY: 10 }}
              style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 48 }}
            >
              <Text className='text-zinc-400 text-base'>No records found for "{FILTERS.find(f => f.value === activeFilter)?.label}"</Text>
            </MotiView>
          ) : (
            filteredData.map((item, index) => (
              <Card key={index} radius='xl' isShadow classNames={{ wrapper: 'mb-2' }} animation={{ delay: index * 120, isFocused: isFocused }}>
                <View className='flex-row items-center justify-between gap-2'>
                  <View className='flex-row items-center gap-1'>
                    <Ionicons name="calendar" size={18} color="#a1a1aa" />
                    <Text className='text-zinc-400 text-base'>{item.date}</Text>
                  </View>
                  <View className='flex-row items-center gap-1'>
                    <Ionicons
                      name={STATUS_ICON[item.status as keyof typeof STATUS_ICON]?.name || "ellipse" as any}
                      size={24}
                      color={STATUS_ICON[item.status as keyof typeof STATUS_ICON]?.color || "#a1a1aa"}
                    />
                  </View>
                </View>
                <View className='mt-2'>
                  <Text className='dark:text-zinc-300 text-zinc-700 text-lg font-semibold'>{item.name}</Text>
                  <View className='flex-row items-center gap-2 mt-1'>
                    <View className='flex-row items-center gap-2 mt-1'>
                      <Ionicons name="time-outline" size={18} color="#a1a1aa" />
                      <Text className='text-zinc-400 text-sm'>{item.time}</Text>
                    </View>
                    <View className='flex-row items-center gap-2 mt-1'>
                      <Ionicons name="location-outline" size={18} color="#a1a1aa" />
                      <Text className='text-zinc-400 text-sm'>{item.room}</Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))
          )}
        </AnimatePresence>
      </ScrollView>
      <Filter bottomSheetRef={bottomSheetRef} onFilterChange={(data) => console.log(data)} />
    </View>
  )
}

export default History