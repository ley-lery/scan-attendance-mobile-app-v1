import React from 'react';
import { Image, View } from 'react-native';

interface AvatarProps {
    uri: string;
    size?: 'sm' | 'md' | 'lg';
    radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    isBorderred?: boolean;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    className?: string;
}

export const Avatar = ({ uri, size = 'md', radius = 'full', isBorderred, color, className }: AvatarProps) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };
  const radiusMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };
  const colorMap = {
    default: 'bo-zinc-200 dark:bg-zinc-700',
    primary: 'bg-primary dark:bg-primary/80',
    secondary: 'bg-secondary dark:bg-secondary/80',
    success: 'bg-success dark:bg-success/80',
    warning: 'bg-warning dark:bg-warning/80',
    danger: 'bg-danger dark:bg-danger/80',
  };
  
    return (
    <View 
        className={`
            overflow-hidden
            ${sizeMap[size]}
            ${radiusMap[radius]}
            ${className}
        `}
        style={{
            outlineColor: isBorderred ? 'zinc-200' : 'transparent',
            outlineWidth: isBorderred ? 2 : 0,
            outlineOffset: isBorderred ? 2 : 0,
        }}
    >
      <Image source={{ uri }} className="w-full h-full" />
    </View>
  )
}

