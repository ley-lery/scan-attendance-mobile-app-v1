import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export const Icon = ({name, size, color}: {name: string, size: number, color?: string}) => {
    const theme = useThemeStore((state) => state.theme);
    const IconComponent = theme === "1" ? Ionicons : Ionicons;
    return <IconComponent name={name as any} size={size} color={color || (theme === "1" ? "#db2777" : "#006FEE")} />
}
