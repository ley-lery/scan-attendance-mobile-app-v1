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
import { BlurCard, Button, Checkbox, Input, InputPassword, useAuth, useHaptic, useToast } from '@/godui';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/useThemeStore';

// Constants
const ANIMATION_DELAYS = {
  HEADER: 400,
  WELCOME: 0,
  EMAIL: 100,
  PASSWORD: 200,
  OPTIONS: 300,
  BUTTON: 400,
  SIGNUP_LINK: 500,
} as const;

const TOAST_DELAYS = {
  SUCCESS: 500,
  ERROR: 1000,
} as const;

const NAVIGATION_DELAY = 1000;

// Validation schema
const signInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(1, 'Password is required').required('Password is required'),
});

// Types
interface FormValues {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: any;
  error?: string;
}

const SignIn: React.FC = () => {
  // =========  Hooks =========
  const { trigger } = useHaptic();
  const { show } = useToast();
  const { login } = useAuth();
  const theme = useThemeStore((state) => state.theme);
  const isFocused = useIsFocused();
  const setUser = useUserStore((state) => state.setusers);

  // =========  State =========
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========  Handlers =========
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

  const handleSignIn = useCallback(async (values: FormValues) => {
    try {
      handleHapticFeedback();
      setSubmitting(true);

      const response: LoginResponse = await login(values.email, values.password);
      
      if (__DEV__) {
        console.log('Login response:', JSON.stringify(response, null, 2));
      }

      if (response.success && response.user) {
        setUser(response.user);
        showToast('success', 'Signed in', 'Welcome back!', TOAST_DELAYS.SUCCESS);
        navigateToHome();
      } else {
        const errorMessage = response.error || 'An unexpected error occurred';
        showToast('error', 'Sign in failed', errorMessage, TOAST_DELAYS.ERROR);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      showToast('error', 'Sign in failed', 'Network error. Please try again.', TOAST_DELAYS.ERROR);
    } finally {
      // Reset submitting state after error delay
      setTimeout(() => {
        setSubmitting(false);
      }, TOAST_DELAYS.ERROR + 100);
    }
  }, [login, setUser, showToast, navigateToHome, handleHapticFeedback]);

  const handleForgotPassword = useCallback(() => {
    handleHapticFeedback();
    // TODO: Implement forgot password navigation
    console.log('Navigate to forgot password');
  }, [handleHapticFeedback]);

  const handleSignUpNavigation = useCallback(() => {
    handleHapticFeedback();
    router.push('/sign-up');
  }, [handleHapticFeedback]);

  // =========  Computed values =========
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
          delay: ANIMATION_DELAYS.HEADER 
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
        extraScrollHeight={Platform.OS === "ios" ? 100 : 0}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ 
            opacity: isFocused ? 1 : 0, 
            translateY: isFocused ? 0 : 30 
          }}
          transition={{ type: 'timing', duration: 500 }}
          className="h-screen w-full justify-center px-8"
        >
          {/* Header */}
          <MotiView 
            from={{ opacity: 0, translateX: -50 }} 
            animate={{ opacity: 1, translateX: 0 }} 
            transition={{ 
              type: 'timing', 
              duration: 300, 
              delay: ANIMATION_DELAYS.HEADER 
            }} 
            className="flex-row items-center mb-8 gap-2"
          > 
            <Text className="text-white text-2xl font-bold">Sign In</Text> 
            <Ionicons name="arrow-forward" size={20} color="#fff" /> 
          </MotiView>

          {/* Form Container */}
          <BlurCard 
            tint="dark" 
            radius="xl" 
            placementRadius="all" 
            className="p-8 w-full"
          >
            <Formik<FormValues>
              initialValues={{ 
                email: __DEV__ ? 'student@university.edu' : '', 
                password: __DEV__ ? '123' : '' 
              }}
              validationSchema={signInSchema}
              onSubmit={handleSignIn}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  {/* Welcome Section */}
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ 
                      opacity: isFocused ? 1 : 0, 
                      scale: isFocused ? 1 : 0.9 
                    }} 
                    transition={{ 
                      type: 'timing', 
                      duration: 300, 
                      delay: ANIMATION_DELAYS.WELCOME 
                    }} 
                    className="w-full mb-6" 
                  > 
                    <Text className={`text-3xl font-bold text-center mb-1 ${primaryTextColor}`}>
                      Welcome Back
                    </Text> 
                    <Text className="text-zinc-400 text-center text-base"> 
                      Please sign in to your account
                    </Text> 
                  </MotiView>

                  {/* Form Fields */}
                  <View className="gap-4 mb-6">
                    {/* Email Input */}
                    <MotiView 
                      from={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ 
                        type: 'timing', 
                        duration: 300, 
                        delay: ANIMATION_DELAYS.EMAIL 
                      }} 
                    > 
                      <Input 
                        isRequired 
                        label="Email" 
                        placeholder="Enter your email" 
                        value={values.email} 
                        onChangeText={handleChange('email')} 
                        onBlur={handleBlur('email')} 
                        isInvalid={!!(touched.email && errors.email)} 
                        keyboardType="email-address" 
                        autoCapitalize="none"
                        autoComplete="email"
                        textContentType="emailAddress"
                        startContent={<Ionicons name="mail" size={22} color="#71717a" />} 
                        errorMessage={touched.email && errors.email ? errors.email : ''} 
                        isDisabled={submitting}
                        notDarkMode
                      /> 
                    </MotiView> 

                    {/* Password Input */}
                    <MotiView 
                      from={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ 
                        type: 'timing', 
                        duration: 300, 
                        delay: ANIMATION_DELAYS.PASSWORD 
                      }} 
                    > 
                      <InputPassword 
                        isRequired 
                        label="Password" 
                        placeholder="Enter your password" 
                        value={values.password} 
                        onChangeText={handleChange('password')} 
                        onBlur={handleBlur('password')} 
                        isInvalid={!!(touched.password && errors.password)} 
                        startContent={<Ionicons name="lock-closed" size={22} color="#71717a" />} 
                        errorMessage={touched.password && errors.password ? errors.password : ''} 
                        isDisabled={submitting}
                        autoComplete="current-password"
                        textContentType="password"
                      /> 
                    </MotiView>
                  </View>

                  {/* Options Row */}
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ 
                      opacity: isFocused ? 1 : 0, 
                      scale: isFocused ? 1 : 0.9 
                    }} 
                    transition={{ 
                      type: 'timing', 
                      duration: 300, 
                      delay: ANIMATION_DELAYS.OPTIONS 
                    }} 
                  > 
                    <View className="flex-row items-center justify-between mb-6"> 
                      <Checkbox 
                        isDisabled={submitting} 
                        label="Remember me" 
                        onChange={setRemember} 
                        radius="lg" 
                      /> 
                      <TouchableOpacity 
                        onPress={handleForgotPassword}
                        disabled={submitting}
                        activeOpacity={0.7}
                      > 
                        <Text className="text-base text-zinc-400">
                          Forgot Password?
                        </Text> 
                      </TouchableOpacity> 
                    </View> 
                  </MotiView> 

                  {/* Sign In Button */}
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ 
                      opacity: isFocused ? 1 : 0, 
                      scale: isFocused ? 1 : 0.9 
                    }} 
                    transition={{ 
                      type: 'timing', 
                      duration: 300, 
                      delay: ANIMATION_DELAYS.BUTTON 
                    }} 
                  > 
                    <Button 
                      label="Sign In" 
                      onPress={handleSubmit} 
                      isLoading={submitting} 
                      className="w-full" 
                      color="primary" 
                      startContent={<Ionicons name="log-in" size={24} color="#fff" />} 
                    /> 
                  </MotiView> 

                  {/* Sign Up Link */}
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ 
                      opacity: isFocused ? 1 : 0, 
                      scale: isFocused ? 1 : 0.9 
                    }} 
                    transition={{ 
                      type: 'timing', 
                      duration: 300, 
                      delay: ANIMATION_DELAYS.SIGNUP_LINK 
                    }} 
                  > 
                    <View className="flex-row justify-center mt-6"> 
                      <Text className="text-white/60 text-base">
                        Don't have an account?{' '}
                      </Text> 
                      <TouchableOpacity 
                        onPress={handleSignUpNavigation}
                        disabled={submitting}
                        activeOpacity={0.7}
                      > 
                        <Text className={`text-base ${primaryTextColor}`}>
                          Sign Up
                        </Text> 
                      </TouchableOpacity> 
                    </View> 
                  </MotiView>
                </>
              )}
            </Formik>
          </BlurCard>
        </MotiView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;