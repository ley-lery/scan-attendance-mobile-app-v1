import { IMG } from '@/constants/Image'
import { BlurCard, Button, Input, InputPassword } from '@/godui'
import { useThemeStore } from '@/stores/useThemeStore'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Formik } from 'formik'
import { MotiView } from 'moti'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import * as Yup from 'yup'
// Validation schema
const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  username: Yup.string().required('Username is required'),
});

const SignUp = () => {
  const theme = useThemeStore((state) => state.theme);  
  const isFocused = useIsFocused();
  const handleSignUp = (values: any) => {
    console.log('Sign up with:', values);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style='light'/>
      <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : -50 }}
          transition={{ type: 'timing', duration: 600, delay: 400 }}
          className="w-full h-full absolute top-0 left-0"
        >
          <Image source={theme === "1" ? IMG.BGL : IMG.BGBA} resizeMode="cover" />
      </MotiView>

      <View className="flex-1 items-center justify-center z-10 relative px-6">
        {/* Card with animation */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : 50 }}
          transition={{ type: 'timing', duration: 600 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateX: -100 }}
            animate={{ opacity: isFocused ? 1 : 0, translateX: isFocused ? 0 : -100 }}
            transition={{ type: 'timing', duration: 600, delay: 400 }}
          >
              <TouchableOpacity onPress={()=> router.back()} className="mr-2">
                <View className="flex-row items-center mb-8">
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                  <Text className="text-white text-2xl font-bold">Sign Up</Text>
                </View>
              </TouchableOpacity>
          </MotiView>

          <BlurCard tint="dark" radius='xl'>
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
              transition={{ delay: 100, type: 'timing', duration: 500 }}
              className='flex items-center'
            >
            <Text className={[theme === "1" ? "text-theme1-primary" : "text-theme2-primary", "text-3xl font-bold text-center mb-1"].join(" ")}>Create Account</Text>
            <Text className="text-zinc-400 text-center mb-5 text-base max-w-72">Please enter your details to create an account.</Text>
            </MotiView>
            <Formik
              initialValues={{ email: '', password: '', username: '' }}
              validationSchema={SignUpSchema}
              onSubmit={handleSignUp}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                  {/* Animated Inputs */}
                  <View className='my-4 gap-2'>
                    <MotiView
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                      transition={{ delay: 100, type: 'timing', duration: 500 }}
                    >
                      <Input
                        isRequired
                        label="Username"
                        placeholder="Enter your username"
                        value={values.username}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        autoCapitalize="none"
                        startContent={<Ionicons name="person" size={20} color="#71717a" />}
                        isInvalid={!!(touched.username && errors.username)}
                        errorMessage={touched.username && errors.username ? errors.username : ''}
                        notDarkMode
                      />
                    </MotiView>

                    <MotiView
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                      transition={{ delay: 200, type: 'timing', duration: 500 }}
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
                        startContent={<Ionicons name="mail" size={22} color="#71717a" />}
                        isInvalid={!!(touched.email && errors.email)}
                        errorMessage={touched.email && errors.email ? errors.email : ''}
                        notDarkMode
                      />
                    </MotiView>

                    <MotiView
                      from={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                      transition={{ delay: 300, type: 'timing', duration: 500 }}
                    >
                      <InputPassword
                        isRequired
                        label="Password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        secureTextEntry
                        startContent={<Ionicons name="lock-closed" size={22} color="#71717a" />}
                        isInvalid={!!(touched.password && errors.password)}
                        errorMessage={touched.password && errors.password ? errors.password : ''}
                      />
                    </MotiView>
                  </View>

                  {/* Sign Up Button with animation */}
                  <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
                    transition={{ delay: 400, type: 'timing', duration: 500 }}
                  >
                    <Button
                      label="Sign Up"
                      onPress={handleSubmit}
                      className="w-full"
                      color='primary'
                      startContent={<Ionicons name="log-in" size={24} color="#fff" />}
                    />
                  </MotiView>
                </>
              )}
            </Formik>

            {/* Sign In Link */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
              transition={{ delay: 500, type: 'timing', duration: 500 }}
            >
              <View className="flex-row justify-center mt-4 ">
                <Text className="text-white/60 text-base">Already have an account? </Text>
                <TouchableOpacity onPress={()=> router.back()}>
                  <Text className={[theme === "1" ? "text-theme1-primary" : "text-theme2-primary", "text-base"].join(" ")}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          </BlurCard>
        </MotiView>
      </View>
    </View>
  )
}

export default SignUp
