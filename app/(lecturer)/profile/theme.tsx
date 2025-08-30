import { BottomSheetModalUi } from '@/godui';
import { useThemeStore } from '@/stores/useThemeStore';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FilterProps {
    bottomSheetRef: React.RefObject<BottomSheetModal | null>;
    onThemeChange?: (theme: "1" | "2") => void;
}

const THEMES = [
    { id: "1", label: 'Red-Black', color: 'red' },
    { id: "2", label: 'Blue-Black', color: 'blue' },
];

const Theme = ({ bottomSheetRef, onThemeChange }: FilterProps) => {
    const theme = useThemeStore((state) => state.theme);
    const [selected, setSelected] = React.useState<"1" | "2">("1");

    React.useEffect(() => {
        setSelected(useThemeStore.getState().theme); 
    }, [useThemeStore.getState().theme]);

    const handleSelect = (code: "1" | "2") => {
        if (selected === code) return;
        setSelected(code);
        onThemeChange?.(code);
        setTimeout(() => {
            bottomSheetRef.current?.dismiss();
        }, 200);
    };

    const snapPoints = ["25%"];

    return (
        <BottomSheetModalUi
            blurIntensity={100}
            bottomSheetRef={bottomSheetRef}
            hideHandle
            snapPoints={snapPoints}
            index={0}
        >
            <View className='flex-1 px-4'>
                <Text className="text-lg text-white font-semibold mb-4 text-center">Change Theme</Text>
                {THEMES.map((theme) => (
                    <TouchableOpacity
                        key={theme.id}
                        className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${selected === theme.id ? (theme.id === "1" ? "bg-theme1-primary/20 dark:bg-theme1-primary/20" : "bg-theme2-primary/20 dark:bg-theme2-primary/20") : 'bg-zinc-900/60'}`}
                        activeOpacity={0.8}
                        onPress={() => handleSelect(theme.id as "1" | "2")}
                    >
                        <Entypo name="dot-single" size={24} color={theme.color} />
                        <Text className="flex-1 text-base text-zinc-800 dark:text-zinc-200">{theme.label}</Text>
                        {selected === theme.id && (
                            <Ionicons name="checkmark-circle" size={22} color={theme.id === "1" ? "#f31260" : "#009FFF"} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </BottomSheetModalUi>
    );
};


export default Theme
