import { IMG } from '@/constants/Image';
import { BlurCard, Button, Checkbox, Input, InputPassword, useAuth, useToast } from '@/godui';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

const userFixed = {
  id: 1,
  user_code: "SR112233",
  avatar: "https://i.pravatar.cc/400?img=68",
  name: "Ley Lery",
  email: "leryley8@gmail.com",
  phone: "0123456789",
  room: "Room 101",
  year: 4,
  semester: 1,
  major: "Computer Science",
  is_scanned: 0,
};

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(1, 'Password must be at least 1 characters').required('Password is required'),
});

const SignIn = () => {
  
  const { show } = useToast();
  const { login } = useAuth();
  const theme = useThemeStore((state) => state.theme);
  const isFocused = useIsFocused();
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const setUser = useUserStore((state) => state.setusers);

  const handleSignIn = async (values: any) => {
    try {
      setSubmitting(true);
      const response: any = await login(values.email, values.password);
      console.log(JSON.stringify(response, null, 2), "response");

      if (response.success) {
        setTimeout(() => {
          show({ type: 'success', title: 'Signed in', message: 'Welcome back!', position: 'top', duration: 500 });
          setSubmitting(false);
          setUser(response.user);
        }, 500);

        setTimeout(() => {
          router.replace('../(student)/home');
        }, 1000);
      } else {
        setTimeout(() => {
          show({ type: 'error', title: 'Sign in failed', message: response.error, position: 'top', duration: 2500 });
          setSubmitting(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style='light'/>
      <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : -50 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          className="w-full h-full absolute top-0 left-0"
        >
          <Image source={theme === "1" ? IMG.BGL : IMG.BGBA} resizeMode="cover" />
      </MotiView>
      <KeyboardAwareScrollView
        extraScrollHeight={Platform.OS === "ios" ? 100 : 0}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 30 }}
          transition={{ type: 'timing', duration: 500 }}
          className="h-screen w-full justify-center px-8"
        >
          {/* Header */}
          <MotiView 
            from={{ opacity: 0, translateX: -50 }} 
            animate={{ opacity: 1, translateX: 0 }} 
            transition={{ type: 'timing', duration: 300, delay: 400 }} 
            className="flex-row items-center mb-8 gap-2"
          > 
            <Text className="text-white text-2xl font-bold">Sign In</Text> 
            <Ionicons name="arrow-forward" size={20} color="#fff" /> 
          </MotiView>

          <BlurCard tint="dark" radius="xl" placementRadius="all" className="p-8 min-w-full">
            <Formik
              initialValues={{ email: 'student@university.edu', password: '123' }}
              validationSchema={SignInSchema}
              onSubmit={handleSignIn}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                 <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }} 
                    transition={{ type: 'timing', duration: 300 }} 
                    className="w-full max-w-md" 
                  > 
                  <Text className={["text-3xl font-bold text-center mb-1", theme === "1" ? "text-theme1-primary" : "text-theme2-primary"].join(" ")}>Welcome Back</Text> 
                  <Text className="text-zinc-400 text-center mb-5 text-base"> Please sign in to your account. </Text> 
                 </MotiView>

                  <View className="my-4 gap-4">
                    <MotiView 
                      from={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ type: 'timing', duration: 300, delay: 100 }} 
                      className="w-full max-w-md" 
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
                        startContent={<Ionicons name="mail" size={22} color="#71717a" />} 
                        errorMessage={touched.email && errors.email ? errors.email : ''} 
                        isDisabled={submitting}
                        notDarkMode
                      /> 
                    </MotiView> 
                    <MotiView 
                      from={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ type: 'timing', duration: 300, delay: 200 }} 
                      className="w-full max-w-md" 
                    > 
                      <InputPassword isRequired label="Password" placeholder="Enter your password" value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')} isInvalid={!!(touched.password && errors.password)} startContent={<Ionicons name="lock-closed" size={22} color="#71717a" />} errorMessage={touched.password && errors.password ? errors.password : ''} isDisabled={submitting} /> 
                    </MotiView>
                  </View>

                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }} 
                    transition={{ type: 'timing', duration: 300, delay: 300 }} 
                    className="w-full max-w-md" 
                  > 
                    <View className="flex-row items-center justify-between mb-4"> 
                      <Checkbox isDisabled={submitting} label="Remember me" onChange={setRemember} radius="lg" /> 
                      <TouchableOpacity> 
                        <Text className={"text-base text-zinc-400"}>Forgot Password?</Text> 
                      </TouchableOpacity> 
                    </View> 
                  </MotiView> 
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }} 
                    transition={{ type: 'timing', duration: 300, delay: 400 }} 
                    className="w-full max-w-md" 
                  > 
                    <Button label="Sign In" onPress={handleSubmit as any} isLoading={submitting} className="w-full" color="primary" startContent={<Ionicons name="log-in" size={24} color="#fff" />} /> 
                  </MotiView> 
                  <MotiView 
                    from={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }} 
                    transition={{ type: 'timing', duration: 300, delay: 500 }} 
                    className="w-full max-w-md" 
                  > 
                    <View className="flex-row justify-center mt-4"> 
                      <Text className="text-white/60 text-base">Don't have an account? </Text> 
                      <TouchableOpacity onPress={() => router.push('/sign-up')}> 
                        <Text className={["text-base", theme === "1" ? "text-theme1-primary" : "text-theme2-primary"].join(" ")}>Sign Up</Text> 
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
