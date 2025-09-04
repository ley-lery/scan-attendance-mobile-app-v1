import "@/assets/styles/global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import i18n from "../assets/translate/i18n";
import { useThemeStore } from "../stores/useThemeStore";

function AppContent() {
  const loadTheme = useThemeStore((state) => state.loadTheme);
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
    "Khmer-OS-Siemreap": require("../assets/fonts/Khmer-OS-Siemreap-Regular.ttf"),
    Piximisa: require("../assets/fonts/Piximisa.ttf"),
  });

  const { i18n } = useTranslation();

  // Preload app assets and settings
  useEffect(() => {
    async function prepareApp() {
      try {
        await SplashScreen.preventAutoHideAsync();

        // Load essential images
        const images = [
          require("../assets/background/bg-gd-auth.png"),
          require("../assets/background/bg-gradient.png"),
          require("../assets/background/bg-history-attendance.png"),
          require("../assets/background/bg-profile.png"),
          require("../assets/background/bg-blue-profile.png"),
          require("../assets/background/bg-blue-gd-auth.png"),
          require("../assets/background/bg-blue-history-attendance.png"),
          require("../assets/flags/cambodia-flag.jpg"),
          require("../assets/flags/english-flag.jpg"),
        ];
        await Asset.loadAsync(images);

        // Load sounds
        // soundManager.preloadSounds();

        // Load language preference
        const lang = await AsyncStorage.getItem("language");
        if (lang) await i18n.changeLanguage(lang);

        // Load theme
        await loadTheme();
      } catch (err) {
        console.warn("App preparation error:", err);
      } finally {
        setAppReady(true);
      }
    }

    prepareApp();
  }, []);

  // Hide splash screen once everything is loaded
  useEffect(() => {
    if (fontsLoaded && appReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, appReady]);

  if (!fontsLoaded || !appReady) return null;

  return (
    <AuthProvider>
      <ToastProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="auto" />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ToastProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppContent />
    </I18nextProvider>
  );
}
