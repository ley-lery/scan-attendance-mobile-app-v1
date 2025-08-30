import { Button, Icon, Input, Text, Typography, useHaptic, useToast } from '@/godui'
import { useThemeStore } from '@/stores/useThemeStore'
import { Ionicons } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, SafeAreaView, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const ADMIN_EMAIL = "admin@school.edu"
const ADMIN_PHONE = "+1234567890"

const Contact = () => {
    const { t } = useTranslation();
    const { trigger } = useHaptic()
    const { show } = useToast();
    const [message, setMessage] = useState<string>('')
    const [isSending, setIsSending] = useState<boolean>(false)
    const [isInvalid, setIsInvalid] = useState<boolean>(false)

    const isFocused = useIsFocused();

    const theme = useThemeStore((state) => state.theme);

    const handleSend = async () => {
        trigger(Haptics.ImpactFeedbackStyle.Light)
        if (!message.trim()) {
            setIsInvalid(true)
            return;
        };
        setIsSending(true)
        // Simulate sending
        setTimeout(() => {
            setIsSending(false)
            setMessage('')
            show({
                title: t("messageSent"),
                message: t("adminContactYou"),
                type: "success",
            })
            trigger(Haptics.ImpactFeedbackStyle.Light)
        }, 1200)
    }
    const handleChange = (text: string) => {
        setMessage(text)
        setIsInvalid(false)
    }

    const handleEmail = () => {
        Linking.openURL(`mailto:${ADMIN_EMAIL}`)
    }

    const handleCall = () => {
        Linking.openURL(`tel:${ADMIN_PHONE}`)
    }

    return (
    <>
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <MotiView
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
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
                    <View className="items-center mb-8 gap-2">
                        <Icon name="chatbubbles-outline" size={48} />
                        <Typography variant='h2'>Contact Admin</Typography>
                    <Text className="text-zinc-500 dark:text-zinc-400 text-center mt-2 text-base">
                        {t("desc.contactAdmin")}
                    </Text>
                    </View>

                    <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-5 mb-6 gap-4">
                        <Input
                            label={t("sendAMessage")}
                            placeholder={t("describeProblem")}
                            value={message}
                            onChangeText={handleChange}
                            editable={!isSending}
                            multiline
                            classNames={{ input: "min-h-[80px] max-h-[120px] mb-3", buttonClear: 'absolute right-2 top-2' }}
                            isInvalid={isInvalid}
                            errorMessage={t("validation.required")}
                            isRequired
                            isClearable
                        />
                        <Button
                            label={isSending ? t("sending") : t("send")}
                            onPress={handleSend}
                            isLoading={isSending}
                            color="primary"
                            size='lg'
                            radius='lg'
                            
                        />
                    </View>

                    <View className="dark:bg-zinc-900 bg-zinc-100 rounded-2xl p-5">
                        <Text className="text-zinc-500 dark:text-zinc-400 font-semibold mb-3">Other ways to contact</Text>
                        <View className="flex flex-col gap-2 mt-3">
                            <TouchableOpacity
                                className="flex-row items-center gap-3 px-4 py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800"
                                onPress={handleEmail}
                            >
                                <Ionicons name="mail-outline" size={22} color="#38bdf8" />
                                <Text className="text-zinc-700 dark:text-zinc-400 text-base">{ADMIN_EMAIL}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center gap-3 px-4 py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800"
                                onPress={handleCall}
                            >
                                <Ionicons name="call-outline" size={22} color="#4ade80" />
                                <Text className="text-zinc-700 dark:text-zinc-400 text-base">{ADMIN_PHONE}</Text>
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
