import i18n from '@/assets/translate/i18n'
import { IMG } from '@/constants/Image'
import { Card, Alert as CustomAlert, Loading, useDisclosure } from '@/godui'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUserStore } from '@/stores/userStore'
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Language from './langauge'
import Theme from './theme'

interface ProfileActionProps {
  icon: React.ReactNode,
  iconColor?: string,
  label: string,
  onPress?: () => void,
  bg?: string,
  textColor?: string,
}

interface ProfileInfoRowProps {
  icon: React.ReactNode,
  label: string,
  value: string | number,
}

const ProfileInfoRow = ({ icon, label, value }: ProfileInfoRowProps) => (
  <View className="flex-row items-center py-2 px-3 bg-zinc-900 rounded-xl mb-2">
    <View className="p-3 justify-center items-center mr-3 bg-zinc-800 rounded-full">
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-zinc-400 text-xs">{label}</Text>
      <Text className="text-zinc-200 text-base font-semibold">{value}</Text>
    </View>
  </View>
);

const ProfileAction = ({ icon, iconColor, label, onPress, bg = "bg-zinc-900", textColor = "text-zinc-200" }: ProfileActionProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${bg}`}
    activeOpacity={0.8}
  >
    <View className="w-7 h-7 justify-center items-center mr-3">
      {icon}
    </View>
    <Text className={`${textColor} text-base flex-1`}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color={iconColor || "#71717a"} />
  </TouchableOpacity>
);

const lecturerData = {
  first_name: "Vay",
  last_name: "Sophanno",
  lecturer_code: "LEC123456",
  email: "lecturer@email.com",
  phone: "123-456-7890",
  office_room: "Room 101",
  academic_title: "Assistant Professor",
  department: "Computer Science",
  years_experience: 5,
  total_students: 120,
  total_courses: 10,
}

const Profile = () => {
  const { t } = useTranslation();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const isFocused = useIsFocused();

  const bottomSheetRef = React.useRef<BottomSheetModal | null>(null);
  const bottomSheetThemeRef = React.useRef<BottomSheetModal | null>(null);

  const user = useUserStore((state) => state.users);
  const setUserData = useUserStore((state) => state.setusers);

  const theme = useThemeStore((state) => state.theme);
  const setThemeColor = useThemeStore((state) => state.setTheme);
  const loadTheme = useThemeStore((state) => state.loadTheme);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const language = await AsyncStorage.getItem("language");
        if (language) i18n.changeLanguage(language);

        await loadTheme(); // load theme from AsyncStorage
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData().finally(() => setIsLoading(false));
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      setUserData(null);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error removing data from AsyncStorage:", error);
    }
  };

  const handleLanguageChange = async (code: string) => {
    await AsyncStorage.setItem("language", code);
    i18n.changeLanguage(code);
    bottomSheetRef.current?.dismiss();
  };

  const handleThemeChange = (theme: "1" | "2") => {
    bottomSheetThemeRef.current?.dismiss();
    setThemeColor(theme); 
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) return <Loading isLoading={isLoading} />

  return (
    <>
      <CustomAlert
        visible={isOpen}
        title={t("logout")}
        message={t("logoutConfirmation")}
        onConfirm={logout}
        onCancel={onClose}
        confirmText={t("yes")}
        cancelText={t("no")}
      />
      <SafeAreaView className="flex-1 bg-black">
        {/* Animated background */}
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : -50 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
          className="w-full h-full absolute top-0 left-0 z-0"
        >
          <Image source={theme === "1" ? IMG.BGP : IMG.BGBP}  />
        </MotiView>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 90, paddingTop: 20, paddingHorizontal: 18 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <Card isFocused={isFocused} animation={{ delay: 100 }} transparent className="mb-4 px-0 py-0 relative">
            <TouchableOpacity className="absolute right-5 top-5 z-10">
              <Ionicons name="settings-outline" size={22} color="#a1a1aa" />
            </TouchableOpacity>

            <View className="flex-row items-center bg-zinc-900/80 rounded-2xl p-5 shadow-lg">
              <View className="mr-5">
                <Image
                  source={{ uri: user?.avatar }}
                  className={[
                    "w-20 h-20 rounded-full border-4",
                    theme === "1" ? "border-theme1-primary" : "border-theme2-primary",
                  ].join(" ")}
                  style={{ backgroundColor: "#222" }}
                />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold mb-1">{lecturerData.first_name + " " + lecturerData.last_name}</Text>
                <View className="flex-row items-center my-1">
                  <Ionicons name="person-outline" size={16} color="#a1a1aa" />
                  <Text className="text-zinc-400 text-sm ml-1">{lecturerData.lecturer_code}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="mail-outline" size={16} color="#a1a1aa" />
                  <Text className="text-zinc-400 text-sm ml-1">{lecturerData.email}</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Info Section */}
          <Card radius="lg" isFocused={isFocused} animation={{ delay: 150 }} className="mb-4 px-0 py-0">
            <View className="p-4">
              <Text className={[
                "text-xs font-semibold mb-2 uppercase tracking-widest",
                theme === "1" ? "text-theme1-primary" : "text-theme2-primary",
              ].join(" ")}>
                {t("profileInformation")}
              </Text>
              <ProfileInfoRow
                icon={<Ionicons name="school-outline" size={20} color="#f31260" />}
                label={t("department")}
                value={lecturerData.department || t("notAvailable")}
              />
              <ProfileInfoRow
                icon={<Feather name="book-open" size={20} color="#f59e42" />}
                label={t("academicTitle")}
                value={lecturerData.academic_title || t("notAvailable")}
              />
              <ProfileInfoRow
                icon={<MaterialCommunityIcons name="office-building-outline" size={20} color="#38bdf8" />}
                label={t("officeRoom")}
                value={lecturerData.office_room || t("notAvailable")}
              />
              <ProfileInfoRow
                icon={<Ionicons name="call-outline" size={20} color="#38bdf8" />}
                label={t("phone")}
                value={lecturerData.phone || t("notAvailable")}
              />
            </View>
          </Card>

          {/* Lecturer Stats */}
          <Card radius="lg" isFocused={isFocused} animation={{ delay: 200 }} className="mb-4 px-0 py-0">
            <View className="p-4">
              <Text className={[
                "text-xs font-semibold mb-2 uppercase tracking-widest",
                theme === "1" ? "text-theme1-primary" : "text-theme2-primary",
              ].join(" ")}>
                {t("lecturerOverview")}
              </Text>
              <View className="flex-row justify-between items-center py-4">
                <View className="items-center flex-1">
                  <Ionicons name="people-outline" size={30} color="#38bdf8" />
                  <Text className="text-zinc-300 text-lg font-bold mt-2">{lecturerData.total_students ?? "--"}</Text>
                  <Text className="text-zinc-400 text-xs">{t("totalStudents")}</Text>
                </View>
                <View className="items-center flex-1">
                  <Feather name="book" size={28} color="#f59e42" />
                  <Text className="text-zinc-300 text-lg font-bold mt-2">{lecturerData.total_courses ?? "--"}</Text>
                  <Text className="text-zinc-400 text-xs">{t("totalCourses")}</Text>
                </View>
                <View className="items-center flex-1">
                  <MaterialCommunityIcons name="calendar-check-outline" size={30} color="#db2777" />
                  <Text className="text-zinc-300 text-lg font-bold mt-2">{lecturerData.years_experience ?? "--"}</Text>
                  <Text className="text-zinc-400 text-xs">{t("yearsExperience")}</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Account Settings */}
          <Card radius="lg" isFocused={isFocused} animation={{ delay: 250 }} className="mb-4 px-0 py-0">
            <View className="p-4">
              <Text className={[
                "text-xs font-semibold mb-2 uppercase tracking-widest",
                theme === "1" ? "text-theme1-primary" : "text-theme2-primary",
              ].join(" ")}>
                {t("accountSettings")}
              </Text>
              <ProfileAction
                icon={<Ionicons name="key-outline" size={20} color="#f59e42" />}
                label={t("changePassword")}
                onPress={() => {}}
                textColor="text-zinc-400"
                bg="bg-zinc-900/60"
              />
              <ProfileAction
                icon={<MaterialCommunityIcons name="theme-light-dark" size={24} color={theme === "1" ? "#db2777" : "#006FEE"} />}
                label={t("changeTheme")}
                onPress={() => bottomSheetThemeRef.current?.present()}
                textColor="text-zinc-200"
                bg="bg-zinc-900/60"
              />
              <ProfileAction
                icon={<Ionicons name="language-outline" size={20} color="#38bdf8" />}
                label={t("changeLanguage")}
                onPress={() => bottomSheetRef.current?.present()}
                textColor="text-zinc-200"
                bg="bg-zinc-900/60"
              />
              <ProfileAction
                icon={<MaterialCommunityIcons name="account-group-outline" size={24} color="orange" />}
                label={t("myClasses")}
                // onPress={() => router.push("/(lecturer)/classes")}
                textColor="text-zinc-200"
                bg="bg-zinc-900/60"
              />
              <ProfileAction
                icon={<MaterialCommunityIcons name="email-outline" size={24} color="#a1a1aa" />}
                label={t("contactAdmin")}
                onPress={() => router.push("/(lecturer)/profile/contact")}
                textColor="text-zinc-200"
                bg="bg-zinc-900/60"
              />
              <ProfileAction
                icon={<Ionicons name="help-circle-outline" size={26} color="#006FEE" />}
                label={t("faq")}
                onPress={() => router.push("/(lecturer)/profile/faq")}
                textColor="text-zinc-200"
                bg="bg-zinc-900/60"
              />
              <ProfileAction
                icon={<Ionicons name="log-out-outline" size={20} color="#f31260" />}
                label={t("logout")}
                onPress={onOpen}
                textColor="text-danger"
                bg="bg-danger/10"
                iconColor="#db2777"
              />
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
      <Language bottomSheetRef={bottomSheetRef} onLanguageChange={handleLanguageChange}/>
      <Theme bottomSheetRef={bottomSheetThemeRef} onThemeChange={handleThemeChange}/>
    </>
  );
};

export default Profile
