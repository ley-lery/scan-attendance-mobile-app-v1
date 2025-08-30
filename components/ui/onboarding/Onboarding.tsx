import { IMG } from "@/constants/Image";
import { Button } from "@/godui";
import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MotiView } from "moti";
import type { FC } from "react";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken
} from "react-native";

const { width } = Dimensions.get("window");

type OnboardingItem = {
  key: string;
  title: string;
  subtitle: string;
  image: any;
};

const ONBOARDING_DATA: OnboardingItem[] = [
    {
      key: "1",
      title: "Welcome to UniScan",
      subtitle: "Easily mark your attendance using QR codes – no queues, no delays!",
      // image: require("@/assets/onboarding/scan_qr.png"), // Image of scanning QR
      image: require("@/assets/onboarding/qr.png"), // Image of scanning QR
    },
    {
      key: "2",
      title: "Instant Attendance",
      subtitle: "Scan your unique QR code in seconds and get instant confirmation.",
      // image: require("@/assets/onboarding/instant_scan.png"), // Image of instant scan
      image: require("@/assets/onboarding/qr.png"), // Image of scanning QR
    },
    {
      key: "3",
      title: "Track Your Records",
      subtitle: "View your attendance history and stay updated with notifications.",
      // image: require("@/assets/onboarding/history.png"), // Image of attendance history
      image: require("@/assets/onboarding/qr.png"), // Image of scanning QR
    },
    {
      key: "4",
      title: "Stay Informed",
      subtitle: "Receive real-time updates about classes and attendance alerts.",
      // image: require("@/assets/onboarding/notifications.png"), // Image of notifications
      image: require("@/assets/onboarding/qr.png"), // Image of scanning QR
    },
];

type ButtonProps = {
  label: string;
  onPress: () => void;
  className?: string;
  icon?: React.ReactNode;
};

const OnboardingButton: FC<ButtonProps> = ({ label, onPress, icon }) => (
  <MotiView
    from={{ opacity: 0, translateY: 20 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: "timing", duration: 500 }}
  >
    <Button label={label} onPress={onPress} color="primary" endContent={icon} size="lg"/>
  </MotiView>
);

type DotIndicatorProps = {
  total: number;
  current: number;
};

const DotIndicator: FC<DotIndicatorProps> = ({ total, current }) => {
  const theme = useThemeStore((state) => state.theme);
  console.log(theme, "theme");
  return (
    <View className="flex-row justify-center items-center mb-6">
      {Array.from({ length: total }).map((_, idx) => (
        <MotiView
          key={idx}
          from={{ opacity: 0.5, scale: 1 }}
          animate={{
            opacity: idx === current ? 1 : 0.5,
            scale: idx === current ? 1.4 : 1,
          }}
          transition={{ type: "timing", duration: 300 }}
          className={`h-2 w-2 mx-1 rounded-full ${idx === current ? theme === "1" ? "bg-theme1-primary" : "bg-theme2-primary" : "bg-white/20"}`}
        />
      ))}
    </View>
  );
}

type OnboardingLayoutProps = {
  item: OnboardingItem;
};

const OnboardingLayout: FC<OnboardingLayoutProps> = ({ item }) => (
  <View className="flex-1 items-center justify-center px-6 w-full">
    <MotiView
      from={{ opacity: 0, translateY: 40 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -40 }}
      transition={{ type: "timing", duration: 500 }}
      className="w-full"
    >
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 600 }}
      >
        <Image
          source={item.image}
          className="w-48 h-48 self-center mb-8"
          resizeMode="contain"
          style={{ width: width * 0.6, height: width * 0.6 }}
        />
      </MotiView>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200, type: "timing", duration: 500 }}
      >
        <Text className="text-white text-3xl font-extrabold text-center mb-3 font-['Orbitron']">
          {item.title}
        </Text>
      </MotiView>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 300, type: "timing", duration: 500 }}
      >
        <Text className="text-base text-white/70 text-center mb-2">
          {item.subtitle}
        </Text>
      </MotiView>
    </MotiView>
  </View>
);

type RootStackParamList = {
  Home: undefined;
};

const Onboarding: FC = () => {
  const theme = useThemeStore((state) => state.theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(auth)/sign-in");
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View className="flex-1">
      <Image
        source={theme === "1" ? IMG.BGG : IMG.BGBO}
        className="w-full h-full absolute top-0 left-0"
        resizeMode="cover"
      />

      <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")} className="absolute top-10 right-5 flex-row items-center gap-2 z-50">
        <Text className="text-zinc-400 font-normal text-lg">Skip</Text>
        <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <OnboardingLayout item={item} />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
      />

      <View className="absolute bottom-0 left-0 right-0 px-6 pb-8">
        <DotIndicator total={ONBOARDING_DATA.length} current={currentIndex} />
        <OnboardingButton
          label={currentIndex === ONBOARDING_DATA.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          icon={
            <Ionicons
              name={currentIndex === ONBOARDING_DATA.length - 1 ? "" : "arrow-forward" as any}
              size={16}
              color="#fff"
            />
          }
        />
      </View>
    </View>
  );
};

export default Onboarding;
