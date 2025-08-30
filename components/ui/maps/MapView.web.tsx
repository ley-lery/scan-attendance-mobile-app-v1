import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface MarkerProps {
    coordinate: Coordinate;
    title?: string;
    pinColor?: string;
}

interface PolylineProps {
    coordinates: Coordinate[];
    strokeColor?: string;
    strokeWidth?: number;
}

interface MapViewProps {
    style?: any;
    region?: Region;
    mapType?: "standard" | "satellite" | "hybrid";
    children?: React.ReactNode;
}

// Web-compatible MapView component
export const MapView: React.FC<MapViewProps> = ({ style, region, children }) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.mapPlaceholder}>
                <Text style={styles.placeholderText}>Map View</Text>
                {region && (
                    <Text style={styles.coordinatesText}>
                        Lat: {region.latitude.toFixed(6)}, Lng: {region.longitude.toFixed(6)}
                    </Text>
                )}
                <Text style={styles.noteText}>
                    Interactive map is available on mobile devices
                </Text>
            </View>
            {children}
        </View>
    );
};

// Web-compatible Marker component
export const Marker: React.FC<MarkerProps> = ({ coordinate, title, pinColor = "#FF0000" }) => {
    return (
        <View style={styles.markerContainer}>
            <View style={[styles.marker, { backgroundColor: pinColor }]} />
            {title && <Text style={styles.markerTitle}>{title}</Text>}
        </View>
    );
};

// Web-compatible Polyline component
export const Polyline: React.FC<PolylineProps> = ({ coordinates, strokeColor = "#FF0000" }) => {
    return (
        <View style={styles.polylineContainer}>
            <Text style={[styles.polylineText, { color: strokeColor }]}>
                Route: {coordinates.length} points
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    placeholderText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    coordinatesText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 10,
    },
    noteText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        fontStyle: "italic",
    },
    markerContainer: {
        position: "absolute",
        top: 10,
        left: 10,
        alignItems: "center",
    },
    marker: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    markerTitle: {
        fontSize: 12,
        color: "#333",
        marginTop: 2,
    },
    polylineContainer: {
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    polylineText: {
        fontSize: 12,
        fontWeight: "bold",
    },
});
