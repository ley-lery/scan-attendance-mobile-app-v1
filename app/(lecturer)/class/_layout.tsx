import { Stack } from 'expo-router'
import React from 'react'

const ClassLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="student-class/[id]" options={{headerShown: false}} />
    </Stack>
  )
}

export default ClassLayout
