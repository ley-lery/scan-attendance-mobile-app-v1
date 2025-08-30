import { Stack } from 'expo-router'
import React from 'react'

const HistoryLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
  )
}

export default HistoryLayout
