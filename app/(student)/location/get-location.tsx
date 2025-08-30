import { MapView, Marker, Polyline } from "@/components/ui/maps";
import { BlurCard } from "@/godui";
import { useGetLocationStore } from "@/stores/useGetLocationStore";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import type { Region } from "react-native-maps";

interface Props {
    show?: boolean;
    type?: "standard" | "satellite" | "hybrid";
}

// School location constant - moved outside component to avoid dependency issues
const SCHOOL_LOCATION = {
    // School location coordinates
    latitude: 13.348156167011407, 
    longitude: 103.84639678264146
};

const GetLocation = ({ show = false, type = "satellite" }: Props) => {
    const { t } = useTranslation();
    const setGetLocation = useGetLocationStore((state: any) => state.setLocation);
    const [region, setRegion] = useState<Region | undefined>(undefined);
    const [address, setAddress] = useState<string | null>(null);
    const [distanceToSchool, setDistanceToSchool] = useState<string | null>(null);

    // Haversine formula
    const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const formatDistance = (distance: number) => {
        return distance >= 1000
            ? `${(distance / 1000).toFixed(2)} km`
            : `${Math.round(distance)} m`;
    };

    useEffect(() => {
        let isMounted = true;

        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    Alert.alert("Permission Denied", "Location access is required.");
                    return;
                }

                const {
                    coords: { latitude, longitude },
                } = await Location.getCurrentPositionAsync({});

                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                };

                if (isMounted) {
                    setRegion(newRegion);
                    setGetLocation({ latitude, longitude });
                }

                const addr = await Location.reverseGeocodeAsync({ latitude, longitude });
                if (isMounted && addr.length > 0) {
                    const { city, region } = addr[0];
                    setAddress(`${city}, ${region}`);
                }

                const distance = getDistanceInMeters(
                    latitude,
                    longitude,
                    SCHOOL_LOCATION.latitude,
                    SCHOOL_LOCATION.longitude
                );
                if (isMounted) setDistanceToSchool(formatDistance(distance));
            } catch (err) {
                console.error("Location error:", err);
                Alert.alert("Error", "Unable to fetch location.");
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [setGetLocation]);



    return (
        show && (
            <View className="relative text-blue-500">
                <MapView style={styles.map} region={region} mapType={type}>
                    {region && (
                        <>
                            {/* User Location */}
                            <Marker
                                coordinate={{
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                }}
                                title="You are here"
                            />

                            {/* School Marker */}
                            <Marker coordinate={SCHOOL_LOCATION} title="School" pinColor="#3b82f6" />

                            {/* Polyline to school */}
                            <Polyline
                                coordinates={[region, SCHOOL_LOCATION]}
                                strokeColor="#FF0000"
                                strokeWidth={2}
                            />
                        </>
                    )}
                </MapView>

                {/* Address & Distance */}
                <View className="absolute top-0 left-0 right-0 p-2">
                    <BlurCard tint="default" intensity={50} radius="lg" className="justify-center">
                        {address ? (
                            <View>
                                <Text className="text-zinc-600 dark:text-white text-lg">{address}</Text>
                                <Text className="text-zinc-600 dark:text-white text-base">
                                    {t("distanceToSchool")}: {distanceToSchool}
                                </Text>
                            </View>
                        ) : (
                            <ActivityIndicator size="small" color="#000" />
                        )}
                    </BlurCard>
                </View>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
    },
});

export default GetLocation;
