import i18n from '@/assets/translate/i18n';
import { Flag } from '@/constants/Image';
import { BottomSheetModalUi } from '@/godui';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface FilterProps {
    bottomSheetRef: React.RefObject<BottomSheetModal | null>;
    onLanguageChange?: (language: string) => void;
}

const LANGUAGES = [
    { code: 'en', label: 'English', icon: Flag.EN },
    { code: 'kh', label: 'ភាសាខ្មែរ', icon: Flag.KH },
];

const Language = ({ bottomSheetRef, onLanguageChange }: FilterProps) => {
    const [selected, setSelected] = React.useState<string>(i18n.language);

    React.useEffect(() => {
        setSelected(i18n.language); 
    }, [i18n.language]);

    const handleSelect = (code: string) => {
        if (selected === code) return;
        setSelected(code);
        onLanguageChange?.(code);
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
                <Text className="text-lg text-zinc-800 dark:text-zinc-300 font-semibold mb-4 text-center">Change Language</Text>
                {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                        key={lang.code}
                        className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${selected === lang.code ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-zinc-200 dark:bg-zinc-900/60'}`}
                        activeOpacity={0.8}
                        onPress={() => handleSelect(lang.code)}
                    >
                        <Image
                            source={lang.icon}
                            className="w-9 h-7 rounded justify-center items-center mr-3"
                            resizeMode="contain"
                        />
                        <Text className="flex-1 text-base text-zinc-800 dark:text-zinc-200">{lang.label}</Text>
                        {selected === lang.code && (
                            <Ionicons name="checkmark-circle" size={22} color="#f31260" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </BottomSheetModalUi>
    );
};


export default Language
