import { Button, DatePicker, Icon, Input, Picker, Text, useHaptic, useToast } from "@/godui";
import soundManager from "@/utils/soundManager";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Formik } from "formik";
import moment from "moment";
import { MotiView, SafeAreaView } from "moti";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Platform, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from 'yup';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SOUND_CONFIG = {
  success: {
      file: require("../../assets/sounds/success-chime.mp3"),
      volume: 0.8,
      description: "Success chime for leave request submitted"
  },
  failed: {
      file: require("../../assets/sounds/error-beep.mp3"),
      volume: 0.5,
      description: "Error buzz for failed submissions"
  },
};

const initialValues = {
  leaveType: '',
  startDate: new Date(),
  endDate: new Date(),
  numberOfDays: 1,
  reason: '',
};

const leaveTypes = [
  { label: 'Sick Leave', value: 'sick' },
  { label: 'Personal Leave', value: 'personal' },
  { label: 'Vacation Leave', value: 'vacation' },
  { label: 'Maternity Leave', value: 'maternity' },
  { label: 'Paternity Leave', value: 'paternity' },
  { label: 'Sabbatical Leave', value: 'sabbatical' },
  { label: 'Other Leave', value: 'other' },
];

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

const getLeaveTypeLabel = (value: string) => {
  const found = leaveTypes.find(s => s.value === value);
  return found ? found.label : value;
};

function calculateNumberOfDays(startDate: Date, endDate: Date) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0,0,0,0);
  end.setHours(0,0,0,0);
  const diff = end.getTime() - start.getTime();
  if (diff < 0) return 1;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

function calculateBusinessDays(startDate: Date, endDate: Date) {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

const ExtendedLeave = () => {
  const { t } = useTranslation();
  const { trigger } = useHaptic();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [canceling, setCanceling] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);


  
  // Scroll and focus management
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const formikRef = useRef<any>(null);


  const formDataSchema = Yup.object().shape({
    leaveType: Yup.string().required(t('validation.required')),
    startDate: Yup.date().min(new Date(new Date().setHours(0,0,0,0)), t('validation.futureDate')).required(t('validation.required')),
    endDate: Yup.date().min(Yup.ref('startDate'), t('validation.endAfterStart')).required(t('validation.required')),
    numberOfDays: Yup.number().required(t('validation.required')).min(1, t('validation.min')).max(365, t('validation.maxDays')),
    reason: Yup.string().min(5, t('validation.minLength', { count: 5 })).required(t('validation.required')),
  });

  const onSubmit = async (values: any, { setSubmitting: setFormikSubmitting }: any) => {
    setSubmitting(true);
    
    trigger(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const businessDays = calculateBusinessDays(values.startDate, values.endDate);
      
      const payload = {
        leaveType: values.leaveType,
        startDate: moment(values.startDate).format('YYYY-MM-DD'),
        endDate: moment(values.endDate).format('YYYY-MM-DD'),
        numberOfDays: values.numberOfDays,
        businessDays,
        reason: values.reason,
        submittedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        id: Math.random().toString(36).substr(2, 9),
      };
      
      setSubmittedData(payload);
      setSuccess(true);
      setSubmitting(false);
      setFormikSubmitting(false);
      
      // Success feedback
      setTimeout(() => {
        soundManager.play('success');
        setIsSuccess(true);
      }, 600);
      trigger(Haptics.ImpactFeedbackStyle.Heavy);
      
      show({ title: t('leaveRequest'), message: t('extendedLeaveSubmittedMessage'), type: 'success' });
      
    } catch (error) {
      setSubmitting(false);
      setFormikSubmitting(false);
      
      // Error feedback
      soundManager.play('failed');
      trigger(Haptics.ImpactFeedbackStyle.Heavy);
      
      show({ title: t('error'), message: t('leaveRequestFailed'), type: 'error' });
    }
  };

  const scrollToInput = (reactNode: any) => {
    if (reactNode) {
      scrollRef.current?.scrollToFocusedInput(reactNode);
    }
  };

  const handleGoBack = () => {
    trigger(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "web") {
      window.history.back();
    } else if (typeof require !== "undefined") {
      const { router } = require("expo-router");
      router.back();
    }
  };

  const handleCancelRequest = () => {
    setCanceling(true);
    trigger(Haptics.ImpactFeedbackStyle.Medium);
    
    setTimeout(() => {
      setCanceling(false);
      setSubmittedData(null);
      setSuccess(false);
      
      trigger(Haptics.ImpactFeedbackStyle.Light);
      show({ title: t('cancelRequest'), message: t('leaveRequestCanceledMessage'), type: 'success' });
    }, 1200);
  };

  const resetForm = () => {
    setSuccess(false);
    setSubmittedData(null);
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-100 dark:bg-zinc-900">
      <KeyboardAwareScrollView
        ref={scrollRef}
        extraScrollHeight={Platform.OS === "ios" ? 100 : 0}
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingTop: 60 }}
      >
        <View className="flex-1 min-h-screen">
          {/* =========== Enhanced Form Section =========== */}
          <MotiView
            from={{ opacity: 0, scale: 1, translateX: 0 }}
            animate={{ opacity: success ? 0 : 1, scale: success ? 0.95 : 1, translateX: success ? -SCREEN_WIDTH * 0.1 : 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 150 }}
            pointerEvents={success ? "none" : "auto"}
            style={{ flex: 1 }}
            className="justify-center p-4"
          >
            {/* Enhanced Header Section */}
            <MotiView
              from={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 200, delay: 100 }}
              className="mx-4 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg shadow-zinc-200 dark:shadow-black/50"
            >
              <View className="flex-row items-start mb-4">
                <TouchableOpacity
                  onPress={handleGoBack}
                  className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg mr-4 dark:shadow-lg dark:shadow-black/60"
                  activeOpacity={0.7}
                >
                  <Icon name="chevron-back" size={20} />
                </TouchableOpacity>
                <View className="flex-1">
                  <Text className="text-lg font-bold dark:text-zinc-100 text-zinc-800">
                    {t('extendedLeaveReq')}
                  </Text>
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    {t('multiDayLeaveRequest')}
                  </Text>
                </View>
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

            {/* Enhanced Form */}
            <MotiView 
              from={{ opacity: 0, translateY: 30 }} 
              animate={{ opacity: 1, translateY: 0 }} 
              transition={{ type: "spring", damping: 20, stiffness: 150, delay: 200 }} 
              className="p-4"
            >
              <Formik ref={formikRef} initialValues={initialValues} validationSchema={formDataSchema} onSubmit={onSubmit} validateOnChange={true} validateOnBlur={true}>
                {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => {
                  // Auto-calculate numberOfDays when dates change
                  React.useEffect(() => {
                    const days = calculateNumberOfDays(values.startDate, values.endDate);
                    if (values.numberOfDays !== days) {
                      setFieldValue('numberOfDays', days, false);
                    }
                  }, [values.startDate, values.endDate, setFieldValue]);

                  return (
                    <View className="gap-4">
                        <Picker
                          label={t('leaveType')}
                          isRequired
                          variant="solid"
                          size="md"
                          startContent={<Icon name="document-text" size={20} color="#a1a1aa" />}
                          placeholder={t('selectLeaveType')}
                          onChange={(value) => {
                            setFieldValue('leaveType', value);
                            trigger();
                          }}
                          options={leaveTypes}
                          value={values.leaveType}
                          errorMessage={touched.leaveType && errors.leaveType ? errors.leaveType : ''}
                          isInvalid={!!(touched.leaveType && errors.leaveType)}
                        />

                      {/* Date Range Section */}
                      <View className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <Text className="text-base font-semibold text-zinc-700 dark:text-zinc-200 mb-4">
                          {t('dateRange')}
                        </Text>
                        
                        <View className="gap-4">
                          {/* Start Date */}
                          <DatePicker 
                              isRequired 
                              label={t('startDate')} 
                              placeholder={t('selectDate')} 
                              value={values.startDate} 
                              onChange={(e, d) => {
                                if (d) {
                                  setFieldValue('startDate', d);
                                  // Auto-adjust end date if it's before start date
                                  if (values.endDate < d) {
                                    setFieldValue('endDate', d);
                                  }
                                  trigger();
                                }
                              }}
                              minimumDate={new Date()} 
                              startContent={<Icon name="calendar" size={20} color="#a1a1aa" />}
                              errorMessage={touched.startDate ? (errors.startDate as string) : ''}
                              isInvalid={!!(touched.startDate && errors.startDate)} 
                            />

                          {/* End Date */}
                          <DatePicker 
                              isRequired 
                              label={t('endDate')} 
                              placeholder={t('selectDate')} 
                              value={values.endDate} 
                              onChange={(e, d) => {
                                if (d) {
                                  setFieldValue('endDate', d);
                                  trigger();
                                }
                              }} 
                              minimumDate={values.startDate} 
                              startContent={<Icon name="calendar" size={20} color="#a1a1aa" />} 
                              errorMessage={touched.endDate ? (errors.endDate as string) : ''}
                              isInvalid={!!(touched.endDate && errors.endDate)} 
                            />

                          {/* Days Summary */}
                          <View
                            className="flex-row gap-3"
                          >
                            <View className="flex-1">
                              <Input 
                                size="md" 
                                isRequired 
                                label={t('totalDays')} 
                                value={values.numberOfDays.toString()} 
                                keyboardType="numeric" 
                                isReadOnly 
                                classNames={{input: 'text-center font-bold text-lg'}} 
                                isClearable={false} 
                                startContent={<Icon name="calendar" size={18} color="#a1a1aa" />}
                                errorMessage={touched.numberOfDays ? (errors.numberOfDays as string) : ''}
                                isInvalid={!!(touched.numberOfDays && errors.numberOfDays)} 
                              />
                            </View>
                            <View className="flex-1">
                              <Input 
                                size="md" 
                                isRequired 
                                label={t('businessDays')} 
                                value={calculateBusinessDays(values.startDate, values.endDate).toString()} 
                                keyboardType="numeric" 
                                isReadOnly 
                                classNames={{input: 'text-center font-bold text-lg'}} 
                                isClearable={false} 
                                errorMessage={touched.numberOfDays ? (errors.numberOfDays as string) : ''}
                                isInvalid={!!(touched.numberOfDays && errors.numberOfDays)} 
                              />
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Reason Input */}
                        <Input 
                          isRequired 
                          label={t('reason')} 
                          placeholder={t('placeholder.enterDetailedReason')} 
                          value={values.reason} 
                          onChangeText={handleChange('reason')} 
                          multiline 
                          numberOfLines={4} 
                          classNames={{input: 'min-h-32 text-base leading-relaxed', buttonClear: 'absolute right-3 top-3'}} 
                          errorMessage={touched.reason && errors.reason ? errors.reason : ''}
                          isInvalid={!!(touched.reason && errors.reason)}
                          onFocus={(event) => { scrollToInput(event.target); trigger() }}
                        />
                        <Button 
                          label={submitting ? t('submittingRequest') : t('submitRequest')} 
                          onPress={() => { trigger(Haptics.ImpactFeedbackStyle.Medium); handleSubmit() }} 
                          isLoading={submitting} 
                          color="primary" 
                          size="lg"
                          startContent={
                            !submitting ? <Icon name="paper-plane" size={18} color="#fff" /> : undefined
                          }
                        />
                    </View>
                  );
                }}
              </Formik>
            </MotiView>
          </MotiView>

        </View>
      </KeyboardAwareScrollView>
      {/* =========== Enhanced Success Detail Section =========== */}
      <MotiView
        from={{ opacity: 0, scale: 0.8, translateY: 100, translateX: SCREEN_WIDTH }}
        animate={{ opacity: success ? 1 : 0, scale: success ? 1 : 0.8, translateY: success ? 0 : 100, translateX: success ? 0 : SCREEN_WIDTH }}
        transition={{ type: "spring", damping: 18, stiffness: 120, delay: success ? 500 : 0 }}
        pointerEvents={success ? "auto" : "none"}
        style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 }}
      >
        <MotiView
          from={{ scale: 0.9, rotateY: '15deg' }}
          animate={{ scale: 1, rotateY: '0deg' }}
          transition={{ type: "spring", damping: 15, stiffness: 200, delay: success ? 800 : 0 }}
          className="w-full max-w-md mx-auto"
        >
          <View className="bg-white dark:bg-zinc-800 rounded-3xl p-4 shadow-2xl shadow-zinc-300 dark:shadow-black items-center">
            {submittedData && (
              <>
                <MotiView from={{ scale: 0, rotateZ: '10deg' }} animate={{ scale: 1, rotateZ: '0deg' }} transition={{ type: "spring", damping: 12, stiffness: 200, delay: 1000 }} className="bg-green-100 dark:bg-black shadow-black shadow-lg dark:shadow-black/50 rounded-2xl p-6 mb-4">
                  <Icon name="checkmark-done" size={24} />
                </MotiView>

                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: success ? 1100 : 0, type: "spring", damping: 20, stiffness: 200 }}>
                <Text className="text-2xl font-bold text-zinc-800 dark:text-white text-center">
                  {t('leaveSubmitted')}
                </Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-4 text-center leading-relaxed">
                  {t('desc.extendedLeaveSubmittedMessage')}
                </Text>
              </MotiView>

              {/* Enhanced Request Details */}
                <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: success ? 1200 : 0, type: "spring", damping: 20 }} className="w-full dark:bg-zinc-900 bg-zinc-50 rounded-2xl p-5 mb-6">
                  <Text className="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-4">
                    {t('requestDetails')}
                  </Text>
                  
                  <View className="gap-3">
                    <DetailRow icon="document-text-outline" label={t('leaveType')} value={getLeaveTypeLabel(submittedData.leaveType)} />
                    <DetailRow icon="calendar-outline" label={t('dateRange')} value={`${submittedData.startDate} - ${submittedData.endDate}`} />
                    <DetailRow icon="layers-outline" label={t('totalDays')} value={`${submittedData.numberOfDays} ${t('days')}`} valueClassName="text-blue-600 dark:text-blue-400 font-semibold" />
                    <DetailRow icon="briefcase-outline" label={t('businessDays')} value={`${submittedData.businessDays} ${t('days')}`} valueClassName="text-green-600 dark:text-green-400 font-semibold" />
                    <DetailRow icon="time-outline" label={t('status')} value={t('pending')} valueClassName="text-amber-600 dark:text-amber-400 font-medium" />
                    <DetailRow icon="chatbox-ellipses-outline" label={t('reason')} value={submittedData.reason} isMultiline />
                    <DetailRow icon="checkmark-circle-outline" label={t('submittedAt')} value={moment(submittedData.submittedAt).format('MMM Do, YYYY [at] h:mm A')} valueClassName="text-zinc-500 dark:text-zinc-400 text-sm" />
                  </View>
                </MotiView>
                {/* Enhanced Action Buttons */}
                <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: success ? 1200 : 0, type: "spring", damping: 20 }} className="flex-row items-center gap-3 w-full ">
                  <Button startContent={<Icon name="arrow-back" size={18} color="#fff" />} color="foreground" onPress={handleGoBack}  />
                  <Button label={t('cancelRequest')} onPress={handleCancelRequest} color="danger" variant="flat" isLoading={canceling} className="flex-1" startContent={!canceling ? <Icon name="trash" size={16} color="#f31260"/> : undefined} />
                </MotiView>
              </>
            )}

          </View>
        </MotiView>
      </MotiView>
    </SafeAreaView>
  );
};

// Helper component for detail rows
const DetailRow = ({ 
  icon, 
  label, 
  value, 
  valueClassName = "dark:text-zinc-300 text-zinc-600", 
  isMultiline = false 
}: {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
  isMultiline?: boolean;
}) => (
  <View className={`flex-row ${isMultiline ? 'items-start' : 'items-center'} gap-2`}>
    <View className="w-5 items-center mt-0.5">
      <Ionicons name={icon as any} size={18} color="#a1a1aa" />
    </View>
    <Text className="dark:text-zinc-200 text-zinc-700 font-medium min-w-20">
      {label} :
    </Text>
    <Text className={`${valueClassName} flex-1 ${isMultiline ? 'leading-relaxed' : ''}`}>
      {value}
    </Text>
  </View>
);

export default ExtendedLeave;