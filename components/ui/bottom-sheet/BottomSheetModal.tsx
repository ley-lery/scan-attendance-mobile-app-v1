import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type BottomSheetModalUIProps = {
    bottomSheetRef: React.RefObject<BottomSheetModal | null>;
    children: ReactNode;
    snapPoints?: string[];
    index?: number;
    enablePanDownToClose?: boolean;
    enableDismissOnClose?: boolean;
    hideHandle?: boolean;
    blurIntensity?: number;
};

export const BottomSheetModalUi = ({
    bottomSheetRef,
    children,
    snapPoints = ["50%", "70%", "97.5%"],
    index = 1,
    enablePanDownToClose = true,
    enableDismissOnClose = true,
    hideHandle = true,
    blurIntensity = 100,
}: BottomSheetModalUIProps) => {
    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={index}
            snapPoints={snapPoints}
            enablePanDownToClose={enablePanDownToClose}
            enableDismissOnClose={enableDismissOnClose}
            backgroundStyle={styles.backgroundStyle}
            handleStyle={hideHandle ? { display: "none" } : undefined}
            handleIndicatorStyle={hideHandle ? { display: "none" } : undefined}
            enableOverDrag={false}
        >
            <BottomSheetView className="flex-1 h-full">
                <View className="flex-1 rounded-t-3xl overflow-hidden">
                    <BlurView
                        intensity={blurIntensity}
                        tint="systemChromeMaterial"
                        className="pb-4 pt-8 flex-1 relative"
                    >
                        <View className="absolute items-center w-full">
                            <View className=" w-12 h-1 rounded-full dark:bg-zinc-500 bg-zinc-300 flex top-3 " />
                        </View>
                        {children}
                    </BlurView>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};


const styles = StyleSheet.create({
    backgroundStyle: {
        flex: 1,
        backgroundColor: "transparent",
        borderRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: "#000",
        shadowOpacity: 0.25,
    },
});
