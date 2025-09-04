import { Stack } from 'expo-router'
import React from 'react'

const ProfileLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false, animation: 'fade_from_bottom'}} />
    </Stack>
  )
}

export default ProfileLayout
