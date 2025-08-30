import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface Props {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad' | 'url';
  className?: string;
  variant?: 'solid' | 'borderred' | 'underline';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  startContent?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isClearable?: boolean;
  errorMessage?: React.ReactNode | string;
  ref?: React.RefObject<any>;
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
}

export const InputPassword: React.FC<Props> = ({
  placeholder,
  value = '',
  onChangeText,
  secureTextEntry = true,
  autoCapitalize,
  keyboardType,
  className,
  variant = 'solid',
  radius = 'md',
  startContent,
  size = 'md',
  isClearable = true,
  errorMessage,
  ref,
  isRequired = false,
  label,
  isDisabled = false,
  isInvalid = false,
  onBlur,
  onFocus,
}) => {
  const [showPassword, setShowPassword] = useState(false);


  const variantMaps = {
    solid: 'bg-zinc-500/30 px-3 ',
    borderred: 'rounded-lg px-3 border border-white/30 bg-transparent',
    underline: 'bg-black/60 border border-white/10 px-3 border-b-0',
  };

  const radiusMaps = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const sizeMaps = {
    sm: 'py-2 max-h-11 min-h-11',
    md: 'py-3.5 max-h-12 min-h-12',
    lg: 'py-4.5 max-h-15 min-h-15',
  };

  const disabledClass = isDisabled ? 'opacity-50 cursor-auto pointer-events-none select-none' : '';

  return (
    <View className={className}>
      {label && (
        <Text className="text-zinc-300 text-sm mb-2">{label}{isRequired && <Text className="text-red-500"> *</Text>}</Text>
      )}
      <View
        className={[
          variantMaps[variant],
          radiusMaps[radius],
          'flex-row items-center gap-2',
          isInvalid ? 'border-red-600' : '',
          disabledClass,
        ].join(' ')}
      >
        {startContent}
        <TextInput
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          className={[
            'bg-transparent border-none outline-none text-zinc-400 placeholder:text-base flex-1',
            sizeMaps[size]
          ].join(' ')}
          style={{ lineHeight: 19 }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <View className="flex-row items-center gap-2">
          {secureTextEntry && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#71717a"
                />
            </TouchableOpacity>
          )}
          {isClearable && value.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeText?.('')}
            >
              <Ionicons name="close-circle" size={22} color="#71717a" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isInvalid && (
        <Text className="text-red-500 text-xs mb-2">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

