/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, BottomSheetModalUi, Button, Icon, Scanning, Text, useDisclosure } from "@/godui";
import { useGetLocationStore } from "@/stores/useGetLocationStore";
import { useUserStore } from "@/stores/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import { CameraView, PermissionStatus, useCameraPermissions } from "expo-camera";
import * as Haptics from 'expo-haptics';
import { router } from "expo-router";
import moment from "moment";
import { MotiView } from "moti";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

// University location (for testing, use actual production values as needed)
const SCHOOL_LOCATION = {
    // latitude: 13.369507133489616,
    // longitude: 103.8658975460337,
    latitude : 13.353555915704485, 
    longitude : 104.00318244982763
};

const MAX_DISTANCE_METERS = 50;

// ============= Enhanced State Management =============
type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'failed' | 'error';

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

const Scan: React.FC = () => {
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    
    // ============= Modal States =============
    const locationModal = useModalState();
    const notFoundModal = useModalState();
    const scannedModal = useModalState();
    
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    
    // ============= Core States =============
    const userData = useUserStore((state) => state.users) as any;
    const [permission, requestPermission] = useCameraPermissions();
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [showCamera, setShowCamera] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [attendanceData, setAttendanceData] = useState<any>(null);
    const [zoom, setZoom] = useState(0);
    const [flashEnabled, setFlashEnabled] = useState(false);
    
    // ============= Audio Players =============
    const scanSoundPlayer = useAudioPlayer(require("../../assets/sounds/success-chime.mp3"));
    const successSoundPlayer = useAudioPlayer(require("../../assets/sounds/success-chime.mp3"));
    const failedSoundPlayer = useAudioPlayer(require("../../assets/sounds/success-chime.mp3"));
    
    const qrLock = useRef(false);
    const processingTimeout = useRef<NodeJS.Timeout>(null);
    
    const getLocation = useGetLocationStore((state: any) => state.location);

    // ============= Computed Values =============
    const isLoading = scanState === 'scanning' || scanState === 'processing';
    const isSuccess = scanState === 'success';
    const isFailed = scanState === 'failed' || scanState === 'error';
    const showResults = isSuccess || isFailed;


    const playSound = (sound: "scanning" | "success" | "failed") => {
        try {
            switch (sound) {
                case 'scanning':
                    scanSoundPlayer.play();
                    break;
                case 'success':
                    successSoundPlayer.play();
                    break;
                case 'failed':
                    failedSoundPlayer.play();
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }


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
                bottomSheetRef.current?.present();
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
                // Auto-dismiss bottom sheet and show results after delay
                setTimeout(() => {
                    bottomSheetRef.current?.dismiss();
                }, 1000);
                break;
        }
    }, [scanState]);

    // ============= Enhanced Reset Function =============
    const resetScanner = useCallback(() => {
        if (processingTimeout.current) {
            clearTimeout(processingTimeout.current);
        }
        
        qrLock.current = false;
        setScanState('idle');
        setShowCamera(true);
        setErrorMessage("");
        setAttendanceData(null);
        bottomSheetRef.current?.dismiss();
    }, []);

    // ============= Enhanced QR Scanning =============
    const handleBarcodeScanned = useCallback(
        async (data: any) => {
            if (qrLock.current || !data?.data || scanState !== 'idle') return;

            qrLock.current = true;
            setScanState('scanning');
            setShowCamera(false);

            // Simulate processing delay with better UX
            setTimeout(async () => {
                setScanState('processing');
                
                try {
                    // Simulate API call delay
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Mock API response
                    const mockResponse = {
                        data: {
                            data: {
                                rows: [
                                    {
                                        id: 1,
                                        student_code: "STU224466",
                                        name: "John Doe",
                                        email: "student@university.edu",
                                        role: "student",
                                        department: "Computer Science",
                                        subject: "Web Development",
                                        session: 1,
                                        date: "2023-06-01",
                                        time: "10:00 AM",
                                        is_scanned: 0,
                                    },
                                ],
                            },
                        },
                    };
                    
                    const rows = mockResponse.data.data.rows;
                    const studentData = rows.find(
                        (item: any) => item.student_code === userData?.student_code
                    );
                    
                    if (!studentData) {
                        setScanState('error');
                        notFoundModal.onOpen();
                        setTimeout(resetScanner, 3000);
                        return;
                    }
                    
                    // Simulate attendance creation
                    await createAttendance(studentData);
                    setAttendanceData(studentData);
                    setScanState('success');
                    
                    // Add success haptic feedback
                    if (Platform.OS !== 'web') {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                    playSound("success");
                    
                } catch (error) {
                    setScanState('failed');
                    setErrorMessage(t('error.scanFailed') || "សូមសាកល្បងម្តងទៀត...");
                    
                    // Add error haptic feedback
                    if (Platform.OS !== 'web') {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                    }
                    playSound("failed");
                }
            }, 800); // Initial scanning feedback delay
        },
        [scanState, userData, resetScanner, t]
    );

    // ============= Create attendance =============
    const createAttendance = useCallback(async (studentData: any) => {
        const payload = {
            student: studentData.id,
            session: studentData.session,
            status: "Present",
            scan_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log("Attendance created:", payload);
        } catch (error) {
            throw error;
        }
    }, []);

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
            }, 5000); // Auto reset after 5 seconds
            
            return () => clearTimeout(timer);
        }
    }, [scanState, resetScanner]);

    // ============= Permission UI =============
    if (!permission) {
        return (
            <View style={styles.centered}>
                <Scanning size={40} />
                <Text style={{ marginTop: 16 }}>Requesting camera permission...</Text>
            </View>
        );
    }

    if (permission.status !== PermissionStatus.GRANTED) {
        return (
            <View style={[styles.centered, { backgroundColor: "#1d1d1d" }]}>
                <Ionicons name="camera-outline" size={64} color="#6b7280" style={{ marginBottom: 24 }} />
                <Text style={{ color: "#fff", marginBottom: 8, fontSize: 20, fontWeight: 'bold' }}>
                    {t('cameraPermissionRequired')}
                </Text>
                <Text style={{ color: "#9ca3af", marginBottom: 24, textAlign: 'center', paddingHorizontal: 32 }}>
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
                return t('detectingQR');
            case 'processing':
                return t('validatingData');
            case 'success':
                return t('attendanceRecorded');
            case 'failed':
                return t('scanFailed');
            case 'error':
                return t('dataNotFound');
            default:
                return t('scanning');
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
                    resetScanner();
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

            <View style={styles.container} className="bg-zinc-900">
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
                    <View style={StyleSheet.absoluteFillObject} className="bg-zinc-900 items-center justify-center">
                        {/* Scanning Frame */}
                        <MotiView
                            from={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "timing", duration: 600, delay: 200 }}
                            className="relative"
                        >
                            {/* Camera View */}
                            <View className="w-72 h-72 rounded-3xl overflow-hidden border-2 border-zinc-800 relative">
                                {showCamera && userData?.is_scanned !== 1 && scanState === 'idle' && (
                                    <CameraView
                                        zoom={zoom}
                                        facing="back"
                                        flash={flashEnabled ? 'on' : 'off'}
                                        onBarcodeScanned={handleBarcodeScanned}
                                        style={{ width: "100%", height: "100%" }}
                                    />
                                )}
                                
                                {/* Scanning Overlay */}
                                {scanState === 'idle' && (
                                    <MotiView
                                        from={{ translateY: -100 }}
                                        animate={{ translateY: 100 }}
                                        transition={{
                                            type: 'timing',
                                            duration: 2000,
                                            loop: true,
                                            repeatReverse: true,
                                        }}
                                        className="absolute left-0 right-0 h-1 bg-zinc-500/60"
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
                            <Text className="text-white text-center mt-4 text-base font-medium">
                                {scanState === 'idle' ? t('pointCameraToQR') : getScanStatusMessage()}
                            </Text>
                        </MotiView>
                    </View>

                    {/* Header */}
                    <View className="absolute left-6 top-12 right-6 flex-row justify-between items-center z-30">
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="bg-black/30 rounded-full p-3"
                        >
                            <Ionicons name="chevron-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        
                        <Text className="text-white text-lg font-semibold">
                            {t('scanAttendance')}
                        </Text>
                        
                        <View className="w-12" />
                    </View>

                    {/* Enhanced Control Bar */}
                    <View className="absolute bottom-8 left-6 right-6 flex-row justify-between items-center">
                        {/* Flash Toggle */}
                        <TouchableOpacity 
                            onPress={toggleFlash}
                            className={`${flashEnabled ? 'bg-yellow-500/20' : 'bg-white/10'} rounded-full px-4 py-3 flex-row items-center gap-2 border ${flashEnabled ? 'border-yellow-500/40' : 'border-white/20'}`}
                        >
                            <Ionicons 
                                name={flashEnabled ? "flash" : "flash-off"} 
                                size={20} 
                                color={flashEnabled ? "#fbbf24" : "#fff"} 
                            />
                            <Text className={`${flashEnabled ? 'text-yellow-300' : 'text-white'} font-medium`}>
                                {t('flash')}
                            </Text>
                        </TouchableOpacity>
                        
                        {/* Zoom Controls */}
                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity
                                onPress={() => handleZoom("out")}
                                disabled={zoom <= 0}
                                className={`${zoom <= 0 ? 'bg-white/5' : 'bg-white/10'} rounded-full p-3 border border-white/20`}
                            >
                                <Ionicons name="remove" size={20} color={zoom <= 0 ? "#6b7280" : "#fff"} />
                            </TouchableOpacity>
                            
                            <Text className="text-white font-mono text-sm min-w-[40px] text-center">
                                {Math.round(zoom * 100)}%
                            </Text>
                            
                            <TouchableOpacity
                                onPress={() => handleZoom("in")}
                                disabled={zoom >= 1}
                                className={`${zoom >= 1 ? 'bg-white/5' : 'bg-white/10'} rounded-full p-3 border border-white/20`}
                            >
                                <Ionicons name="add" size={20} color={zoom >= 1 ? "#6b7280" : "#fff"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </MotiView>

                {/* ============= Results Section ============= */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9, translateY: 50 }}
                    animate={{
                        opacity: showResults ? 1 : 0,
                        scale: showResults ? 1 : 0.9,
                        translateY: showResults ? 0 : 50,
                    }}
                    transition={{
                        type: "timing",
                        duration: 600,
                        delay: showResults ? 200 : 0,
                    }}
                    pointerEvents={showResults ? "auto" : "none"}
                    className="absolute inset-0 flex-1 justify-center items-center px-6 bg-zinc-900"
                >
                    <View className="w-full bg-zinc-800/90 backdrop-blur rounded-3xl p-4 shadow-2xl ">
                        {/* Status Icon */}
                        <View className="items-center mb-6">
                            <View className="bg-zinc-900 rounded-2xl p-4 mb-4 shadow-lg">
                                <Scanning 
                                    size={40}
                                    strokeWidth={2}
                                    isLoading={false}
                                    isFailed={isFailed}
                                    isSuccess={isSuccess}
                                    progress={100}
                                    duration={1000}
                                    successColor="#4CD964"
                                    failedColor="#FF6B6B"
                                />
                            </View>
                            
                            <Text className="text-2xl font-bold text-white mb-2">
                                {isSuccess ? t('attendanceRecorded') : t('scanFailed')}
                            </Text>
                            
                            <Text className="text-zinc-400 text-center text-base leading-5">
                                {isSuccess 
                                    ? t('desc.attendanceSuccess') 
                                    : errorMessage || t('desc.scanError')
                                }
                            </Text>
                        </View>

                        {/* Attendance Details (Success Only) */}
                        {isSuccess && attendanceData && (
                            <MotiView
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ type: "timing", duration: 500, delay: 800 }}
                                className="bg-black rounded-lg p-4 mb-6 gap-1"
                            >
                                <DetailRow icon="book-outline" label={t('subject')} value={attendanceData.subject} />
                                <DetailRow icon="calendar-outline" label={t('date')} value={attendanceData.date} />
                                <DetailRow icon="time-outline" label={t('time')} value={attendanceData.time} />
                                <DetailRow icon="location-outline" label={t('session')} value={attendanceData.session.toString()} />
                                <DetailRow 
                                    icon="checkmark-circle-outline" 
                                    label={t('status')} 
                                    value="Present" 
                                    valueColor="#4CD964"
                                />
                            </MotiView>
                        )}

                        {/* Action Buttons */}
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: "timing", duration: 500, delay: 1000 }}
                            className="flex-row gap-3"
                        >
                            {isFailed && (
                                <Button
                                    label={t('tryAgain')}
                                    startContent={<Icon name="refresh" size={18} color="#fff" />}
                                    color="primary"
                                    className="flex-1"
                                    onPress={resetScanner}
                                />
                            )}
                            
                            <Button
                                label={t('done')}
                                startContent={<Icon name="arrow-back" size={18} color="#fff" />}
                                color="primary"
                                className="flex-1"
                                onPress={() => router.back()}
                            />
                        </MotiView>
                    </View>
                </MotiView>
            </View>

            {/* ============= Bottom Sheet for Scanning Process ============= */}
            <BottomSheetModalUi
                snapPoints={['35%']}
                bottomSheetRef={bottomSheetRef}
                enableDismissOnClose={false}
                enablePanDownToClose={false}
            >
                <View className="flex-1 items-center justify-center px-6">
                    <View className="items-center">
                        <Scanning 
                            size={50}
                            strokeWidth={2}
                            isLoading={scanState === 'scanning'}
                            isFailed={false}
                            isSuccess={scanState === 'processing' || scanState === 'success'}
                            progress={scanState === 'processing' ? 100 : 0}
                            duration={1200}
                            color="#007AFF"
                            successColor="#4CD964"
                        />
                        
                        <Text className="text-white text-xl font-bold mt-4">
                            {getScanStatusMessage()}
                        </Text>
                        
                        <Text className="text-zinc-400 text-center text-base mt-2 max-w-[250px] leading-5">
                            {scanState === 'scanning' && t('detectingQR')}
                            {scanState === 'processing' && t('validatingData')}
                        </Text>
                        
                        {/* Progress Indicator */}
                        {scanState === 'processing' && (
                            <View className="flex-row gap-1 mt-4">
                                {[0, 1, 2].map((i) => (
                                    <MotiView
                                        key={i}
                                        from={{ scale: 0.8, opacity: 0.5 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: 'timing',
                                            duration: 600,
                                            delay: i * 200,
                                            loop: true,
                                            repeatReverse: true,
                                        }}
                                        className="w-2 h-2 bg-blue-500 rounded-full"
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </BottomSheetModalUi>
        </>
    );
};

// ============= Helper Component =============
const DetailRow: React.FC<{
    icon: string;
    label: string;
    value: string;
    valueColor?: string;
}> = ({ icon, label, value, valueColor = "#d1d5db" }) => (
    <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-2">
            <Icon name={icon as any} size={18} color="#a1a1aa" />
            <Text className="text-zinc-600 dark:text-zinc-200 font-medium text-base">{label} : </Text>
        </View>
        <Text className="text-zinc-600 dark:text-zinc-400 font-medium text-left text-base" style={{ color: valueColor }}>
            {value}
        </Text>
    </View>
);

export default Scan;

// ============= Styles =============
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