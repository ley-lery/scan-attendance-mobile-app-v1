import { IMG } from '@/constants/Image'
import { Button, Alert as CustomAlert, useDisclosure } from '@/godui'
import { useThemeStore } from '@/stores/useThemeStore'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Image, Linking, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ADMIN_EMAIL = "admin@school.edu"
const ADMIN_PHONE = "+1234567890"

const Contact = () => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isFocused = useIsFocused();

    const theme = useThemeStore((state) => state.theme);

    const handleSend = async () => {
        if (!message.trim()) {
            onOpen()
            return;
        };
        setIsSending(true)
        // Simulate sending
        setTimeout(() => {
        setIsSending(false)
        setMessage('')
            Alert.alert(t("messageSent"), t("adminContactYou"))
        }, 1200)
    }

    const handleEmail = () => {
        Linking.openURL(`mailto:${ADMIN_EMAIL}`)
    }

    const handleCall = () => {
        Linking.openURL(`tel:${ADMIN_PHONE}`)
    }

    return (
    <>
        <CustomAlert
            visible={isOpen}
            title={t("message")}
            message={t("sendingMessage")}
            onConfirm={onClose}
            confirmText={t("ok")}
        />
        <SafeAreaView className="flex-1 bg-black">
            <MotiView
                from={{ opacity: 0, translateX: -50 }}
                animate={{ opacity: isFocused ? 1 : 0, translateX: isFocused ? 0 : -50 }}
                transition={{ type: 'timing', duration: 600, delay: 400 }}
                className="absolute top-8 left-0 z-10"
            >
                <Button
                    label={t("back")}
                    onPress={() => router.back()}
                    color="primary"
                    size='lg'
                    variant='light'
                    startContent={<Ionicons name="arrow-back" size={22} color={theme === "1" ? "#db2777" : "#006FEE"} />}
                />
            </MotiView>
            <MotiView
                from={{ opacity: 0, translateY: -50 }}
                animate={{ opacity: isFocused ? 1 : 0, translateY: isFocused ? 0 : -50 }}
                transition={{ type: 'timing', duration: 600, delay: 400 }}
                className="w-full h-full absolute top-0 left-0"
            >
                <Image source={theme === "1" ? IMG.BGP : IMG.BGBP} resizeMode="cover" />
            </MotiView>
            <KeyboardAwareScrollView
                extraScrollHeight={100}
                enableOnAndroid={true}
                showsVerticalScrollIndicator={false}
            >
                <MotiView
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 600 }}
                    className="flex-1 justify-center h-screen px-4"
                >
                    <View className="items-center mb-8">
                    <Ionicons name="chatbubbles-outline" size={48} color="#F31260" />
                    <Text className="text-2xl font-bold text-white mt-4">Contact Admin</Text>
                    <Text className="text-zinc-400 text-center mt-2">
                        {t("desc.contactAdmin")}
                    </Text>
                    </View>

                    <View className="bg-zinc-900 rounded-2xl p-5 mb-6">
                        <View className="flex-row gap-1">
                            <Text className="text-zinc-300 font-semibold mb-2">Send a Message</Text>
                            <Text className="text-pink-600 text-base">*</Text>
                        </View>
                        <TextInput
                            className="bg-zinc-800 rounded-xl text-white px-4 py-3 min-h-[80px] max-h-[120px] mb-3"
                            placeholder={t("describeProblem")}
                            placeholderTextColor="#a1a1aa"
                            multiline
                            value={message}
                            onChangeText={setMessage}
                            editable={!isSending}
                        />
                        <Button
                            label={isSending ? t("sending") : t("send")}
                            onPress={handleSend}
                            isLoading={isSending}
                            color="primary"
                            className="mt-1"
                            size='lg'
                            radius='lg'
                        />
                    </View>

                    <View className="bg-zinc-900 rounded-2xl p-5">
                        <Text className="text-zinc-400 font-semibold mb-3">Other ways to contact</Text>
                        <View className="flex flex-col gap-2 mt-3">
                            <TouchableOpacity
                                className="flex-row items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800"
                                onPress={handleEmail}
                            >
                                <Ionicons name="mail-outline" size={22} color="#38bdf8" />
                                <Text className="text-zinc-200 text-base">{ADMIN_EMAIL}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800"
                                onPress={handleCall}
                            >
                                <Ionicons name="call-outline" size={22} color="#4ade80" />
                                <Text className="text-zinc-200 text-base">{ADMIN_PHONE}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </MotiView>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    </>
  )
}

export default Contact
