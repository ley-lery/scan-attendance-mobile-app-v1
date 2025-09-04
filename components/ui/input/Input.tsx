import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';


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
  endContent?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isClearable?: boolean;
  isInvalid?: boolean;
  errorMessage?: ReactNode | string;
  ref?: React.RefObject<any>;
  isRequired?: boolean;
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  defaultValue?: string;
  editable?: boolean;
  classNames?: {
    wrapper?: string;
    input?: string;
    buttonClear?: string;
  };
  animation?: {
    type?: 'timing' | 'spring'
    duration?: number
    delay?: number
    isFocused?: boolean
  }
  notDarkMode?: boolean
  autoComplete?: any
  textContentType?: any
  }

export const Input: React.FC<Props > = ({
  label,
  placeholder,
  value = '',
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  className,
  variant = 'solid',
  radius = 'md',
  startContent,
  endContent,
  size = 'md',
  isClearable = true,
  errorMessage,
  ref,
  isRequired = false,
  isInvalid = false,
  onBlur,
  onFocus,
  isDisabled = false,
  isReadOnly = false,
  multiline = false,
  numberOfLines = 1,
  defaultValue,
  editable,
  classNames,
  animation = {
    type: 'timing',
    duration: 300,
    delay: 0,
    isFocused: false
  },
  notDarkMode = false,
  autoComplete,
  textContentType,
  ...props
}) => {
 
  const variantMaps = {
    solid: {
      default: notDarkMode ? 'bg-zinc-500/30 px-3 text-white' : 'bg-zinc-400/30 dark:bg-zinc-500/30 px-3 text-white',
      invalid: 'bg-danger-600/30 px-3 text-white',
    },
    borderred: {
      default: 'rounded-lg px-3 border border-black/30 dark:border-white/30 bg-transparent text-white',
      invalid: 'rounded-lg px-3 border border-danger/30 bg-transparent text-white',
    },
    underline: {
      default: 'bg-black/60 border border-black/10 dark:border-white/10 px-3 border-b-0 text-white',
      invalid: 'bg-black/60 border border-danger/10 px-3 border-b-0 text-white',
    },
  }

  const radiusMaps = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const sizeMaps = {
    sm: {
      size: 'py-2 max-h-12 min-h-12',
      text: 'text-sm'
    },
    md: {
      size: 'py-3.5 max-h-13 min-h-13',
      text: 'text-base'
    },
    lg: {
      size: 'py-4 max-h-15 min-h-15',
      text: 'text-lg'
    },
  };

  const disabledClass = isDisabled ? 'opacity-50 cursor-auto pointer-events-none select-none' : '';
  const readOnlyClass = isReadOnly ? 'cursor-auto pointer-events-none select-none' : '';

  return (
    // <MotiView
    //   from={{ opacity: 0, scale: animation.isFocused ? 1 : 0.9 }}
    //   animate={{ opacity: 1, scale: animation.isFocused ? 1 : 0.9 }}
    //   transition={{ type: animation.type, duration: animation.duration, delay: animation.delay }}
    // >
      <View className={classNames?.wrapper || className}>
        {label && (
          <Text className={["mb-1 text-base font-normal", isInvalid ? 'text-danger-600' : `${notDarkMode ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-300'}`, disabledClass].join(' ')}>
            {label}{isRequired && <Text className="text-danger-600"> *</Text>}
          </Text>
        )}
        <View
          className={[
            variantMaps[variant][isInvalid ? 'invalid' : 'default'],
            radiusMaps[radius],
            'flex-row items-center gap-2',
            disabledClass,
            readOnlyClass,
          ].join(' ')}
        >
          {startContent}
          <TextInput
            ref={ref}
            placeholder={placeholder}
            value={value || defaultValue}
            onChangeText={(text) => {
              onChangeText?.(text);
            }}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            className={
              `
                bg-transparent h-full flex-1 border-none outline-none 
                placeholder:text-base
                ${notDarkMode ? 'text-zinc-300' : 'text-zinc-600 dark:text-zinc-300'}
                ${isInvalid ? 'placeholder:text-danger-600' : 'placeholder:text-zinc-400'} 
                ${sizeMaps[size].size}
                ${sizeMaps[size].text}
                ${classNames?.input || ''}
              `
            }
            style={{ lineHeight: 19 }}
            onFocus={onFocus}
            onBlur={onBlur}
            multiline={multiline}
            numberOfLines={numberOfLines}
            editable={editable}
            autoComplete={autoComplete}
            textContentType={textContentType}
            {...props}
          />
          <View className={["flex-row items-center gap-2 ", classNames?.buttonClear].join(' ')}>
            {isClearable && value.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  onChangeText?.('');
                }}
              >
                <Ionicons name="close-circle" size={23} color="#71717a" />
              </TouchableOpacity>
            )}
            {endContent}
          </View>
        </View>
        {isInvalid && (
          <Text className='text-danger-600 text-sm mb-2'>
            {errorMessage}
          </Text>
        )}
      </View>
    // </MotiView>
  );
};
