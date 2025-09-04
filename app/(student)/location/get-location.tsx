import { MapView, Marker, Polyline } from "@/components/ui/maps";
import { BlurCard, Text } from "@/godui";
import { useGetLocationStore } from "@/stores/useGetLocationStore";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    StyleSheet,
    View
} from "react-native";
import type { Region } from "react-native-maps";

interface Props {
    show?: boolean;
    type?: "standard" | "satellite" | "hybrid";
}

interface LocationData {
    latitude: number;
    longitude: number;
}

interface LocationState {
    region: Region | null;
    address: string | null;
    distanceToSchool: string | null;
    loading: boolean;
    error: string | null;
}

// School location constant
const SCHOOL_LOCATION: LocationData = {
    latitude: 13.348156167011407, 
    longitude: 103.84639678264146
};

// Default region for fallback
const DEFAULT_REGION: Region = {
    latitude: SCHOOL_LOCATION.latitude,
    longitude: SCHOOL_LOCATION.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

const GetLocation = ({ show = false, type = "satellite" }: Props) => {
    const { t } = useTranslation();
    const setGetLocation = useGetLocationStore((state: any) => state.setLocation);
    
    const [locationState, setLocationState] = useState<LocationState>({
        region: null,
        address: null,
        distanceToSchool: null,
        loading: true,
        error: null
    });

    // Haversine formula for distance calculation
    const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // Format distance with appropriate units
    const formatDistance = useCallback((distance: number): string => {
        return distance >= 1000
            ? `${(distance / 1000).toFixed(2)} km`
            : `${Math.round(distance)} m`;
    }, []);

    // Format address from reverse geocoding result
    const formatAddress = useCallback((addressComponents: Location.LocationGeocodedAddress): string => {
        const parts = [];
        
        // Handle different address formats for cross-platform compatibility
        if (addressComponents.name) parts.push(addressComponents.name);
        if (addressComponents.street) parts.push(addressComponents.street);
        if (addressComponents.city) parts.push(addressComponents.city);
        if (addressComponents.region) parts.push(addressComponents.region);
        if (addressComponents.country) parts.push(addressComponents.country);
        
        // Fallback to available properties
        if (parts.length === 0) {
            if (addressComponents.district) parts.push(addressComponents.district);
            if (addressComponents.subregion) parts.push(addressComponents.subregion);
        }
        
        return parts.slice(0, 3).join(", ") || "Unknown location";
    }, []);

    // Request location permissions with platform-specific handling
    const requestLocationPermission = useCallback(async (): Promise<boolean> => {
        try {
            // Check current permission status
            const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
            
            if (currentStatus === 'granted') {
                return true;
            }

            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                const errorMessage = Platform.OS === 'ios' 
                    ? 'Please enable location access in Settings > Privacy & Security > Location Services'
                    : 'Please enable location access in Settings > Apps > Permissions > Location';
                
                Alert.alert(
                    "Location Permission Required", 
                    errorMessage,
                    [{ text: "OK" }]
                );
                return false;
            }

            return true;
        } catch (error) {
            console.error("Permission request error:", error);
            return false;
        }
    }, []);

    // Get user's current location
    const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
        try {
            const locationOptions: Location.LocationOptions = {
                accuracy: Location.Accuracy.High,
            };

            const location = await Location.getCurrentPositionAsync(locationOptions);
            
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            };
        } catch (error) {
            console.error("Get location error:", error);
            
            // Try with lower accuracy as fallback
            try {
                const fallbackLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low,
                });
                
                return {
                    latitude: fallbackLocation.coords.latitude,
                    longitude: fallbackLocation.coords.longitude
                };
            } catch (fallbackError) {
                console.error("Fallback location error:", fallbackError);
                return null;
            }
        }
    }, []);

    // Get address from coordinates
    const getAddressFromCoordinates = useCallback(async (location: LocationData): Promise<string> => {
        try {
            const addresses = await Location.reverseGeocodeAsync(location);
            
            if (addresses && addresses.length > 0) {
                return formatAddress(addresses[0]);
            }
            
            return "Address not available";
        } catch (error) {
            console.error("Reverse geocoding error:", error);
            return "Address not available";
        }
    }, [formatAddress]);

    // Initialize location data
    const initializeLocation = useCallback(async () => {
        setLocationState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Request permission
            const hasPermission = await requestLocationPermission();
            if (!hasPermission) {
                setLocationState(prev => ({
                    ...prev,
                    loading: false,
                    error: "Location permission denied",
                    region: DEFAULT_REGION
                }));
                return;
            }

            // Get current location
            const userLocation = await getCurrentLocation();
            if (!userLocation) {
                throw new Error("Unable to get current location");
            }

            // Create region
            const newRegion: Region = {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            // Calculate distance to school
            const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                SCHOOL_LOCATION.latitude,
                SCHOOL_LOCATION.longitude
            );

            // Get address (async, don't block the map update)
            getAddressFromCoordinates(userLocation).then(address => {
                setLocationState(prev => ({ ...prev, address }));
            });

            // Update state
            setLocationState(prev => ({
                ...prev,
                region: newRegion,
                distanceToSchool: formatDistance(distance),
                loading: false,
                error: null
            }));

            // Update store
            setGetLocation(userLocation);

        } catch (error) {
            console.error("Initialize location error:", error);
            
            setLocationState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : "Location error occurred",
                region: DEFAULT_REGION
            }));

            Alert.alert(
                "Location Error", 
                "Unable to get your current location. Showing school area.",
                [{ text: "OK" }]
            );
        }
    }, [
        requestLocationPermission, 
        getCurrentLocation, 
        calculateDistance, 
        formatDistance, 
        getAddressFromCoordinates, 
        setGetLocation
    ]);

    // Initialize location on component mount
    useEffect(() => {
        if (show) {
            initializeLocation();
        }
    }, [show, initializeLocation]);

    if (!show) {
        return null;
    }

    const { region, address, distanceToSchool, loading, error } = locationState;

    return (
        <View style={styles.container}>
            <MapView 
                style={styles.map} 
                region={region || DEFAULT_REGION} 
                mapType={type}
                showsUserLocation={true}
                showsMyLocationButton={Platform.OS === 'android'}
                followsUserLocation={false}
                showsCompass={true}
                showsScale={Platform.OS === 'android'}
            >
                {region && (
                    <>
                        {/* User Location Marker */}
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            title="Your Location"
                            description={address || "Current location"}
                            pinColor="#4285F4"
                        />

                        {/* School Marker */}
                        <Marker 
                            coordinate={SCHOOL_LOCATION} 
                            title="School" 
                            description="School Location"
                            pinColor="#EA4335" 
                        />

                        {/* Route Line */}
                        <Polyline
                            coordinates={[region, SCHOOL_LOCATION]}
                            strokeColor="#4285F4"
                            strokeWidth={3}
                            lineDashPattern={Platform.OS === 'ios' ? [5, 5] : undefined}
                        />
                    </>
                )}
            </MapView>

            {/* Information Card */}
            <View className="absolute top-5 left-5 right-5 z-10">
                <BlurCard 
                    tint="default" 
                    intensity={Platform.OS === 'ios' ? 50 : 30} 
                    radius="lg" 
                >
                    {loading ? (
                        <View className="flex-row items-center gap-4">
                            <ActivityIndicator 
                                size="small" 
                                color={Platform.OS === 'ios' ? "#007AFF" : "#2196F3"} 
                            />
                            <Text className="text-zinc-900 dark:text-white text-base">
                               {t("gettingLocation")}
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="flex-row items-center gap-4">
                            <Text className="text-danger text-base">
                                {error}
                            </Text>
                        </View>
                    ) : (
                        <View className="gap-2">
                            <Text className="text-zinc-900 dark:text-white text-base" numberOfLines={2}>
                                📍 {address || t("gettingAddress")}
                            </Text>
                            {distanceToSchool && (
                                <Text className="text-zinc-900 dark:text-white text-base">
                                    📏 {t("distanceToSchool")}: {distanceToSchool}
                                </Text>
                            )}
                        </View>
                    )}
                </BlurCard>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: "100%",
        height: "100%",
    },
    infoContainer: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 12,
        right: 12,
        zIndex: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: Platform.OS === 'ios' ? '#000' : '#666',
    },
    errorContainer: {
        padding: 4,
    },
    errorText: {
        fontSize: 14,
        color: '#FF3B30',
        textAlign: 'center',
    },
    locationInfo: {
        padding: 4,
    },
    addressText: {
        fontSize: 16,
        fontWeight: '500',
        color: Platform.OS === 'ios' ? '#000' : '#333',
        marginBottom: 4,
    },
    distanceText: {
        fontSize: 14,
        color: Platform.OS === 'ios' ? '#666' : '#555',
    },
});

export default GetLocation;