import { Stack } from 'expo-router'
import React from 'react'

const LeaveLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="leave" options={{headerShown: false}} />
      <Stack.Screen name="extended-leave" options={{headerShown: false}} />
      <Stack.Screen name="leave-history" options={{headerShown: false}} />
      <Stack.Screen name="class" options={{headerShown: false}} />
    </Stack>
  )
}

export default LeaveLayout
