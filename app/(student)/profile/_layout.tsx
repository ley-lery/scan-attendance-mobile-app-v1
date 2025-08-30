import { Stack } from 'expo-router'
import React from 'react'

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="contact" options={{headerShown: false}} />
      <Stack.Screen name="faq" options={{headerShown: false}} />
    </Stack>
  )
}

export default ProfileLayout
