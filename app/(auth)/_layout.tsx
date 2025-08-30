import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet } from 'react-native'

const AuthLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <StatusBar style="light"/>
    </Stack>
  )
}

export default AuthLayout

const styles = StyleSheet.create({})