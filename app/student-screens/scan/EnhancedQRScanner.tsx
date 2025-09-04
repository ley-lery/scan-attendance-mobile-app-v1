import { CameraView } from 'expo-camera';
import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface QRScannerProps {
  showResults: boolean;
  isLoading: boolean;
  showCamera: boolean;
  userData: any;
  scanState: string;
  scanMethod: string;
  zoom: number;
  flashEnabled: boolean;
  handleBarcodeScanned: (data: any) => void;
  t: any;
  getScanStatusMessage: any;
}

// Animated Scan Line (with glow and gradient)
const ScanLine = () => (
  <MotiView
    from={{ translateY: -120, opacity: 0.7 }}
    animate={{ translateY: 120, opacity: 1 }}
    transition={{
      type: 'timing',
      duration: 1600,
      loop: true,
      repeatReverse: true,
    }}
    style={{
      position: 'absolute',
      left: 18,
      right: 18,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(56,189,248,0.85)',
      shadowColor: '#38bdf8',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 16,
      top: '50%',
      zIndex: 3,
      borderWidth: 1,
      borderColor: 'rgba(56,189,248,0.25)',
    }}
  />
);

// Corner Guide Component (with accent color and subtle shadow)
const CornerGuide = ({
  position,
  color = '#38bdf8',
  size = 32,
  thickness = 4,
  radius = 12,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br';
  color?: string;
  size?: number;
  thickness?: number;
  radius?: number;
}) => {
  const baseStyle = {
    position: 'absolute' as const,
    width: size,
    height: size,
    borderColor: color,
    borderRadius: radius,
    shadowColor: color,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  };
  let style = {};
  switch (position) {
    case 'tl':
      style = {
        ...baseStyle,
        top: 0,
        left: 0,
        borderLeftWidth: thickness,
        borderTopWidth: thickness,
      };
      break;
    case 'tr':
      style = {
        ...baseStyle,
        top: 0,
        right: 0,
        borderRightWidth: thickness,
        borderTopWidth: thickness,
      };
      break;
    case 'bl':
      style = {
        ...baseStyle,
        bottom: 0,
        left: 0,
        borderLeftWidth: thickness,
        borderBottomWidth: thickness,
      };
      break;
    case 'br':
      style = {
        ...baseStyle,
        bottom: 0,
        right: 0,
        borderRightWidth: thickness,
        borderBottomWidth: thickness,
      };
      break;
  }
  return <View style={style} pointerEvents="none" />;
};

// Frosted Glass Overlay
const FrostedOverlay = () => (
  <View
    pointerEvents="none"
    style={{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(24, 24, 27, 0.18)',
      backdropFilter: 'blur(8px)',
      zIndex: 2,
    }}
  />
);

// Main Scanner Component
const EnhancedQRScanner: React.FC<QRScannerProps> = ({
  showResults,
  isLoading,
  showCamera,
  userData,
  scanState,
  scanMethod,
  zoom,
  flashEnabled,
  handleBarcodeScanned,
  t,
  getScanStatusMessage,
}) => {
  const isScanning = scanState === 'idle' && scanMethod === 'camera';
  const shouldShowCamera = showCamera && userData?.is_scanned !== 1 && isScanning;

  return (
    <MotiView
      from={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: showResults ? 0 : 1,
        scale: showResults ? 0.96 : 1,
      }}
      transition={{ type: 'timing', duration: 400 }}
      pointerEvents={isLoading || showResults ? 'none' : 'auto'}
      className="flex-1"
    >
      {/* Camera Container */}
      <View
        style={StyleSheet.absoluteFillObject}
        className="bg-zinc-100 dark:bg-zinc-900 items-center justify-center relative"
      >
        {/* Scanning Frame with subtle shadow and frosted overlay */}
        <MotiView
          from={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 120 }}
          style={{
            shadowColor: '#38bdf8',
            shadowOpacity: 0.08,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 0 },
          }}
          className="relative"
        >
          {/* Camera View */}
          <View
            className="w-80 h-80 rounded-3xl overflow-hidden border-2"
            style={{
              borderColor: '#38bdf8',
              backgroundColor: 'rgba(24,24,27,0.12)',
              position: 'relative',
            }}
          >
            {shouldShowCamera && (
              <CameraView
                zoom={zoom}
                facing="back"
                flash={flashEnabled ? 'on' : 'off'}
                onBarcodeScanned={handleBarcodeScanned}
                style={{ width: '100%', height: '100%' }}
              />
            )}

            {/* Frosted Glass Overlay for better focus */}
            <FrostedOverlay />

            {/* Animated Scan Line */}
            {isScanning && <ScanLine />}

            {/* Corner Guides */}
            <CornerGuide position="tl" />
            <CornerGuide position="tr" />
            <CornerGuide position="bl" />
            <CornerGuide position="br" />

            {/* Subtle inner border for depth */}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                right: 8,
                bottom: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(56,189,248,0.12)',
                zIndex: 1,
              }}
            />
          </View>

          {/* Status Message */}
          <View className="w-80 items-center mt-6">
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 400 }}
              style={{
                backgroundColor: 'rgba(56,189,248,0.08)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 18,
                minHeight: 36,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#38bdf8',
                shadowOpacity: 0.04,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 0 },
              }}
            >
              <Text
                style={{
                  color: '#38bdf8',
                  fontWeight: '600',
                  fontSize: 16,
                  letterSpacing: 0.1,
                  textAlign: 'center',
                }}
              >
                {isScanning
                  ? t?.('scan_qr_prompt') || 'Align QR code within frame'
                  : getScanStatusMessage?.(scanState, scanMethod, userData)}
              </Text>
            </MotiView>
          </View>
        </MotiView>
      </View>
    </MotiView>
  );
};

export default EnhancedQRScanner;
