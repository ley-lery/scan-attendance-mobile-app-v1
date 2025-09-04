import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { MotiView } from 'moti';
import React, { useCallback, useState } from 'react';
import { Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import { IMG } from '@/constants/Image';
import { BlurCard, Button, Input, InputPassword, useAuth, useHaptic, useToast } from '@/godui';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/useThemeStore';

// Constants
const ANIMATION_DELAYS = {
  BACKGROUND: 400,
  HEADER: 400,
  WELCOME: 100,
  USERNAME: 100,
  EMAIL: 200,
  PASSWORD: 300,
  BUTTON: 400,
  SIGNIN_LINK: 500,
} as const;

const TOAST_DELAYS = {
  SUCCESS: 500,
  ERROR: 1000,
} as const;

const NAVIGATION_DELAY = 1000;

// Validation schema
const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
});

// Types
interface FormValues {
  username: string;
  email: string;
  password: string;
}

interface SignUpResponse {
  success: boolean;
  user?: any;
  error?: string;
}

const SignUp: React.FC = () => {
  // Hooks
  const { trigger } = useHaptic();
  const { show } = useToast();
  const { register } = useAuth(); // Assuming there's a register method
  const theme = useThemeStore((state) => state.theme);
  const isFocused = useIsFocused();
  const setUser = useUserStore((state) => state.setusers);

  // State
  const [submitting, setSubmitting] = useState(false);

  // Handlers
  const handleHapticFeedback = useCallback(() => {
    trigger(Haptics.ImpactFeedbackStyle.Light);
  }, [trigger]);

  const showToast = useCallback((type: 'success' | 'error', title: string, message: string, delay = 0) => {
    setTimeout(() => {
      show({
        type,
        title,
        message,
        position: 'top',
        duration: type === 'success' ? 500 : 2500,
      });
      handleHapticFeedback();
    }, delay);
  }, [show, handleHapticFeedback]);

  const navigateToHome = useCallback(() => {
    setTimeout(() => {
      router.replace('../(student)/home');
    }, NAVIGATION_DELAY);
  }, []);

  const handleSignUp = useCallback(async (values: FormValues) => {
    try {
      handleHapticFeedback();
      setSubmitting(true);

      // If register method doesn't exist, implement signup logic here
      const response: SignUpResponse = register 
        ? await register(values.username, values.email, values.password)
        : { success: false, error: 'Registration not implemented' };
      
      if (__DEV__) {
        console.log('Sign up response:', JSON.stringify(response, null, 2));
      }

      if (response.success && response.user) {
        setUser(response.user);
        showToast('success', 'Account created', 'Welcome! Your account has been created successfully.', TOAST_DELAYS.SUCCESS);
        navigateToHome();
      } else {
        const errorMessage = response.error || 'An unexpected error occurred';
        showToast('error', 'Sign up failed', errorMessage, TOAST_DELAYS.ERROR);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      showToast('error', 'Sign up failed', 'Network error. Please try again.', TOAST_DELAYS.ERROR);
    } finally {
      // Reset submitting state after error delay
      setTimeout(() => {
        setSubmitting(false);
      }, TOAST_DELAYS.ERROR + 100);
    }
  }, [register, setUser, showToast, navigateToHome, handleHapticFeedback]);

  const handleGoBack = useCallback(() => {
    handleHapticFeedback();
    router.back();
  }, [handleHapticFeedback]);

  const handleSignInNavigation = useCallback(() => {
    handleHapticFeedback();
    router.back();
  }, [handleHapticFeedback]);

  // Computed values
  const backgroundImage = theme === "1" ? IMG.BGL : IMG.BGBA;
  const primaryTextColor = theme === "1" ? "text-theme1-primary" : "text-theme2-primary";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Background Image */}
      <MotiView
        from={{ opacity: 0, translateY: -50 }}
        animate={{ 
          opacity: isFocused ? 1 : 0, 
          translateY: isFocused ? 0 : -50 
        }}
        transition={{ 
          type: 'timing', 
          duration: 600, 
          delay: ANIMATION_DELAYS.BACKGROUND 
        }}
        className="w-full h-full absolute top-0 left-0"
      >
        <Image 
          source={backgroundImage} 
          resizeMode="cover" 
          className="w-full h-full"
        />
      </MotiView>

      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === "ios" ? 120 : 0}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 items-center justify-center z-10 relative px-6 py-8">
          {/* Card with animation */}
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ 
              opacity: isFocused ? 1 : 0, 
              translateY: isFocused ? 0 : 50 
            }}
            transition={{ type: 'timing', duration: 600 }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <MotiView
              from={{ opacity: 0, translateX: -100 }}
              animate={{ 
                opacity: isFocused ? 1 : 0, 
                translateX: isFocused ? 0 : -100 
              }}
              transition={{ 
                type: 'timing', 
                duration: 600, 
                delay: ANIMATION_DELAYS.HEADER 
              }}
              className="mb-8"
            >
              <TouchableOpacity 
                onPress={handleGoBack} 
                disabled={submitting}
                activeOpacity={0.7}
                className="flex-row items-center gap-2"
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text className="text-white text-2xl font-bold">Sign Up</Text>
              </TouchableOpacity>
            </MotiView>

            {/* Form Container */}
            <BlurCard 
              tint="dark" 
              radius="xl" 
              placementRadius="all"
              className="p-8"
            >
              {/* Welcome Section */}
              <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: isFocused ? 1 : 0, 
                  scale: isFocused ? 1 : 0.9 
                }}
                transition={{ 
                  delay: ANIMATION_DELAYS.WELCOME, 
                  type: 'timing', 
                  duration: 500 
                }}
                className="items-center mb-6"
              >
                <Text className={`text-3xl font-bold text-center mb-1 ${primaryTextColor}`}>
                  Create Account
                </Text>
                <Text className="text-zinc-400 text-center text-base max-w-72">
                  Please enter your details to create an account
                </Text>
              </MotiView>

              <Formik<FormValues>
                initialValues={{ 
                  username: '', 
                  email: '', 
                  password: '' 
                }}
                validationSchema={signUpSchema}
                onSubmit={handleSignUp}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <>
                    {/* Form Fields */}
                    <View className="gap-4 mb-6">
                      {/* Username Input */}
                      <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: isFocused ? 1 : 0, 
                          scale: isFocused ? 1 : 0.9 
                        }}
                        transition={{ 
                          delay: ANIMATION_DELAYS.USERNAME, 
                          type: 'timing', 
                          duration: 500 
                        }}
                      >
                        <Input
                          isRequired
                          label="Username"
                          placeholder="Enter your username"
                          value={values.username}
                          onChangeText={handleChange('username')}
                          onBlur={handleBlur('username')}
                          autoCapitalize="none"
                          autoComplete="username"
                          textContentType="username"
                          startContent={<Ionicons name="person" size={20} color="#71717a" />}
                          isInvalid={!!(touched.username && errors.username)}
                          errorMessage={touched.username && errors.username ? errors.username : ''}
                          isDisabled={submitting}
                          notDarkMode
                        />
                      </MotiView>

                      {/* Email Input */}
                      <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: isFocused ? 1 : 0, 
                          scale: isFocused ? 1 : 0.9 
                        }}
                        transition={{ 
                          delay: ANIMATION_DELAYS.EMAIL, 
                          type: 'timing', 
                          duration: 500 
                        }}
                      >
                        <Input
                          isRequired
                          label="Email"
                          placeholder="Enter your email"
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="email"
                          textContentType="emailAddress"
                          startContent={<Ionicons name="mail" size={22} color="#71717a" />}
                          isInvalid={!!(touched.email && errors.email)}
                          errorMessage={touched.email && errors.email ? errors.email : ''}
                          isDisabled={submitting}
                          notDarkMode
                        />
                      </MotiView>

                      {/* Password Input */}
                      <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ 
                          opacity: isFocused ? 1 : 0, 
                          scale: isFocused ? 1 : 0.9 
                        }}
                        transition={{ 
                          delay: ANIMATION_DELAYS.PASSWORD, 
                          type: 'timing', 
                          duration: 500 
                        }}
                      >
                        <InputPassword
                          isRequired
                          label="Password"
                          placeholder="Enter your password"
                          value={values.password}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          startContent={<Ionicons name="lock-closed" size={22} color="#71717a" />}
                          isInvalid={!!(touched.password && errors.password)}
                          errorMessage={touched.password && errors.password ? errors.password : ''}
                          isDisabled={submitting}
                          autoComplete="new-password"
                          textContentType="newPassword"
                        />
                      </MotiView>
                    </View>

                    {/* Sign Up Button */}
                    <MotiView
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: isFocused ? 1 : 0, 
                        scale: isFocused ? 1 : 0.9 
                      }}
                      transition={{ 
                        delay: ANIMATION_DELAYS.BUTTON, 
                        type: 'timing', 
                        duration: 500 
                      }}
                    >
                      <Button
                        label="Create Account"
                        onPress={handleSubmit}
                        isLoading={submitting}
                        className="w-full"
                        color="primary"
                        startContent={<Ionicons name="person-add" size={20} color="#fff" />}
                      />
                    </MotiView>

                    {/* Sign In Link */}
                    <MotiView
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ 
                        opacity: isFocused ? 1 : 0, 
                        scale: isFocused ? 1 : 0.9 
                      }}
                      transition={{ 
                        delay: ANIMATION_DELAYS.SIGNIN_LINK, 
                        type: 'timing', 
                        duration: 500 
                      }}
                    >
                      <View className="flex-row justify-center mt-6">
                        <Text className="text-white/60 text-base">
                          Already have an account?{' '}
                        </Text>
                        <TouchableOpacity 
                          onPress={handleSignInNavigation}
                          disabled={submitting}
                          activeOpacity={0.7}
                        >
                          <Text className={`text-base ${primaryTextColor}`}>
                            Sign In
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </MotiView>
                  </>
                )}
              </Formik>
            </BlurCard>
          </MotiView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;