import { Button } from '@/godui'
import { useThemeStore } from '@/stores/useThemeStore'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const FAQ = () => {
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  // Accent color based on theme
  const accentColor = theme === "1" ? "#db2777" : "#006FEE"
  const accentBg = theme === "1" ? "bg-pink-700/30" : "bg-blue-700/30"
  const accentText = theme === "1" ? "text-pink-600" : "text-blue-600"

  const faqData = [
    {
      question: t("howDoIResetMyPassword"),
      answer: t("goToSettingsTapChangePasswordFollowInstructions"),
      icon: "lock-reset",
    },
    {
      question: t("whereCanISeeMyClassSchedule"),
      answer: t("classScheduleAvailableHomeTodayClasses"),
      icon: "calendar-clock",
    },
    {
      question: t("howDoIContactAdmin"),
      answer: t("navigateToContactPageUseProvidedEmailPhone"),
      icon: "account-question",
    },
    {
      question: t("whatShouldIDoIfIFindABug"),
      answer: t("pleaseReportBugsViaContactPage"),
      icon: "bug",
    },
  ];
  

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Back Button */}
      <MotiView
        from={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: isFocused ? 1 : 0, translateX: isFocused ? 0 : -50 }}
        transition={{ type: 'timing', duration: 600, delay: 400 }}
        className="absolute top-8 left-0 z-20"
      >
        <Button
          label={t("back")}
          onPress={() => router.back()}
          color="primary"
          size='lg'
          variant='light'
          startContent={<Ionicons name="arrow-back" size={22} color={accentColor} />}
        />
      </MotiView>

      <View className="flex-1 justify-center items-center z-10 pt-28">
        <View className='w-full'>
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            className="px-6 pt-12 pb-2"
            style={{ zIndex: 2 }}
          >
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={36}
                color={accentColor}
                style={{ marginRight: 8 }}
              />
              <Text className="text-3xl font-extrabold text-white tracking-tight">FAQ</Text>
            </View>
            <Text className="text-zinc-300 text-base mb-4">
              {t("Frequently Asked Questions") || "Frequently Asked Questions"}
            </Text>
          </MotiView>

          {/* FAQ List */}
          <ScrollView className="w-full px-4 h-full" showsVerticalScrollIndicator={false} style={{ zIndex: 2 }}>
            {faqData.map((item, idx) => {
              const isOpen = openIndex === idx;

              return (
                <MotiView
                  key={idx}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: 'timing',
                    duration: 400,
                    delay: idx * 100 + 200
                  }}
                  className="mb-4"
                  style={{
                    shadowColor: accentColor,
                    shadowOpacity: isOpen ? 0.18 : 0.08,
                    shadowRadius: isOpen ? 12 : 6,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: isOpen ? 6 : 2,
                  }}
                >
                  {/* Question */}
                  <TouchableOpacity
                    className={[
                      "flex-row items-center justify-between px-5 py-4",
                      isOpen
                        ? `rounded-t-2xl ${accentBg} border-b border-zinc-800`
                        : "rounded-2xl bg-zinc-900",
                      "transition-all duration-200"
                    ].join(" ")}
                    activeOpacity={0.92}
                    onPress={() => handleToggle(idx)}
                  >
                    <View className="flex-row items-center flex-1">
                      <MaterialCommunityIcons
                        name={item.icon as any}
                        size={24}
                        color={accentColor}
                        style={{ marginRight: 14 }}
                      />
                      <Text className={`text-white text-base font-semibold flex-1 pr-3 ${isOpen ? accentText : ""}`}>
                        {item.question}
                      </Text>
                    </View>
                    {/* Animated Chevron */}
                    <MotiView
                      animate={{
                        rotate: isOpen ? '180deg' : '0deg',
                        scale: isOpen ? 1.15 : 1
                      }}
                      transition={{
                        type: 'timing',
                        duration: 300,
                      }}
                    >
                      <Ionicons
                        name={isOpen ? "remove-circle" : "add-circle"}
                        size={26}
                        color={isOpen ? accentColor : "#a1a1aa"}
                      />
                    </MotiView>
                  </TouchableOpacity>

                  {/* Answer with Smooth Animation */}
                  <AnimatePresence>
                    {isOpen && (
                      <MotiView
                        from={{
                          opacity: 0,
                          height: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                        animate={{
                          opacity: 1,
                          height: 100,
                          paddingTop: 18,
                          paddingBottom: 18,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                        transition={{
                          type: 'timing',
                          duration: 350,
                          opacity: { duration: 200 }
                        }}
                        className={`bg-zinc-900 rounded-b-2xl px-6 overflow-hidden border-t border-zinc-800`}
                      >
                        <MotiView
                          from={{ opacity: 0, translateY: -10 }}
                          animate={{ opacity: 1, translateY: 0 }}
                          exit={{ opacity: 0, translateY: -10 }}
                          transition={{ type: 'timing', duration: 250, delay: 50 }}
                        >
                          <Text className="text-zinc-200 text-base leading-relaxed">
                            {item.answer}
                          </Text>
                        </MotiView>
                      </MotiView>
                    )}
                  </AnimatePresence>
                </MotiView>
              );
            })}

            {/* Suggestion Box */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 600 }}
              className={`mt-2 mb-8 px-5 py-5 rounded-2xl ${accentBg} flex-row items-center`}
              style={{
                shadowColor: accentColor,
                shadowOpacity: 0.12,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={28}
                color={accentColor}
                style={{ marginRight: 14 }}
              />
              <View className="flex-1">
                <Text className={`text-white font-semibold text-base mb-1`}>
                  {t("Didn't find your answer?")}
                </Text>
                <Text className="text-zinc-300 text-sm mb-2">
                  {t("Contact our support team and we'll help you out!")}
                </Text>
                <Button
                  label={t("Contact Support")}
                  onPress={() => router.push('/profile/contact')}
                  color="primary"
                  size="sm"
                  variant="solid"
                  className="self-start"
                  startContent={<Ionicons name="mail-outline" size={18} color="#fff" />}
                />
              </View>
            </MotiView>

            {/* Bottom Spacing */}
            <View className="h-16" />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default FAQ