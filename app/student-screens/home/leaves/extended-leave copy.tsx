import { Button, DatePicker, Icon, Input, Picker, Text, useToast } from "@/godui";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import moment from "moment";
import { MotiView, SafeAreaView } from "moti";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from 'yup';

const initialValues = {
  leaveType: '',
  startDate: new Date(),
  endDate: new Date(),
  numberOfDays: 1,
  reason: '',
}

const leaveTypes = [
  { label: 'Sick Leave', value: 'sick' },
  { label: 'Personal Leave', value: 'personal' },
  { label: 'Vacation Leave', value: 'vacation' },
  { label: 'Maternity Leave', value: 'maternity' },
  { label: 'Paternity Leave', value: 'paternity' },
  { label: 'Sabbatical Leave', value: 'sabbatical' },
  { label: 'Other Leave', value: 'other' },
]

const statusColor = (status: string) => {
  switch (status) {
    case 'Approved':
      return 'text-success';
    case 'Pending':
      return 'text-warning';
    case 'Rejected':
      return 'text-danger';
    default:
      return 'text-zinc-400';
  }
};

function calculateNumberOfDays(startDate: Date, endDate: Date) {
  // Ensure time is set to midnight for both dates to avoid partial day issues
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  const diff = end.getTime() - start.getTime();
  // If end < start, return 1 (minimum)
  if (diff < 0) return 1;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

const ExtendedLeave = () => {
  const { t } = useTranslation()
  const { show } = useToast()
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [canceling, setCanceling] = useState<boolean>(false);

  const formDataSchema = Yup.object().shape({
    leaveType: Yup.string().required(t('validation.required')),
    startDate: Yup.date().required(t('validation.required')),
    endDate: Yup.date().required(t('validation.required')),
    numberOfDays: Yup.number().required(t('validation.required')).min(1, t('validation.min')),
    reason: Yup.string().required(t('validation.required')),
  })
  

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      setTimeout(() => {
        setSubmitting(false);
        show({
          title: 'Leave Request',
          message: 'Leave request submitted successfully',
          type: 'success',
        })
        const payload = {
          leaveType: values.leaveType,
          startDate: moment(values.startDate).format('YYYY-MM-DD'),
          endDate: moment(values.endDate).format('YYYY-MM-DD'),
          numberOfDays: values.numberOfDays,
          reason: values.reason,
        }
        setSubmittedData(payload);
        setSuccess(true)
      }, 1200);
    } catch (error) {
      show({
        title: 'Error',
        message: 'Leave request failed',
        type: 'error',
      })
    }
  };
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  
  const scrollToInput = (reactNode:any)=>{
    if (reactNode) {
      scrollRef.current?.scrollToFocusedInput(reactNode);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-100 dark:bg-zinc-900">
      <KeyboardAwareScrollView
        ref={scrollRef}
        extraScrollHeight={0}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingTop: 60 }}
      >
        {/* =========== Form Section =========== */}
        <MotiView
          from={{ opacity: 0, scale: 1 }}
          animate={{opacity: success ? 0 : 1,scale: success ? 0 : 1}}
          transition={{type: "timing", duration: 400}}
          pointerEvents={success ? "none" : "auto"}
          className="h-screen justify-center p-4"
        >
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
            className="mx-4 p-4 rounded-2xl bg-white dark:bg-zinc-800"
          >
            <View className="flex-row items-center mb-2">
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === "web") window.history.back();
                  else if (typeof require !== "undefined") {
                    const { router } = require("expo-router");
                    router.back();
                  }
                }}
                className="bg-zinc-100 dark:bg-black p-3 rounded-md mr-3 shadow-lg dark:shadow-black"
                
              >
                <Icon name="chevron-back" size={20} />
              </TouchableOpacity>
              <Text className="text-lg font-bold dark:text-zinc-200 text-zinc-900">{t('extendedLeaveReq')}</Text>
            </View>
            <Text className="text-zinc-500 dark:text-zinc-400 mb-2 text-base">
              {t('desc.extendedLeaveDesc')}
            </Text>
            <View className="gap-2">
              <Text className="text-zinc-500 dark:text-zinc-400 text-base">
                <Text className="font-medium dark:text-zinc-200 text-zinc-900">{t('note')} : </Text> 
                {t('desc.extendedLeaveNote')}
              </Text>
            </View>
          </MotiView>

          <MotiView from={{ opacity: 0, translateY: -30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 400 }} className="p-4 gap-2">
            <Formik
              initialValues={initialValues}
              validationSchema={formDataSchema}
              onSubmit={onSubmit}
            >
              {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => {
                // Auto-calculate numberOfDays when startDate or endDate changes
                React.useEffect(() => {
                  const days = calculateNumberOfDays(values.startDate, values.endDate);
                  if (values.numberOfDays !== days) {
                    setFieldValue('numberOfDays', days, false);
                  }
                  // eslint-disable-next-line
                }, [values.startDate, values.endDate]);
                return (
                  <>
                    <Picker
                      label={t('leaveType')}
                      isRequired
                      variant="solid"
                      startContent={<Icon name="book" size={20} color="#a1a1aa" />}
                      placeholder={t('selectLeaveType')}
                      onChange={(value) => setFieldValue('leaveType', value)}
                      options={leaveTypes}
                      value={values.leaveType}
                      errorMessage={touched.leaveType && errors.leaveType ? errors.leaveType : ''}
                      isInvalid={!!(touched.leaveType && errors.leaveType)}
                    />
                    <DatePicker 
                      isRequired 
                      label={t('startDate')} 
                      placeholder={t('selectDate')} 
                      value={values.startDate} 
                      onChange={(e, d) => d && setFieldValue('startDate', d)}
                      minimumDate={new Date()} 
                      startContent={<Icon name="calendar" size={20} color="#a1a1aa" />}
                      errorMessage={touched.startDate ? (errors.startDate as string) : ''}
                      isInvalid={!!(touched.startDate && errors.startDate)} 
                    />
                    <DatePicker 
                      isRequired 
                      label={t('endDate')} 
                      placeholder={t('selectDate')} 
                      value={values.endDate} 
                      onChange={(e, d) => d && setFieldValue('endDate', d)} 
                      minimumDate={values.startDate} 
                      startContent={<Icon name="calendar" size={20} color="#a1a1aa" />} 
                      errorMessage={touched.endDate ? (errors.endDate as string) : ''}
                      isInvalid={!!(touched.endDate && errors.endDate)} 
                    />
                    <Input 
                      size="lg" 
                      isRequired 
                      label={t('numberOfDays')} 
                      value={values.numberOfDays.toString()} 
                      keyboardType="numeric" 
                      isReadOnly 
                      classNames={{input: 'text-center'}} 
                      isClearable={false} 
                      errorMessage={touched.numberOfDays ? (errors.numberOfDays as string) : ''}
                      isInvalid={!!(touched.numberOfDays && errors.numberOfDays)} 
                      onFocus={(event) => {
                        scrollToInput(event.target);
                      }}
                    />
                    <Input 
                      isRequired 
                      label={t('reason')} 
                      placeholder={t('enterReason')} 
                      value={values.reason} 
                      onChangeText={handleChange('reason')} 
                      multiline 
                      numberOfLines={3} 
                      classNames={{input: 'min-h-20', buttonClear: 'absolute right-2 top-2'}} 
                      errorMessage={touched.reason && errors.reason ? errors.reason : ''}
                      isInvalid={!!(touched.reason && errors.reason)}
                      onFocus={(event) => {
                        scrollToInput(event.target);
                      }}
                    />
                    <Button 
                      label={t('submit')} 
                      onPress={handleSubmit} 
                      isLoading={submitting} 
                      className="mt-2" 
                      color="primary" 
                    />
                  </>
                );
              }}
            </Formik>
          </MotiView>
        </MotiView>
        {/* =========== Success Detail Section =========== */}
        <MotiView
          from={{ opacity: 0, scale: success ? 1 : 0.8, translateY: success ? 0 : 40 }}
          animate={{
            opacity: success ? 1 : 0,
            scale: success ? 1 : 0.8,
            translateY: success ? 0 : 40,
          }}
          transition={{
            type: "timing",
            duration: 500,
            delay: success ? 400 : 0,
          }}
          pointerEvents={success ? "auto" : "none"}
          className="absolute left-0 right-0 top-0 bottom-0 flex-1 justify-center items-center px-4"
        >
          <View className="w-full max-w-md mx-auto bg-white dark:bg-zinc-800 rounded-2xl p-6 dark:shadow-xl dark:shadow-black items-center">
            <View className="bg-zinc-100 dark:bg-black rounded-xl p-4 mb-4 shadow dark:shadow-black" >
              <Icon name="checkmark-done" size={36} />
            </View>
            <Text className="text-2xl font-bold text-zinc-600 dark:text-zinc-200 mb-2">{t('leaveSubmitted')}</Text>
            <Text className="text-zinc-400 text-base mb-6 text-center">
              {t('leaveSubmittedMessage')}
            </Text>
            {submittedData && (
              <View className="w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl p-4 mb-4 gap-2">
                <View className="flex-row items-center">
                  <Icon name="document-text-outline" size={18} color="#a1a1aa" />
                  <Text className="ml-2 text-zinc-600 dark:text-zinc-200 font-semibold">{t('leaveType')}:</Text>
                  <Text className="ml-1 text-zinc-500 dark:text-zinc-200 capitalize">{submittedData.leaveType}</Text>
                </View>
                <View className="flex-row items-center">
                  <Icon name="calendar-outline" size={18} color="#a1a1aa" />
                  <Text className="ml-2 text-zinc-600 dark:text-zinc-200 font-semibold">{t('startDate')}:</Text>
                  <Text className="ml-1 text-zinc-500 dark:text-zinc-200">
                    {submittedData.startDate} - {submittedData.endDate}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="layers-outline" size={18} color="#a1a1aa" />
                  <Text className="ml-2 text-zinc-600 dark:text-zinc-200 font-semibold">{t('numberOfDays')}:</Text>
                  <Text className="ml-1 text-zinc-500 dark:text-zinc-200">{submittedData.numberOfDays} {t('days')}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={18} color="#a1a1aa" />
                  <Text className="ml-2 text-zinc-600 dark:text-zinc-200 font-semibold">{t('status')}:</Text>
                  <Text className={`font-normal text-xs ml-2 ${statusColor('Pending')}`}>{t('pending')}</Text>
                </View>
                <View className="flex-row items-start">
                  <Ionicons name="chatbox-ellipses-outline" size={18} color="#a1a1aa" style={{ marginTop: 2 }} />
                  <Text className="ml-2 text-zinc-600 dark:text-zinc-200 font-semibold">{t('reason')}:</Text>
                  <Text className="ml-1 text-zinc-500 dark:text-zinc-200 flex-1">{submittedData.reason}</Text>
                </View>
              </View>
            )}
            <View className="flex-row items-center gap-2">
              <Button
                startContent={<Icon name="arrow-back" size={18} color="#fff" />}
                color="foreground"
                onPress={() => {
                  if (Platform.OS === "web") window.history.back();
                  else if (typeof require !== "undefined") {
                    const { router } = require("expo-router");
                    router.back();
                  }
                }}
              />
              <Button
                label={t('cancelRequest')}
                onPress={() => {
                  setCanceling(true);
                  setTimeout(() => {
                    setCanceling(false);
                    setSubmittedData(null);
                    setSuccess(false);
                    show({
                      title: t('cancelRequest'),
                      message: t('leaveRequestCanceledMessage'),
                      type: 'success',
                    })
                  }, 1200);
                }}
                className="flex-1"
                color="danger"
                variant="flat"
                isLoading={canceling}
              />
            </View>
          </View>
        </MotiView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ExtendedLeave;
