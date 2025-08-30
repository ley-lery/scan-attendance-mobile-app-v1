/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, BottomSheetModalUi, Button, Icon, Scanning, Text, useDisclosure } from "@/godui";
import { useGetLocationStore } from "@/stores/useGetLocationStore";
import { useUserStore } from "@/stores/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { Audio } from "expo-av";
import { CameraView, PermissionStatus, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import moment from "moment";
import { MotiView } from "moti";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

const SCHOOL_LOCATION = {

    // work location
    latitude: 13.369507133489616,
    longitude: 103.8658975460337,

    // home loaction
    // latitude : 13.353555915704485, 
    // longitude : 104.00318244982763
};

const MAX_DISTANCE_METERS = 50;

// ============= Enhanced State Management =============
type ScanState = 'idle' | 'scanning' | 'processing' | 'success' | 'failed' | 'error';
type ScanMethod = 'camera' | 'upload';

// ============= Enhanced Sound Configuration =============
const SOUND_CONFIG = {
    success: {
        file: require("../../assets/sounds/success-chime.mp3"),
        volume: 0.8,
        description: "Success chime for attendance recorded"
    },
    failed: {
        file: require("../../assets/sounds/error-beep.mp3"),
        volume: 0.5,
        description: "Error buzz for failed scans"
    },
};

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
        // Basic QR validation
        if (!qrData || qrData.trim().length === 0) {
            throw new Error("Invalid QR code data");
        }
        
        // Here you can add your QR validation logic
        // For example, check if it's a valid format, contains expected data, etc.
        
        return { success: true, data: qrData };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Failed to process QR code" 
        };
    }
};

// ============= Enhanced QR Detection from Image =============
const detectQRFromImage = async (imageUri: string): Promise<{ success: boolean; data?: string; error?: string }> => {
    // console.log(imageUri, 'imageUri from detectQRFromImage');
    try {
        // In a real implementation, you would use a QR detection library like:
        // - react-native-qrcode-scanner
        // - expo-barcode-scanner with image processing
        // - A custom ML model
        
        // For this example, we'll simulate QR detection
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock QR detection - in reality this would process the image
        const mockQRData = "ATTENDANCE_SESSION_001_" + Date.now();


        // const res = await processQRCode(imageUri);
        
        return { success: true, data: mockQRData };
    } catch (error) {
        return { 
            success: false, 
            error: "Failed to detect QR code in image" 
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
    const uploadModal = useModalState();
    
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const uploadSheetRef = useRef<BottomSheetModal>(null);
    
    // ============= Core States =============
    const userData = useUserStore((state) => state.users) as any;
    const [permission, requestPermission] = useCameraPermissions();
    const [scanState, setScanState] = useState<ScanState>('idle');
    const [scanMethod, setScanMethod] = useState<ScanMethod>('camera');
    const [showCamera, setShowCamera] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [attendanceData, setAttendanceData] = useState<any>(null);
    const [zoom, setZoom] = useState(0);
    const [flashEnabled, setFlashEnabled] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    
    // ============= Enhanced Sound System =============
    const sounds = useRef<{ [key: string]: Audio.Sound }>({});
    const soundLoaded = useRef<{ [key: string]: boolean }>({});
    
    const qrLock = useRef(false);
    const processingTimeout = useRef<NodeJS.Timeout>(null);
    
    const getLocation = useGetLocationStore((state: any) => state.location);

    // ============= Computed Values =============
    const isLoading = scanState === 'scanning' || scanState === 'processing';
    const isSuccess = scanState === 'success';
    const isFailed = scanState === 'failed' || scanState === 'error';
    const showResults = isSuccess || isFailed;

    // ============= Enhanced Sound Management =============
    const loadSounds = async () => {
        try {
            for (const [soundName, config] of Object.entries(SOUND_CONFIG)) {
                const sound = new Audio.Sound();
                await sound.loadAsync(config.file);
                await sound.setVolumeAsync(config.volume);
                sounds.current[soundName] = sound;
                soundLoaded.current[soundName] = true;
            }
        } catch (error) {
            console.warn("Failed to load sounds:", error);
        }
    };

    const playSound = async (soundName: keyof typeof SOUND_CONFIG) => {
        if (!soundEnabled || !soundLoaded.current[soundName]) return;
        
        try {
            const sound = sounds.current[soundName];
            if (sound) {
                await sound.replayAsync();
            }
        } catch (error) {
            console.warn(`Failed to play ${soundName} sound:`, error);
        }
    };

    const toggleSound = useCallback(() => {
        setSoundEnabled(!soundEnabled);
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    }, [soundEnabled]);

    // ============= Load sounds on component mount =============
    useEffect(() => {
        loadSounds();
        return () => {
            Object.values(sounds.current).forEach(sound => {
                sound.unloadAsync().catch(() => {});
            });
        };
    }, []);

    // ============= Enhanced QR Upload Functions =============
    const handleImageUpload = useCallback(async () => {
        setShowCamera(false);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            
            if (!result.canceled && result.assets[0]) {
                uploadModal.onClose();
                await processUploadedQR(result.assets[0].uri, 'image');
            }
            setShowCamera(true);
        } catch (error) {
            setErrorMessage(t('error.imageUploadFailed') || "Failed to upload image");
            setScanState('failed');
            playSound('failed');
            setShowCamera(true);
        }
    }, []);

    const handleFileUpload = useCallback(async () => {
        setShowCamera(false);
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*'],
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets[0]) {
                uploadModal.onClose();
                await processUploadedQR(result.assets[0].uri, 'file');
            }
            setShowCamera(true);
        } catch (error) {
            setErrorMessage(t('error.fileUploadFailed') || "Failed to upload file");
            setScanState('failed');
            playSound('failed');
            setShowCamera(true);
        }
    }, []);

    const processUploadedQR = useCallback(async (uri: string, type: 'image' | 'file') => {
        setScanMethod('upload');
        setScanState('scanning');
        uploadSheetRef.current?.present();
        setUploadProgress(0);
        
        try {
            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
                setUploadProgress(i);
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            setScanState('processing');
            
            // Process QR from image
            const qrResult = await detectQRFromImage(uri);
            // console.log(JSON.stringify(qrResult, null, 2), 'qrResult from upload image');
            
            if (!qrResult.success || !qrResult.data) {
                throw new Error(qrResult.error || "No QR code detected in image");
            }
            
            // Process the QR data
            const processResult = await processQRCode(qrResult.data);
            
            if (!processResult.success) {
                throw new Error(processResult.error || "Invalid QR code");
            }
            
            // Continue with normal attendance flow
            await handleQRData(qrResult.data);
            
        } catch (error) {
            setScanState('failed');
            setErrorMessage(error instanceof Error ? error.message : "Upload processing failed");
            playSound('failed');
            
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        }
    }, []);

    // ============= Enhanced QR Data Processing =============
    const handleQRData = useCallback(async (qrData: string) => {
        setScanState('processing');
        try {
            // Simulate API call delay with progress updates
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await axios.get(qrData)
            const data = res.data.data.rows
            
            // // Mock API response
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
            
            const studentData = data.find(
                (item: any) => item.student_code === userData?.student_code
            );
            
            if (!studentData) {
                setScanState('error');
                notFoundModal.onOpen();
                setTimeout(resetScanner, 3000);
                playSound('failed');
                return;
            }

            // fix parameters for create attendance
            const field = {
                student: studentData.student_name_en,
                subject: "Web Development",
                session: 1,
                status: "Present",
                date: moment().format("YYYY-MM-DD"),
                time: moment().format("HH:mm:ss"),
                scan_method: scanMethod,
            }
            
            // Simulate attendance creation
            await createAttendance(field);
            setAttendanceData(field);
            setScanState('success');
            
            // Enhanced success feedback
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            playSound('success');
        } catch (error) {
            setScanState('failed');
            setErrorMessage(t('error.scanFailed') || "សូមសាកល្បងម្តងទៀត...");
            
            if (Platform.OS !== 'web') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
            playSound('failed');
            resetScanner();
        }
    }, [userData, t]);

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
                    uploadSheetRef.current?.dismiss();
                }, 1000);
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
        setErrorMessage("");
        setAttendanceData(null);
        setUploadProgress(0);
        bottomSheetRef.current?.dismiss();
        uploadSheetRef.current?.dismiss();
    }, []);

    // ============= Enhanced QR Scanning =============
    const handleBarcodeScanned = useCallback(
        async (data: any) => {
            if (qrLock.current || !data?.data || scanState !== 'idle') return;

            qrLock.current = true;
            setScanMethod('camera');
            setScanState('scanning');
            setShowCamera(false);

            // Enhanced processing with better UX
            setTimeout(async () => {
                setScanState('processing');
                await handleQRData(data.data);
            }, 800);
        },
        [scanState, userData, resetScanner, t]
    );

    // ============= Create attendance =============
    const createAttendance = useCallback(async (studentData: any) => {
        const payload = {
            student: studentData.student_name_en,
            session: 1,
            status: "Present",
            scan_time: moment().format("YYYY-MM-DD HH:mm:ss"),
            scan_method: scanMethod,
        };
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log("Attendance created:", payload);
            setAttendanceData(payload);
        } catch (error) {
            throw error;
        }
    }, [scanMethod]);

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

    // ============= Upload Methods =============
    const showUploadOptions = useCallback(() => {
        uploadModal.onOpen();
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    }, []);

    // ============= Permission UI =============
    if (!permission) {
        // return (
        //     <View className="flex-1 items-center justify-center bg-zinc-900">
        //         <Text className="text-white text-sm font-bold mt-4">Requesting camera permission...</Text>
        //     </View>
        // );
        return null;
    }

    if (permission.status !== PermissionStatus.GRANTED) {
        return (
            <View className="flex-1 items-center justify-center dark:bg-zinc-900 bg-zinc-100">
                <Ionicons name="camera-outline" size={64} color="#6b7280" />
                <Text className="text-white text-xl font-bold mt-4">
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
                return scanMethod === 'upload' ? t('processingImage') : t('detectingQR');
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

            {/* Upload Options Alert */}
            <Alert
                visible={uploadModal.isOpen}
                title={t("uploadQRCode")}
                message={t("chooseUploadMethod")}
                onConfirm={handleImageUpload}
                onCancel={handleFileUpload}
                confirmText={t("fromGallery")}
                cancelText={t("fromFiles")}
            />

            <View style={styles.container} className="bg-zinc-100 dark:bg-zinc-900">
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
                    <View style={StyleSheet.absoluteFillObject} className="bg-zinc-100 dark:bg-zinc-900 items-center justify-center">
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
                                        className="absolute left-0 right-0 h-1 bg-zinc-500/60"
                                        style={{ top: '50%' }}
                                    />
                                )}
                                
                                {/* Upload Placeholder */}
                                {scanMethod === 'upload' && (
                                    <View className="absolute inset-0 bg-zinc-800 items-center justify-center">
                                        <Ionicons name="cloud-upload-outline" size={48} color="#6b7280" />
                                        <Text className="text-zinc-400 mt-2 font-medium">
                                            {t('uploadMode')}
                                        </Text>
                                    </View>
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
                    <View className="absolute bottom-8 left-6 right-6">
                        {/* Primary Controls */}
                        <View className="flex-row justify-between items-center mb-4">
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
                            
                            {/* Upload Button */}
                            <TouchableOpacity
                                onPress={showUploadOptions}
                                disabled={isLoading}
                                className="bg-blue-500/20 rounded-full px-4 py-3 flex-row items-center gap-2 border border-blue-500/40"
                            >
                                <Ionicons name="cloud-upload-outline" size={20} color="#60a5fa" />
                                <Text className="text-blue-300 font-medium">
                                    {t('upload')}
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
                    <View className="w-full bg-zinc-800/90 backdrop-blur rounded-3xl p-4 shadow-2xl">
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
                            
                            {/* Method Badge */}
                            <View className={`${scanMethod === 'upload' ? 'bg-blue-500/20 border-blue-500/40' : 'bg-green-500/20 border-green-500/40'} rounded-full px-3 py-1 border mb-2`}>
                                <Text className={`${scanMethod === 'upload' ? 'text-blue-300' : 'text-green-300'} text-sm font-medium`}>
                                    {scanMethod === 'upload' ? t('uploadedQR') : t('scannedQR')}
                                </Text>
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
                                <DetailRow icon="book-outline" label={t('subject')} value={attendanceData.subject || 'N/A'} />
                                <DetailRow icon="calendar-outline" label={t('date')} value={attendanceData.date || 'N/A'} />
                                <DetailRow icon="time-outline" label={t('time')} value={attendanceData.time || 'N/A'} />
                                <DetailRow icon="location-outline" label={t('session')} value={attendanceData.session ? attendanceData.session.toString() : 'N/A'} />
                                <DetailRow 
                                    icon="checkmark-circle-outline" 
                                    label={t('status')} 
                                    value="Present" 
                                    valueColor="#4CD964"
                                />
                                <DetailRow 
                                    icon={scanMethod === 'upload' ? "cloud-upload-outline" : "qr-code-outline"}
                                    label={t('method')} 
                                    value={scanMethod === 'upload' ? t('uploaded') : t('camera')}
                                    valueColor="#60a5fa"
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
                                <>
                                    <Button
                                        label={t('tryAgain')}
                                        startContent={<Icon name="refresh" size={18} color="#fff" />}
                                        color="primary"
                                        className="flex-1"
                                        onPress={resetScanner}
                                    />
                                    <Button
                                        label={t('upload')}
                                        startContent={<Icon name="cloud-upload" size={18} color="#fff" />}
                                        color="secondary"
                                        className="flex-1"
                                        onPress={showUploadOptions}
                                    />
                                </>
                            )}
                            
                            {!isFailed && (
                                <Button
                                    label={t('done')}
                                    startContent={<Icon name="arrow-back" size={18} color="#fff" />}
                                    color="primary"
                                    className="flex-1"
                                    onPress={() => router.back()}
                                />
                            )}
                        </MotiView>
                    </View>
                </MotiView>
            </View>

            {/* ============= Bottom Sheet for Camera Scanning ============= */}
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

            {/* ============= Bottom Sheet for Upload Processing ============= */}
            <BottomSheetModalUi
                snapPoints={['40%']}
                bottomSheetRef={uploadSheetRef}
                enableDismissOnClose={false}
                enablePanDownToClose={false}
            >
                <View className="flex-1 items-center justify-center px-6">
                    <View className="items-center w-full">
                        {/* Upload Icon */}
                        <View className="bg-blue-500/20 rounded-2xl p-4 mb-4">
                            {/* <Ionicons name="cloud-upload-outline" size={40} color="#60a5fa" /> */}
                            <Scanning
                                size={40}
                                strokeWidth={2}
                                isLoading={scanState === 'scanning'}
                                isFailed={false}
                                isSuccess={scanState === 'processing' || scanState === 'success'}
                                progress={scanState === 'processing' ? 100 : 0}
                                duration={1200}
                                color="#007AFF"
                                successColor="#4CD964"
                                icons={{
                                    success: 'cloud-upload-outline',
                                    failed: 'close-outline',
                                }}
                            />
                        </View>
                        
                        <Text className="text-white text-xl font-bold mb-2">
                            {getScanStatusMessage()}
                        </Text>
                        
                        <Text className="text-zinc-400 text-center text-base mb-6 max-w-[250px] leading-5">
                            {scanState === 'scanning' && t('processingUploadedImage')}
                            {scanState === 'processing' && t('validatingQRData')}
                        </Text>
                        
                        {/* Upload Progress Bar */}
                        {scanState === 'scanning' && (
                            <View className="w-full mb-4">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-zinc-400 text-sm">{t('uploadProgress')}</Text>
                                    <Text className="text-zinc-400 text-sm">{uploadProgress}%</Text>
                                </View>
                                <View className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                                    <MotiView
                                        from={{ width: "0%" }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ type: "timing", duration: 100 }}
                                        className="h-full bg-blue-500 rounded-full"
                                    />
                                </View>
                            </View>
                        )}
                        
                        {/* Processing Animation */}
                        {scanState === 'processing' && (
                            <View className="flex-row gap-1">
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
                                        className="w-3 h-3 bg-blue-400 rounded-full"
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

// ============= Enhanced Helper Component =============
const DetailRow: React.FC<{
    icon: string;
    label: string;
    value: string;
    valueColor?: string;
}> = ({ icon, label, value, valueColor = "#d1d5db" }) => (
    <View className="flex-row items-center gap-2 py-1">
        <View className="flex-row items-center gap-2 flex-1">
            <Icon name={icon as any} size={18} color="#a1a1aa" />
            <Text className="text-zinc-600 dark:text-zinc-200 font-medium text-base">{label}:</Text>
        </View>
        <Text 
            className="text-zinc-600 dark:text-zinc-400 font-medium text-right text-base flex-1" 
            style={{ color: valueColor }}
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