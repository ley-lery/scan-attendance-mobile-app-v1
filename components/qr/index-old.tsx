/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, BottomSheetModalUi, Button, Icon, Scanning, Text, useDisclosure } from "@/godui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CameraView, PermissionStatus, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

import { useGetLocationStore } from "@/stores/useGetLocationStore";
import { useUserStore } from "@/stores/userStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useIsFocused } from "@react-navigation/native";
import { MotiView } from "moti";
import { useTranslation } from "react-i18next";

// University location (for testing, use actual production values as needed)
const SCHOOL_LOCATION = {
    // university location
    // latitude: 13.348010021048202,
    // longitude: 103.84643969715052,

    // test current location
    latitude: 13.369507133489616,
    longitude: 103.8658975460337,
};

const MAX_DISTANCE_METERS = 50;

// ============= Utility function =============
const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const useNotFoundData = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return { 
        isOpenNotFound : isOpen,
        onOpenNotFound : onOpen,
        onCloseNotFound : onClose,
    };
};
const useIsScannedData = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return { 
        isOpenIsScanned : isOpen,
        onOpenIsScanned : onOpen,
        onCloseIsScanned : onClose,
    };
};

const Scan: React.FC = () => {
    // ============= Translation hook =============
    const { t } = useTranslation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpenNotFound, onOpenNotFound, onCloseNotFound } = useNotFoundData();
    const { isOpenIsScanned, onOpenIsScanned, onCloseIsScanned } = useIsScannedData();
    const isFocused = useIsFocused();
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    // ============= State and refs =============
    const userData = useUserStore((state) => state.users) as any;
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [isScanned, setIsScanned] = useState(false);
    const [showCamera, setShowCamera] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [zoom, setZoom] = useState(0);
    const [showDetail, setShowDetail] = useState(false);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
    if (success || failed) {
        const timer = setTimeout(() => {
        setShowResult(true);
        bottomSheetRef.current?.dismiss();
        }, 3000);

        return () => clearTimeout(timer);
    }
    }, [success, failed]);


    const qrLock = useRef(false);

    const getLocation = useGetLocationStore((state: any) => state.location);

    // ============= Effect: Validate location and user scanning status =============
    useEffect(() => {
        if (!userData) return;
        const distance = getDistanceInMeters(
            getLocation.latitude,
            getLocation.longitude,
            SCHOOL_LOCATION.latitude,
            SCHOOL_LOCATION.longitude
        );
        if (distance > MAX_DISTANCE_METERS) {
            setShowCamera(false);
            onOpen();
            return;
        }
        if (userData?.is_scanned === 1) {
            onOpenIsScanned();
            return;
        }
    }, [userData, getLocation]);

    // ============= Effect: Camera permission request =============
    useEffect(() => {
        if (permission?.status !== PermissionStatus.GRANTED) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    // ============= Effect: App state change (reset scanner when app comes to foreground) =============
    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active") resetScanner();
        });
        return () => subscription.remove();
    }, []);

    // ============= Reset QR scanner state =============
    const resetScanner = useCallback(() => {
        qrLock.current = false;
        setIsScanned(false);
        setShowCamera(true);
        setErrorMessage("");
        setSuccess(false);
        setFilteredData([]);
        setShowDetail(false);
        setFailed(false);
    }, []);

    // ============= Handle barcode scanned =============
    const handleBarcodeScanned = useCallback(
        async (data: any) => {
            if (isScanned || qrLock.current || !data?.data) return;

            qrLock.current = true;
            setIsScanned(true);
            setShowCamera(false);
            setLoading(true);
            setShowDetail(false); // Hide detail while scanning
            bottomSheetRef.current?.present();

            setTimeout(async () => {
                try {
                    // const res = await axios.get(data.data);

                    // Mock data or Fake API response
                    const res = {
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
                                        is_scanned: 0,
                                    },
                                    {
                                        id: 2,
                                        student_code: "STU888888",
                                        name: "John Doe",
                                        email: "student@university.edu",
                                        role: "student",
                                        department: "Computer Science",
                                        is_scanned: 0,
                                    },
                                ],
                            },
                        },
                    };
                    const rows = res.data.data.rows;
                    const filtered = rows.filter(
                        (item: any) => item.student_code === userData?.student_code
                    );
                    if (filtered.length === 0) {
                        onOpenNotFound();
                        setLoading(false);
                        return;
                    }
                    await createAttendance(filtered[0]);
                    setFilteredData(filtered);
                    setSuccess(true);
                    setFailed(false);
                    setLoading(false);
                    setTimeout(() => {
                        setShowDetail(true);
                    }, 100);
                } catch (error) {
                    setErrorMessage("សូមសាកល្បងម្តងទៀត...");
                    setTimeout(resetScanner, 2000);
                    setLoading(false);
                }
            }, 2000); // Faster feedback: 2s scanning
        },
        [isScanned, userData, resetScanner]
    );

    // ============= Create attendance (mocked for now) =============
    const createAttendance = useCallback(async (data: any) => {
        const payload = {
            student: data.id,
            session: data.session,
            turn: data.turn,
            status: "Present",
            scan_time: moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        try {
            // await axios.post(`${api}/attendance/create`, payload);
            // Here you might want to update user store to reflect attendance status
            // e.g. setUser({ ...userData, is_scanned: 1 })
            // console.log("Attendance sent successfully", JSON.stringify(payload, null, 2));
        } catch (error) {
            // console.error("Attendance error:", error);
        }
    }, []);

    // handle zoom in and zoom out
    const handleZoom = useCallback((direction: "in" | "out") => {
        setZoom((prevZoom) => {
            if (direction === "in") {
                return Math.min(prevZoom + 0.1, 1); // Max zoom level
            } else {
                return Math.max(prevZoom - 0.1, 0); // Min zoom level
            }
        });
    }, []);

    // ============= UI permission handling =============
    if (!permission) {
        return (
            <View style={styles.centered}>
                <Text>Requesting camera permission...</Text>
            </View>
        );
    }
    if (permission.status !== PermissionStatus.GRANTED) {
        return (
            <View style={[styles.centered, { backgroundColor: "#1d1d1d" }]}>
                <Text style={{ color: "#fff", marginBottom: 16, fontSize: 18 }}>
                    Camera access is required.
                </Text>
                <TouchableOpacity onPress={requestPermission}>
                    <Text style={{ color: "#3b82f6", textDecorationLine: "underline" }}>
                        Grant Permission
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ============= Main render =============
    return (
        <>
            <Alert
                visible={isOpen}
                title={t("invalidLocation")}
                message={t("checkYourLocation")}
                onConfirm={() => router.replace("../(student)/location")}
                onCancel={() => router.back()}
                confirmText={t("check")}
                cancelText={t("back")}
            />
            <Alert
                icon={<Ionicons name="alert-circle-outline" size={34} color="#db2777" />}
                visible={isOpenNotFound}
                title={t("notFound")}
                message={t("desc.studentNotFoundDesc")}
                onConfirm={onCloseNotFound}
                confirmText={t("ok")}
            />
            <Alert
                icon={<Ionicons name="alert-circle-outline" size={34} color="#db2777" />}
                visible={isOpenIsScanned}
                title={t("scanned")}
                message={t("desc.studentScannedDesc")}
                onConfirm={onCloseIsScanned}
                confirmText={t("ok")}
            />
            <View style={styles.container} className="bg-zinc-900 text-pink-600">
                <MotiView 
                    from={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: showDetail ? 0 : 1, scale: showDetail ? 0 : 1 }}
                    transition={{ type: "timing", duration: 400 }}
                    pointerEvents={loading || success ? "none" : "auto"} className="flex-1">
                    {/* Camera View */}
                    <View
                        style={StyleSheet.absoluteFillObject}
                        className="bg-light dark:bg-dark items-center justify-center "
                    >
                        <View className="w-60 h-60 rounded-[3rem] overflow-hidden border border-zinc-200/10">
                            {showCamera && userData?.is_scanned !== 1 && (
                                <CameraView
                                    zoom={zoom}
                                    facing="back"
                                    onBarcodeScanned={handleBarcodeScanned}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            )}
                        </View>
                    </View>

                    {/* Top right close button */}
                    <View className="absolute left-6 top-10 z-30">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom action bar */}
                    <View className="absolute bottom-4 left-0 right-0 flex-row justify-between items-center flex-1 gap-20 bg-transparent rounded-full p-4">
                        <TouchableOpacity className="bg-gray-200/10 rounded-full px-6 py-2 flex-row items-center gap-2 border border-gray-200/10">
                            <Ionicons name="flash" size={22} color="#fff" />
                            <Text className="text-black dark:text-white font-mmedium">បើក ពិល</Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center gap-2 ">
                            <TouchableOpacity
                                onPress={() => {
                                    if (zoom < 1) handleZoom("in");
                                }}
                                className="bg-gray-200/10 rounded-full p-2 flex-row items-center gap-2 border border-gray-200/10"
                            >
                                <Ionicons name="add" size={22} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (zoom > 0) handleZoom("out");
                                }}
                                className="bg-gray-200/10 rounded-full p-2 flex-row items-center gap-2 border border-gray-200/10"
                            >
                                <Ionicons name="remove" size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </MotiView>

                {/* =========== Success/Failed Detail Section =========== */}
                <MotiView
                    from={{ opacity: 0, scale: showResult ? 1 : 0.8, translateY: showResult ? 0 : 40 }}
                    animate={{
                        opacity: showResult ? 1 : 0,
                        scale: showResult ? 1 : 0.8,
                        translateY: showResult ? 0 : 40,
                    }}
                    transition={{
                        type: "timing",
                        duration: 500,
                        delay: showResult ? 100 : 0,
                    }}
                    pointerEvents={showResult ? "auto" : "none"}
                    className="absolute left-0 right-0 top-0 bottom-0 flex-1 justify-center items-center px-8"
                >
                    
                    <View className="w-full max-w-md mx-auto bg-zinc-900 rounded-2xl p-6 shadow-xl shadow-black/50 items-center justify-center">
                        <>
                            {
                                success ? (
                                    <View className="items-center justify-center">
                                        <View className="bg-black rounded-xl p-4 mb-4" style={{
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 3.84,
                                        }}>
                                            <Scanning 
                                                size={40}
                                                strokeWidth={2}
                                                isLoading={false}
                                                isFailed={false}
                                                isSuccess={true}
                                                progress={100}
                                                duration={1500}
                                            />
                                        </View>
                                        <Text className="text-2xl font-bold text-white mb-2">{t('leaveSubmitted')}</Text>
                                        <Text className="text-zinc-400 text-base mb-6 text-center">
                                            {t('desc.leaveSubmitted')}
                                        </Text>
                                        <View className="min-w-full bg-zinc-800 rounded-xl p-4 mb-4 gap-2">
                                            <View className="flex-row items-center ">
                                                <Icon name="book-outline" size={18} color="#a1a1aa" />
                                                <Text className="ml-2 text-zinc-200 font-semibold">{t('subject')}:</Text>
                                                <Text className="ml-2 text-zinc-400 font-semibold">Web Development</Text>
                                            </View>
                                            <View className="flex-row items-center ">
                                                <Icon name="calendar-outline" size={18} color="#a1a1aa" />
                                                <Text className="ml-2 text-zinc-200 font-semibold">{t('date')}:</Text>
                                                <Text className="ml-2 text-zinc-400 font-semibold">2023-06-01</Text>
                                            </View>
                                            <View className="flex-row items-center ">
                                                <Icon name="time-outline" size={18} color="#a1a1aa" />
                                                <Text className="ml-2 text-zinc-200 font-semibold">{t('time')}:</Text>
                                                <Text className="ml-2 text-zinc-400 font-semibold">08:00 AM</Text>
                                            </View>
                                            <View className="flex-row items-center ">
                                                <Icon name="location-outline" size={18} color="#a1a1aa" />
                                                <Text className="ml-2 text-zinc-200 font-semibold">{t('session')}:</Text>
                                                <Text className="ml-2 text-zinc-400 font-semibold">1</Text>
                                            </View>
                                            <View className="flex-row items-center ">
                                                <Icon name="location-outline" size={18} color="#a1a1aa" />
                                                <Text className="ml-2 text-zinc-200 font-semibold">{t('status')}:</Text>
                                                <Text className="ml-2 text-success font-semibold">Present</Text>
                                            </View>
                                        </View>
                                        <View className="flex-row items-center gap-2">
                                            <Button
                                                label={t('back')}
                                                startContent={<Icon name="arrow-back" size={18} color="#fff" />}
                                                color="primary"
                                                onPress={() => {
                                                    if (Platform.OS === "web") window.history.back();
                                                    else if (typeof require !== "undefined") {
                                                        const { router } = require("expo-router");
                                                        router.back();
                                                    }
                                                }}
                                                className="flex-1"
                                            />
                                        </View>
                                    </View>
                                ) : failed ? (
                                    <View className="justify-center items-center">
                                        <View className="bg-black rounded-xl p-4 mb-4 " style={{
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.5,
                                            shadowRadius: 3.84,
                                        }}>
                                            <Scanning 
                                                size={40}
                                                strokeWidth={2}
                                                isLoading={false}
                                                isFailed={true}
                                                isSuccess={false}
                                                progress={100}
                                                duration={1500}
                                            />
                                        </View>
                                        <Text className="text-white text-2xl font-bold">Failed</Text>
                                        <Text className="text-zinc-400 text-base mb-6 text-center">
                                            {t('desc.leaveSubmittedFailed')}
                                        </Text>
                                        <View className="flex-row items-center gap-2">
                                            <Button
                                                label={t('tryAgain')}
                                                startContent={<Icon name="refresh" size={22} color="#fff" />}
                                                color="danger"
                                                className="flex-1"
                                                onPress={resetScanner}
                                            />
                                        </View>
                                    </View>
                                )
                            : null}
                        </>
                    </View>
                </MotiView>
            </View>
            <BottomSheetModalUi
                snapPoints={['30%']}
                bottomSheetRef={bottomSheetRef}
                enableDismissOnClose={true}
                enablePanDownToClose={false}
            >
                <View className="flex-1 items-center justify-center gap-2">
                    <Scanning 
                        size={50}
                        strokeWidth={2}
                        isLoading={true}
                        isFailed={failed}
                        isSuccess={success}
                        progress={100}
                        duration={1500}
                    />
                    <Text className="text-white text-2xl font-bold">{t('scanning')}</Text>
                    <Text className="text-zinc-400 text-base mb-6 text-center max-w-[200px]">
                        {t('desc.scanning')}
                    </Text>
                </View>
            </BottomSheetModalUi>
        </>
    );
};

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
    },
    btmShtContainer: {
        flex: 1,
        backgroundColor: "#22333B",
        borderRadius: 40,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: "#000",
        shadowOpacity: 0.25,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#4b5563",
    },
});
