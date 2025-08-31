/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, BlurCard, BottomSheetModalUi, Button, CircleLoading, Icon, Scanning, Text, useDisclosure } from "@/godui";
import { useGetLocationStore } from "@/stores/useGetLocationStore";
import { useUserStore } from "@/stores/userStore";
import soundManager from "@/utils/soundManager";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import { CameraView, PermissionStatus, useCameraPermissions } from "expo-camera";
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import moment from "moment";
import { MotiView } from "moti";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { ApiError, AttendanceApiService } from "./service/api";

const SCHOOL_LOCATION = {
    // work location
    // latitude: 13.369507133489616,
    // longitude: 103.8658975460337,

    // home location
    latitude : 13.353555915704485, 
    longitude : 104.00318244982763
};

const MAX_DISTANCE_METERS = 50;

// ============= Enhanced State Management =============
type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'failed' | 'error';
type ScanMethod = 'camera';


// ============= Utility function =============
const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const useModalState = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return { isOpen, onOpen, onClose };
};



// ============= QR Code Processing Function =============
const processQRCode = async (qrData: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
        // Enhanced QR validation
        if (!qrData || qrData.trim().length === 0) {
            throw new Error("Invalid QR code data");
        }
        
        // Validate QR format (you can customize this based on your QR format)
        // if (!qrData.includes('192.168.0.16:7700')) {
        //     throw new Error("Invalid QR code format - not a valid attendance QR");
        // }
        
        return { success: true, data: qrData };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to process QR code" 
        };
    }
};

const Scan: React.FC = () => {
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    
    // ============= Modal States =============
    const locationModal = useModalState();
    const notFoundModal = useModalState();
    const scannedModal = useModalState();
    const errorModal = useModalState();
    
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    
    // ============= Core States =============
    const userData = useUserStore((state) => state.users) as any;
    const [permission, requestPermission] = useCameraPermissions();
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [scanMethod, setScanMethod] = useState<ScanMethod>('camera');
    const [showCamera, setShowCamera] = useState(true);
    const [currentError, setCurrentError] = useState<ApiError | null>(null);
    const [attendanceData, setAttendanceData] = useState<any>(null);
    const [zoom, setZoom] = useState(0);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    // ============= API Service Instance =============
    const apiService = useRef(AttendanceApiService.getInstance());
    
    
    const qrLock = useRef(false);
    const processingTimeout = useRef<NodeJS.Timeout>(null);
    
    const getLocation = useGetLocationStore((state: any) => state.location);

    // ============= Computed Values =============
    const isLoading = scanState === 'scanning' || scanState === 'processing';
    const isSuccess = scanState === 'success';
    const isFailed = scanState === 'failed' || scanState === 'error';
    const showResults = isSuccess;


    const toggleSound = useCallback(() => {
        setSoundEnabled(!soundEnabled);
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [soundEnabled]);

    // ============= Enhanced Error State Management =============
    const handleApiError = useCallback((error: ApiError) => {
        setCurrentError(error);
        
        switch (error.type) {
            case 'network':
                setScanState('error');
                break;
            case 'not_found':
                setScanState('failed');
                notFoundModal.onOpen();
                break;
            case 'already_scanned':
                setScanState('error');
                scannedModal.onOpen();
                break;
            case 'validation':
            case 'server':
                setScanState('failed');
                break;
            default:
                setScanState('error');
                break;
        }
        
        // Enhanced error feedback
        if (Platform.OS !== 'web') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        soundManager.play('failed');
    }, []);


    // ============= Enhanced QR Data Processing with Real API =============
    const handleQRData = useCallback(async (qrData: string) => {
        if (qrLock.current) return;
        
        qrLock.current = true;
        setScanState('processing');
        setCurrentError(null);
        
        try {
            // Step 1: Validate QR code format
            const qrValidation = await processQRCode(qrData);
            
            if (!qrValidation.success) {
                throw new Error(qrValidation.error || 'Invalid QR code');
            }

            // Step 2: Fetch student list from API
            const studentListResult = await apiService.current.fetchStudentList(qrData);
            
            if (!studentListResult.success) {
                handleApiError(studentListResult.error!);
                return;
            }

            const students = studentListResult.data!;

            // Step 3: Find current user in the list
            const studentData = students.find(
                (item: any) => item.student_code === userData?.student_code
            );
            
            if (!studentData) {
                handleApiError({
                    type: 'not_found',
                    message: 'Student not found in this session',
                    details: { student_code: userData?.student_code, available_students: students.length }
                });
                return;
            }

            // Step 4: Check if already scanned
            if (studentData.is_scanned === 1) {
                handleApiError({
                    type: 'already_scanned',
                    message: 'Attendance already recorded for this session',
                    details: studentData
                });
                return;
            }

            // Step 5: Prepare attendance data
            const attendancePayload = {
                student_id: studentData.id,
                student_code: studentData.student_code,
                student_name: studentData.name || studentData.student_name_en,
                subject: studentData.subject || "Web Development",
                session: studentData.session || 1,
                status: "Present",
                date: moment().format("YYYY-MM-DD"),
                time: moment().format("HH:mm:ss"),
                scan_time: moment().format("YYYY-MM-DD HH:mm:ss"),
                scan_method: scanMethod,
                location: {
                    latitude: getLocation?.latitude,
                    longitude: getLocation?.longitude,
                },
                qr_data: qrData,
            };

            console.log('Creating attendance with payload:', attendancePayload);

            // Step 6: Create attendance record
            // const attendanceResult = await apiService.current.createAttendance(attendancePayload);
            
            // if (!attendanceResult.success) {
            //     handleApiError(attendanceResult.error!);
            //     return;
            // }

            // // Step 7: Success - update state
            // console.log('Attendance created successfully:', attendanceResult.data);
            setAttendanceData({
                ...attendancePayload
            });
            setScanState('success');
            
            // Enhanced success feedback
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            setTimeout(() => {
                soundManager.play('success');
            }, 600);
            
        } catch (error: any) {
            console.error('QR Processing Error:', error);
            
            // Handle unexpected errors
            const apiError: ApiError = {
                type: 'unknown',
                message: error?.message || 'An unexpected error occurred',
                details: error
            };
            
            handleApiError(apiError);
        } finally {
            qrLock.current = false;
        }
    }, [userData, scanMethod, getLocation, handleApiError]);

    // ============= Effect: Validate location and user scanning status =============
    useEffect(() => {
        if (!userData || !getLocation) return;
        
        const distance = getDistanceInMeters(
            getLocation.latitude,
            getLocation.longitude,
            SCHOOL_LOCATION.latitude,
            SCHOOL_LOCATION.longitude
        );
        
        if (distance > MAX_DISTANCE_METERS) {
            setShowCamera(false);
            locationModal.onOpen();
            return;
        }
        
        if (userData?.is_scanned === 1) {
            scannedModal.onOpen();
            return;
        }
        
        // Good to go - reset to idle state
        setScanState('idle');
        setShowCamera(true);
    }, [userData, getLocation]);

    // ============= Effect: Camera permission =============
    useEffect(() => {
        if (permission?.status !== PermissionStatus.GRANTED) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    // ============= Effect: App state management =============
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active" && isFocused) {
                resetScanner();
            }
        });
        return () => subscription.remove();
    }, [isFocused]);

    // ============= Effect: Handle scan state transitions =============
    useEffect(() => {
        switch (scanState) {
            case 'scanning':
                if (scanMethod === 'camera') {
                    bottomSheetRef.current?.present();
                }
                // Add haptic feedback
                if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                break;
                
            case 'processing':
                // Keep bottom sheet open during processing
                break;
                
            case 'success':
            case 'failed':
            case 'error':
                // Auto-dismiss bottom sheets and show results after delay
                setTimeout(() => {
                    bottomSheetRef.current?.dismiss();
                }, 2500);
                break;
        }
    }, [scanState, scanMethod]);

    // ============= Enhanced Reset Function =============
    const resetScanner = useCallback(() => {
        if (processingTimeout.current) {
            clearTimeout(processingTimeout.current);
        }
        
        qrLock.current = false;
        setScanState('idle');
        setScanMethod('camera');
        setShowCamera(true);
        setCurrentError(null);
        setAttendanceData(null);
        bottomSheetRef.current?.dismiss();
        
        // Close all modals except location modal if still invalid
        notFoundModal.onClose();
        // errorModal.onClose();
        // Don't close scannedModal or locationModal as they have their own logic
    }, []);

    // ============= Enhanced QR Scanning =============
    const handleBarcodeScanned = useCallback(
        async (data: any) => {
            if (qrLock.current || !data?.data || scanState !== 'idle') return;

            console.log('QR Code scanned:', data.data);
            setScanMethod('camera');
            setScanState('scanning');
            setShowCamera(false);

            // Enhanced processing with better UX
            setTimeout(async () => {
                setScanState('processing');
                await handleQRData(data.data);
            }, 800);
        },
        [scanState, handleQRData]
    );

    // ============= Enhanced Zoom Control =============
    const handleZoom = useCallback((direction: "in" | "out") => {
        setZoom((prevZoom) => {
            const newZoom = direction === "in" 
                ? Math.min(prevZoom + 0.1, 1) 
                : Math.max(prevZoom - 0.1, 0);
            
            // Add haptic feedback for zoom
            if (Platform.OS !== 'web' && newZoom !== prevZoom) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            
            return newZoom;
        });
    }, []);

    // ============= Flash Toggle =============
    const toggleFlash = useCallback(() => {
        setFlashEnabled(!flashEnabled);
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [flashEnabled]);

    // ============= Auto Reset for Failed States =============
    useEffect(() => {
        if (scanState === 'failed' || scanState === 'error') {
            const timer = setTimeout(() => {
                resetScanner();
            }, 6000); // Auto reset after 6 seconds for better UX
            
            return () => clearTimeout(timer);
        }
    }, [scanState, resetScanner]);

    // ============= Enhanced Error Message Generation =============
    const getErrorMessage = useCallback(() => {
        if (!currentError) return t('error.scanFailed') || "សូមសាកល្បងម្តងទៀត...";
        
        switch (currentError.type) {
            case 'network':
                return t('error.networkError') || 'Network error - check your connection';
            case 'server':
                return t('error.serverError') || 'Server error - please try again';
            case 'not_found':
                return t('error.studentNotFound') || 'Student not found in this session';
            case 'already_scanned':
                return t('error.alreadyScanned') || 'Attendance already recorded';
            case 'validation':
                return t('error.invalidData') || 'Invalid QR code or data';
            case 'location':
                return t('error.locationError') || 'Location verification failed';
            default:
                return currentError.message || t('error.unknownError') || 'An error occurred';
        }
    }, [currentError, t]);

    // ============= Enhanced Retry Logic =============
    const handleRetry = useCallback(() => {
        console.log('Retrying scan...');
        resetScanner();
        
        // Add slight delay for better UX
        setTimeout(() => {
            setShowCamera(true);
            setScanState('idle');
        }, 500);
    }, [resetScanner]);

    // ============= Permission UI =============
    if (!permission) {
        return null;
    }

    if (permission.status !== PermissionStatus.GRANTED) {
        return (
            <View className="flex-1 items-center justify-center dark:bg-zinc-900 bg-zinc-100">
                <Ionicons name="camera-outline" size={64} color="#6b7280" />
                <Text className="text-zinc-700 dark:text-white text-xl font-bold mt-4">
                    {t('cameraPermissionRequired')}
                </Text>
                <Text className="text-zinc-400 text-center text-base mt-2 max-w-[250px] leading-5">
                    {t('cameraPermissionDescription')}
                </Text>
                <Button
                    label={t('grantPermission')}
                    startContent={<Icon name="camera" size={18} color="#fff" />}
                    onPress={requestPermission}
                    color="primary"
                />
            </View>
        );
    }

    // ============= Get Current Scan Status Message =============
    const getScanStatusMessage = () => {
        switch (scanState) {
            case 'scanning':
                return t('detectingQR') || 'Detecting QR code...';
            case 'processing':
                return t('validatingData') || 'Validating with server...';
            case 'success':
                return t('attendanceRecorded') || 'Attendance recorded successfully!';
            case 'failed':
                return t('scanFailed') || 'Scan failed';
            case 'error':
                return t('errorOccurred') || 'An error occurred';
            default:
                return t('scanning') || 'Ready to scan';
        }
    };

    // ============= Main Render =============
    return (
        <>
            {/* Location Alert */}
            <Alert
                visible={locationModal.isOpen}
                title={t("invalidLocation")}
                message={t("checkYourLocation")}
                onConfirm={() => router.replace("../(student)/location")}
                onCancel={() => router.back()}
                confirmText={t("check")}
                cancelText={t("back")}
            />
            
            {/* Not Found Alert */}
            <Alert
                icon={<Ionicons name="alert-circle-outline" size={34} color="#db2777" />}
                visible={notFoundModal.isOpen}
                title={t("notFound")}
                message={t("desc.studentNotFoundDesc")}
                onConfirm={() => {
                    notFoundModal.onClose();
                    handleRetry();
                }}
                confirmText={t("tryAgain")}
            />
            
            {/* Already Scanned Alert */}
            <Alert
                icon={<Ionicons name="checkmark-circle-outline" size={34} color="#4CD964" />}
                visible={scannedModal.isOpen}
                title={t("alreadyScanned")}
                message={t("desc.studentScannedDesc")}
                onConfirm={() => {
                    scannedModal.onClose();
                    router.back();
                }}
                confirmText={t("ok")}
            />

            {/* Enhanced Error Alert */}
            <Alert
                icon={<Ionicons name="warning-outline" size={34} color="#f97316" />}
                visible={errorModal.isOpen}
                title={t("error.title") || "Error"}
                message={getErrorMessage()}
                onConfirm={() => {
                    errorModal.onClose();
                    handleRetry();
                }}
                onCancel={() => {
                    errorModal.onClose();
                    router.back();
                }}
                confirmText={t("tryAgain")}
                cancelText={t("exit")}
            />

            <View style={styles.container} className="bg-zinc-300 dark:bg-zinc-950">
                {/* ============= Camera View ============= */}
                <MotiView 
                    from={{ opacity: 1, scale: 1 }}
                    animate={{ 
                        opacity: showResults ? 0 : 1, 
                        scale: showResults ? 0.95 : 1 
                    }}
                    transition={{ type: "timing", duration: 400 }}
                    pointerEvents={isLoading || showResults ? "none" : "auto"}
                    className="flex-1"
                >
                    {/* Camera Container */}
                    <View style={StyleSheet.absoluteFillObject} className="bg-zinc-100 dark:bg-zinc-900 items-center justify-center relative">
                        {/* Scanning Frame */}
                        <MotiView
                            from={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "timing", duration: 600, delay: 200 }}
                            className="relative"
                        >
                            {/* Camera View */}
                            <View className="w-72 h-72 rounded-3xl overflow-hidden border-2 dark:border-zinc-800 border-zinc-200 relative">
                                {showCamera && userData?.is_scanned !== 1 && scanState === 'idle' && scanMethod === 'camera' && (
                                    <CameraView
                                        zoom={zoom}
                                        facing="back"
                                        flash={flashEnabled ? 'on' : 'off'}
                                        onBarcodeScanned={handleBarcodeScanned}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                )}
                                
                                {/* Scanning Overlay */}
                                {scanState === 'idle' && scanMethod === 'camera' && (
                                    <MotiView
                                        from={{ translateY: -100 }}
                                        animate={{ translateY: 100 }}
                                        transition={{
                                            type: 'timing',
                                            duration: 2000,
                                            loop: true,
                                            repeatReverse: true,
                                        }}
                                        className="absolute left-0 right-0 h-1 bg-blue-500/80"
                                        style={{ top: '50%' }}
                                    />
                                )}
                                
                                {/* Corner Guides */}
                                <View className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white/40 rounded" />
                                <View className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white/40 rounded" />
                                <View className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white/40 rounded" />
                                <View className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white/40 rounded" />
                            </View>
                            
                            {/* Instruction Text */}
                            <Text className="dark:text-white text-zinc-600 text-center mt-4 text-base font-medium">
                                {scanState === 'idle' && scanMethod === 'camera' 
                                    ? t('pointCameraToQR') 
                                    : getScanStatusMessage()
                                }
                            </Text>
                        </MotiView>
                    </View>

                    {/* Enhanced Header */}
                    <View className="absolute left-6 top-12 right-6 flex-row justify-between items-center z-30">
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="bg-black/30 rounded-full p-3"
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        
                        <Text className="text-zinc-600 dark:text-white text-lg font-semibold">
                            {t('scanAttendance')}
                        </Text>
                        
                        {/* Sound Toggle */}
                        <TouchableOpacity 
                            onPress={toggleSound}
                            className="bg-black/30 rounded-full p-3"
                        >
                            <Ionicons 
                                name={soundEnabled ? "volume-high" : "volume-mute"} 
                                size={20} 
                                color={soundEnabled ? "#fff" : "#6b7280"} 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Enhanced Control Bar */}
                    <View className="absolute bottom-8 left-6 right-6 flex-row justify-between items-center">
                        {/* Primary Controls */}
                        <View className="flex-row justify-between items-center">
                            {/* Flash Toggle */}
                            <TouchableOpacity 
                                onPress={toggleFlash}
                                className={`${flashEnabled ? 'bg-yellow-500/20' : 'bg-black/10 dark:bg-white/10'} rounded-full px-4 py-3 flex-row items-center gap-2 border ${flashEnabled ? 'border-yellow-500/40' : 'border-white/20'}`}
                            >
                                <Ionicons 
                                    name={flashEnabled ? "flash" : "flash-off"} 
                                    size={20} 
                                    color={flashEnabled ? "#fbbf24" : "#fff"} 
                                />
                                <Text className={`${flashEnabled ? 'text-yellow-500 dark:text-yellow-300' : 'text-zinc-500 dark:text-white'} font-medium`}>
                                    {t('flash')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        
                        {/* Zoom Controls */}
                        <View className="flex-row items-center justify-center gap-3">
                            <TouchableOpacity
                                onPress={() => handleZoom("out")}
                                disabled={zoom <= 0}
                                className={`${zoom <= 0 ? 'dark:bg-white/5 bg-black/5' : 'dark:bg-white/10 bg-black/10'} rounded-full p-3 border border-black/20 dark:border-white/20`}
                            >
                                <Ionicons name="remove" size={20} color={zoom <= 0 ? "#6b7280" : "#fff"} />
                            </TouchableOpacity>
                            
                            <Text className="text-black dark:text-white font-mono text-sm min-w-[40px] text-center">
                                {Math.round(zoom * 100)}%
                            </Text>
                            
                            <TouchableOpacity
                                onPress={() => handleZoom("in")}
                                disabled={zoom >= 1}
                                className={`${zoom >= 1 ? 'dark:bg-white/5 bg-black/5' : 'dark:bg-white/10 bg-black/10'} rounded-full p-3 border border-black/20 dark:border-white/20`}
                            >
                                <Ionicons name="add" size={20} color={zoom >= 1 ? "#6b7280" : "#fff"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </MotiView>

                {/* ============= Enhanced Results Section ============= */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9, translateY: 50 }}
                    animate={{ opacity: showResults ? 1 : 0, scale: showResults ? 1 : 0.9, translateY: showResults ? 0 : 50 }}
                    transition={{ type: "timing", duration: 600, delay: showResults ? 200 : 0 }}
                    pointerEvents={showResults ? "auto" : "none"}
                    className="absolute inset-0 flex-1 justify-center items-center px-4  overflow-hidden"
                >
                    <View className="w-full  rounded-3xl overflow-hidden p-0">
                        <View className="w-80 h-80 bg-theme1-primary/70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-3xl"/>
                        <View className="bg-zinc-300/95 dark:bg-zinc-600/90">
                            <BlurCard intensity={100} className="p-0" radius="sm">
                                <MotiView
                                    from={{ opacity: 0, scale: showResults ? 1 : 0.9 }}
                                    animate={{ opacity: showResults ? 1 : 0, scale: showResults ? 1 : 0.9 }}
                                    transition={{ type: "timing", duration: 500, delay: 600 }}
                                    className="rounded-2xl p-4 mb-6 gap-2 items-center"
                                >
                                    {/* Status Icon */}
                                    <View className={`dark:bg-white/5 bg-white/20 dark:shadow-black rounded-2xl p-4 mb-4 dark:shadow-lg`}>
                                        {/* <Scanning 
                                            size={40}
                                            strokeWidth={2}
                                            isLoading={false}
                                            isFailed={isFailed}
                                            isSuccess={isSuccess}
                                            progress={100}
                                            duration={1000}
                                            successColor="#4CD964"
                                            failedColor="#FF6B6B"
                                        /> */}
                                        <CircleLoading isSuccess={isSuccess} size={50}/>
                                    </View>
                                    
                                    {/* Enhanced Method Badge */}
                                    {/* <View className={`${isSuccess ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'} rounded-full px-4 py-2 border mb-2`}>
                                        <Text className={`${isSuccess ? 'text-success' : 'text-dager'} text-sm font-medium`}>
                                            {scanMethod === 'camera' ? t('cameraScanned') : t('uploadedQR')} • {moment().format('HH:mm:ss')}
                                        </Text>
                                    </View> */}
                                    
                                    <Text className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-success' : 'text-danger'}`}>
                                        {isSuccess ? t('attendanceRecorded') : t('scanFailed')}
                                    </Text>
                                    
                                    <Text className="text-zinc-500 dark:text-zinc-400 text-center text-base leading-5">
                                        {isSuccess 
                                            ? t('desc.attendanceSuccess') || 'Your attendance has been recorded successfully'
                                            : getErrorMessage()
                                        }
                                    </Text>
                                </MotiView>
                                {/* Enhanced Attendance Details (Success Only) */}
                                {isSuccess && attendanceData && (
                                    <MotiView
                                        from={{ opacity: 0, translateY: 20 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{ type: "timing", duration: 500, delay: 800 }}
                                        className=" rounded-2xl p-4 mb-6 gap-2"
                                    >
                                        <Text className="text-zinc-700 dark:text-zinc-300 font-normal text-sm mb-3">
                                            {t('attendanceDetails')}
                                        </Text>
                                        <DetailRow 
                                            icon="person-outline" 
                                            label={t('student')} 
                                            value={attendanceData?.student_name_en || 'N/A'} 
                                        />
                                        <DetailRow 
                                            icon="book-outline" 
                                            label={t('subject')} 
                                            value={attendanceData?.subject || 'N/A'} 
                                        />
                                        <DetailRow 
                                            icon="calendar-outline" 
                                            label={t('date')} 
                                            value={attendanceData?.date || moment().format('YYYY-MM-DD')} 
                                        />
                                        <DetailRow 
                                            icon="time-outline" 
                                            label={t('time')} 
                                            value={attendanceData.time || moment().format('HH:mm:ss')} 
                                        />
                                        <DetailRow 
                                            icon="location-outline" 
                                            label={t('session')} 
                                            value={attendanceData.session ? attendanceData.session.toString() : 'N/A'} 
                                        />
                                        <DetailRow 
                                            icon="checkmark-circle-outline" 
                                            label={t('status')} 
                                            value={attendanceData.status || "Present"} 
                                            valueColor="#4CD964"
                                        />
                                        <DetailRow 
                                            icon="scan-outline" 
                                            label={t('method')} 
                                            value={attendanceData.scan_method === 'camera' ? t('cameraScanned') : t('uploadedQR')} 
                                        />
                                    </MotiView>
                                )}

                                {/* Enhanced Error Details (Failed/Error Only) */}
                                {/* {isFailed && currentError && (
                                    <MotiView
                                        from={{ opacity: 0, translateY: 20 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{ type: "timing", duration: 500, delay: 800 }}
                                        className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 mb-6 border border-red-200 dark:border-red-800"
                                    >
                                        <Text className="text-red-700 dark:text-red-300 font-semibold text-lg mb-3">
                                            {t('errorDetails') || 'Error Details'}
                                        </Text>
                                        
                                        <DetailRow 
                                            icon="alert-circle-outline" 
                                            label={t('errorType')} 
                                            value={currentError.type.toUpperCase()} 
                                            valueColor="#ef4444"
                                        />
                                        <DetailRow 
                                            icon="information-circle-outline" 
                                            label={t('message')} 
                                            value={currentError.message} 
                                            valueColor="#ef4444"
                                        />
                                        <DetailRow 
                                            icon="time-outline" 
                                            label={t('timestamp')} 
                                            value={moment().format('YYYY-MM-DD HH:mm:ss')} 
                                        />
                                        
                                        {currentError.details && (
                                            <DetailRow 
                                                icon="code-outline" 
                                                label={t('details')} 
                                                value={JSON.stringify(currentError.details).substring(0, 50) + '...'} 
                                                valueColor="#6b7280"
                                            />
                                        )}
                                    </MotiView>
                                )} */}

                                {/* Enhanced Action Buttons */}
                                <MotiView
                                    from={{ opacity: 0, scale: showResults ? 1 : 0.9 }}
                                    animate={{ opacity: showResults ? 1 : 0, scale: showResults ? 1 : 0.9 }}
                                    transition={{ type: "timing", duration: 500, delay: 1000 }}
                                    className="flex-row gap-3"
                                >
                                    {isFailed && (
                                        <>
                                            <Button
                                                label={t('tryAgain')}
                                                startContent={<Icon name="refresh" size={18} color="#fff" />}
                                                color="primary"
                                                className="flex-1"
                                                onPress={handleRetry}
                                            />
                                            <Button
                                                label={t('exit')}
                                                startContent={<Icon name="arrow-back" size={18} color="#6b7280" />}
                                                color="secondary"
                                                className="flex-1"
                                                onPress={() => router.back()}
                                            />
                                        </>
                                    )}
                                    
                                    {isSuccess && (
                                        <Button
                                            label={t('done')}
                                            color="primary"
                                            className="flex-1"
                                            onPress={() => router.back()}
                                        />
                                    )}
                                </MotiView>
                            </BlurCard>
                        </View>
                    </View>
                </MotiView>
            </View>

            {/* ============= Enhanced Bottom Sheet for Camera Scanning ============= */}
            <BottomSheetModalUi
                snapPoints={['40%']}
                bottomSheetRef={bottomSheetRef}
                enablePanDownToClose={false}
            >
                <View className="flex-1 items-center justify-center px-6 ">
                    <View className="items-center">
                        {/* <Scanning 
                            size={50}
                            strokeWidth={2}
                            isLoading={scanState === 'scanning' || scanState === 'processing'}
                            isFailed={scanState === 'failed' || scanState === 'error'}
                            isSuccess={scanState === 'success'}
                            progress={scanState === 'processing' ? 100 : 0}
                            scanState={scanState}
                            duration={1200}
                            color="#007AFF"
                        /> */}
                        <Scanning 
                            size={50}
                            strokeWidth={2}
                            scanState={scanState}
                            duration={1200}
                            color="#007AFF"
                            successColor="#4CD964"
                            failedColor="#FF6B6B"
                        />
                        <Text className="dark:text-zinc-200 text-zinc-700 text-xl font-bold mt-4">
                            {getScanStatusMessage()}
                        </Text>
                        
                        <Text className="dark:text-zinc-400 text-zinc-600 text-center text-base mt-2 max-w-[280px] leading-5">
                            {scanState === 'scanning' && (t('detectingQRDesc') || 'Hold steady while we detect the QR code...')}
                            {scanState === 'processing' && (t('desc.validatingDataDesc') || 'Connecting to server and validating your data...')}
                            {scanState === 'success' && (t('desc.attendanceSuccess'))}
                        </Text>
                        
                        {/* Enhanced Progress Indicator */}
                        {scanState === 'processing' && (
                            <View className="flex-row gap-1 mt-4">
                                {[0, 1, 2, 3].map((i) => (
                                    <MotiView
                                        key={i}
                                        from={{ scale: 0.6, opacity: 0.3 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: 'timing',
                                            duration: 800,
                                            delay: i * 150,
                                            loop: true,
                                            repeatReverse: true,
                                        }}
                                        className="w-2 h-2 bg-blue-600 rounded-full"
                                    />
                                ))}
                            </View>
                        )}

                        {/* Connection Status Indicator */}
                        <View className="mt-4 flex-row items-center gap-2">
                            <View className={`w-2 h-2 rounded-full ${scanState === 'processing' ? 'bg-green-500' : 'bg-secondary'}`} />
                            <Text className="text-zinc-500 text-sm">
                                {scanState === 'processing' ? t('connected') : t('ready')}
                            </Text>
                        </View>
                    </View>
                </View>
            </BottomSheetModalUi>
        </>
    );
};

// ============= Enhanced Helper Component =============
const DetailRow: React.FC<{
    icon: string;
    label: string;
    value: string;
    valueColor?: string;
}> = ({ icon, label, value, valueColor }) => (
    <View className="flex-row items-center gap-3 border-b border-zinc-200 dark:border-zinc-700 last:border-b-0">
        <View className="flex-row items-center gap-3 flex-1">
            <View className="p-2 rounded-lg bg-zinc-100/30 dark:bg-zinc-800/50 items-center justify-center">
                <Ionicons name={icon as any} size={16} color="#6b7280" />
            </View>
            <Text className="text-zinc-700 dark:text-zinc-200 font-normal text-base">{label}</Text>
        </View>
        <Text 
            className="text-zinc-600 dark:text-zinc-400 font-normal text-right text-base flex-1" 
            style={{ color: valueColor || (Platform.OS === 'ios' ? '#6b7280' : '#6b7280') }}
        >
            {value}
        </Text>
    </View>
);

export default Scan;

// ============= Enhanced Styles =============
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
});