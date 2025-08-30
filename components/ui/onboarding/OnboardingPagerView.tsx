import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Image, Text, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const onboardingData = [
  {
    image: require('@/assets/onboarding/qr.png'),
    title: 'Welcome to Our App',
    description: 'Discover amazing features to enhance your experience.',
  },
  {
    image: require('@/assets/onboarding/qr.png'),
    title: 'Stay Connected',
    description: 'Connect with friends and family effortlessly.',
  },
  {
    image: require('@/assets/onboarding/qr.png'),
    title: 'Get Started',
    description: 'Begin your journey with a personalized setup.',
  },
];

export const OnboardingPagerView = () => {
  const [pageIndex, setPageIndex] = useState(0);

  const handleNext = () => {
    if (pageIndex < onboardingData.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
        router.replace("/(auth)/sign-in");
    }
  };

  return (
    <PagerView style={{ flex: 1 }} initialPage={0} onPageSelected={(e) => setPageIndex(e.nativeEvent.position)}>
      {onboardingData.map((item, index) => (
        <View key={index} className="flex-1 justify-center items-center p-4">
          <Image source={item.image} className="mb-4" />
          <Text className="text-2xl font-bold mb-2">{item.title}</Text>
          <Text className="text-center text-lg">{item.description}</Text>
          {index === onboardingData.length - 1 && (
            <Button title="Get Started" onPress={handleNext} />
          )}
        </View>
      ))}
    </PagerView>
  );
}
