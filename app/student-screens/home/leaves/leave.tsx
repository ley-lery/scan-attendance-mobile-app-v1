import { Button, DatePicker, Icon, Input, Picker, Scanning, Text, useToast } from "@/godui";
import client from "@/services/api/client";
import { ENDPOINTS } from "@/services/api/endpoints";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Formik } from "formik";
import moment from "moment";
import { MotiView } from "moti";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Platform, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Yup from 'yup';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const subjects = [
  { label: 'Frontend Development', value: 'frontend' },
  { label: 'Backend Development', value: 'backend' },
  { label: 'Database', value: 'database' },
  { label: 'Mobile Development', value: 'mobile' },
  { label: 'UI/UX Design', value: 'ui-ux' },
];

const leaveTypes = [
  { label: 'Sick Leave', value: 'sick' },
  { label: 'Personal Leave', value: 'personal' },
  { label: 'Vacation Leave', value: 'vacation' },
  { label: 'Maternity Leave', value: 'maternity' },
  { label: 'Paternity Leave', value: 'paternity' },
  { label: 'Sabbatical Leave', value: 'sabbatical' },
  { label: 'Other Leave', value: 'other' },
];

const initialValues = {
  subject: '',
  leaveType: '',
  leaveDate: new Date(),
  leaveReason: '',
};

const getSubjectLabel = (value: string) => {
  const found = subjects.find(s => s.value === value);
  return found ? found.label : value;
};

const getLeaveTypeLabel = (value: string) => {
  const found = leaveTypes.find(s => s.value === value);
  return found ? found.label : value;
};



const SingleLeave = () => {
  const { t } = useTranslation();
  const { show } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Scroll and focus management
  const scrollRef = useRef<KeyboardAwareScrollView>(null);
  const formikRef = useRef<any>(null);

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  };
  
  const scrollToInput = (reactNode: any) => {
    if (reactNode) {
      scrollRef.current?.scrollToFocusedInput(reactNode);
    }
  };

  const formDataSchema = Yup.object().shape({
    subject: Yup.string().required(t('validation.required')),
    leaveType: Yup.string().required(t('validation.required')),
    leaveDate: Yup.date().required(t('validation.required')),
    leaveReason: Yup.string()
      .min(10, t('validation.minLength', { count: 10 }))
      .required(t('validation.required')),
  });

  const onSubmit = async (values: any, { setSubmitting: setFormikSubmitting }: any) => {
    setSubmitting(true);
    setFormErrors([]);
    
    // triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      const payload = {
        subject: values.subject,
        leaveType: values.leaveType,
        leaveDate: moment(values.leaveDate).format('YYYY-MM-DD'),
        leaveReason: values.leaveReason,
        submittedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        id: Math.random().toString(36).substr(2, 9),
      };

      // const res = await client.post(ENDPOINTS.STUDENT.SINGLE_LEAVE_REQUESTS.POST, payload);
      // console.log(res);
      const url = `${client.defaults.baseURL}${ENDPOINTS.STUDENT.SINGLE_LEAVE_REQ.POST}`;
      console.log("Full API URL:", url);
      
      setSubmittedData(payload);
      setSuccess(true);
      setSubmitting(false);
      setFormikSubmitting(false);
      
      // Success feedback
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      
      show({
        title: t('leaveRequest'),
        message: t('leaveSubmittedMessage'),
        type: 'success',
      });
      
    } catch (error) {
      console.log("Error leave request: ", error);
      
      setSubmitting(false);
      setFormikSubmitting(false);
      
      // Error feedback
      triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy);
      
      setFormErrors([t('leaveRequestFailed')]);
      show({
        title: t('error'),
        message: t('leaveRequestFailed'),
        type: 'error',
      });
    }
  };

  const handleGoBack = () => {
    triggerHaptic();
    if (Platform.OS === "web") {
      window.history.back();
    } else if (typeof require !== "undefined") {
      const { router } = require("expo-router");
      router.back();
    }
  };

  const handleCancelRequest = () => {
    resetForm();
    setCanceling(true);
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    
    setTimeout(() => {
      setCanceling(false);
      setSubmittedData(null);
      setSuccess(false);
      
      triggerHaptic(Haptics.ImpactFeedbackStyle.Light);
      show({
        title: t('cancelLeaveRequest'),
        message: t('leaveRequestCanceledMessage'),
        type: 'success',
      });
    }, 1200);
  };

  const resetForm = () => {
    setSuccess(false);
    setSubmittedData(null);
    setFormErrors([]);
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  return (
    <KeyboardAwareScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" extraScrollHeight={Platform.OS === "ios" ? 100 : 0} className="flex-1 bg-zinc-50 dark:bg-zinc-900" showsVerticalScrollIndicator={false}>
      <View className="flex-1 min-h-screen">
        {/* =========== Enhanced Form Section =========== */}
        <MotiView
          from={{ opacity: 0, scale: submitting ? 0.95 : 1, translateX: 0 }}
          animate={{ opacity: success ? 0 : 1, scale: success || submitting ? 0.95 : 1, translateX: success ? -SCREEN_WIDTH * 0.1 : 0 }}
          transition={{ type: "timing", duration: 600 }}
          pointerEvents={success ? "none" : "auto"}
          style={{ flex: 1 }}
          className="justify-center p-4"
        >
          {/* Header Section */}
          <MotiView from={{ opacity: 0, translateY: -50 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "spring", damping: 20, stiffness: 200, delay: 100 }} className="mx-4 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg shadow-zinc-200 dark:shadow-black/30">
            <View className="flex-row items-start mb-4">
              <TouchableOpacity
                onPress={handleGoBack}
                className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg mr-4 shadow-lg shadow-white dark:shadow-black/60"
                activeOpacity={0.7}
              >
                <Icon name="chevron-back" size={20} />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-lg font-bold text-zinc-800 dark:text-zinc-300">
                  {t('todayLeaveRequest')}
                </Text>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {moment().format('dddd, MMMM Do YYYY')}
                </Text>
              </View>
            </View>
            <Text className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
              {t('desc.todayLeaveRequestDescription')}
            </Text>
          </MotiView>

          {/* Enhanced Form Section */}
          <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "spring", damping: 20, stiffness: 150, delay: 200 }} className="mt-6 px-4">
            <Formik
              ref={formikRef}
              initialValues={initialValues}
              validationSchema={formDataSchema}
              onSubmit={onSubmit}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ handleChange, handleSubmit, values, errors, touched, setFieldValue, isSubmitting }) => (
                <View className="gap-4">
                  <Picker
                    label={t('subject')}
                    isRequired
                    variant="solid"
                    size="md"
                    startContent={<Icon name="book" size={20} color="#a1a1aa" />}
                    placeholder={t('selectSubject')}
                    onChange={(value) => {
                      setFieldValue('subject', value);
                      triggerHaptic();
                    }}
                    options={subjects}
                    value={values.subject}
                    errorMessage={touched.subject && errors.subject ? errors.subject : ''}
                    isInvalid={!!(touched.subject && errors.subject)}
                    isDisabled={isSubmitting}
                  />
                    <Picker
                      label={t('leaveType')}
                      onChange={(value) => {
                        setFieldValue('leaveType', value);
                        triggerHaptic();
                      }}
                      options={leaveTypes}
                      value={values.leaveType}
                      isRequired
                      variant="solid"
                      size="md"
                      startContent={<Ionicons name="document-text" size={24} color="#a1a1aa" />}
                      placeholder={t('selectLeaveType')}
                      errorMessage={touched.leaveType && errors.leaveType ? errors.leaveType : ''}
                      isInvalid={!!(touched.leaveType && errors.leaveType)}
                      isDisabled={isSubmitting}
                    />
                    <DatePicker
                      isRequired
                      label={t('date')}
                      placeholder={t('selectDate')}
                      startContent={<Icon name="calendar" size={20} color="#a1a1aa" />}
                      value={values.leaveDate}
                      onChange={(e, d) => {
                        if (d) {
                          setFieldValue('leaveDate', d);
                          triggerHaptic();
                        }
                      }}
                      minimumDate={new Date()}
                      errorMessage={touched.leaveDate ? (errors.leaveDate as string) : ''}
                      isInvalid={!!(touched.leaveDate && errors.leaveDate)}
                      isDisabled={isSubmitting}
                    />

                    <Input
                      isRequired
                      label={t('reason')}
                      placeholder={t('enterReason')}
                      value={values.leaveReason}
                      onChangeText={handleChange('leaveReason')}
                      multiline
                      numberOfLines={4}
                      classNames={{ 
                        input: 'min-h-32 text-base leading-relaxed', 
                        buttonClear: 'absolute right-3 top-3' 
                      }}
                      errorMessage={touched.leaveReason && errors.leaveReason ? errors.leaveReason : ''}
                      isInvalid={!!(touched.leaveReason && errors.leaveReason)}
                      isDisabled={isSubmitting}
                      onFocus={(event) => {
                        scrollToInput(event.target);
                        triggerHaptic();
                      }}
                    />

                  {/* Submit Button */}
                  <MotiView
                    from={{ opacity: 0, translateY: 20, scale: 0.95 }}
                    animate={{ opacity: 1, translateY: 0, scale: 1 }}
                    transition={{ delay: 700, type: "spring", damping: 15, stiffness: 200 }}
                  >
                    <Button
                      label={submitting ? t('submitting') : t('submit')}
                      onPress={() => {
                        triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
                        handleSubmit();
                      }}
                      isLoading={submitting}
                      color="primary"
                      size="lg"
                      startContent={!submitting ? <Icon name="paper-plane" size={18} color="#fff" /> : undefined}
                    />
                  </MotiView>
                </View>
              )}
            </Formik>
          </MotiView>
        </MotiView>

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
            transition={{ type: "spring", damping: 15, stiffness: 200, delay: success ? 700 : 0 }}
            className="w-full max-w-md mx-auto"
          >
            <View className="dark:bg-zinc-800 bg-white rounded-3xl p-4 shadow-2xl shadow-zinc-300 dark:shadow-black items-center">
              <View className="p-4 rounded-lg shadow-lg dark:shadow-black/50 bg-black mb-4">
                {success ? (<Scanning scanState="success"/>) : (<Scanning scanState="failed"/>)}
              </View>

              {/* Success Text */}
              <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: success ? 1100 : 0, type: "spring", damping: 20 }}>
                <Text className="text-2xl font-bold text-zinc-800 dark:text-white mb-3 text-center">{t('leaveSubmitted')}</Text>
                <Text className="text-zinc-500 dark:text-zinc-400 text-base mb-8 text-center leading-relaxed">{t('desc.leaveSubmitted')}</Text>
              </MotiView>

              {/* Request Details */}
              {submittedData && (
                <MotiView
                  from={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: success ? 1300 : 0, type: "spring", damping: 20 }}
                  className="w-full dark:bg-zinc-900 bg-zinc-50 rounded-2xl p-5 mb-6"
                >
                  <Text className="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-4"> {t('requestDetails')}</Text>
                  <View className="gap-3">
                    <DetailRow icon="book-outline" label={t('subject')} value={getSubjectLabel(submittedData.subject)} />
                    <DetailRow icon="document-text-outline" label={t('leaveType')} value={getLeaveTypeLabel(submittedData.leaveType)} />
                    <DetailRow icon="calendar-outline" label={t('date')} value={submittedData.leaveDate}/>
                    <DetailRow icon="time-outline" label={t('status')} value={t('pending')} valueClassName="text-amber-600 dark:text-amber-400 font-medium" />
                    <DetailRow icon="chatbox-ellipses-outline" label={t('reason')} value={submittedData.leaveReason} isMultiline/>
                  </View>
                </MotiView>
              )}

              {/* Action Buttons */}
              <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: success ? 1500 : 0, type: "spring", damping: 20 }} className="flex-row items-center gap-3 w-full">
                <Button startContent={<Icon name="arrow-back" size={18} color="#fff" />} color="foreground" onPress={handleGoBack}/>
                <Button label={canceling ? t('canceling') : t('cancelRequest')} onPress={handleCancelRequest} color="danger" variant="flat" isLoading={canceling} className="flex-1" startContent={!canceling ? <Ionicons name="trash" size={16} color="#f31260" /> : undefined}/>
              </MotiView>
            </View>
          </MotiView>
        </MotiView>
      </View>
    </KeyboardAwareScrollView>
  );
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
  isMultiline?: boolean;
}

// Helper component for detail rows
const DetailRow = ({ icon, label, value, valueClassName = "dark:text-zinc-300 text-zinc-600", isMultiline = false }: DetailRowProps) => (
  <View className={`flex-row ${isMultiline ? 'items-start' : 'items-center'} gap-3`}>
    <View className="w-5 items-center mt-0.5">
      <Ionicons name={icon as any} size={18} color="#a1a1aa" />
    </View>
    <Text className="dark:text-zinc-200 text-zinc-700 font-medium min-w-20">
      {label}:
    </Text>
    <Text className={`${valueClassName} flex-1 ${isMultiline ? 'leading-relaxed' : ''}`}>
      {value}
    </Text>
  </View>
);
export default SingleLeave;