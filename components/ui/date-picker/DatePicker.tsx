import { BlurCard } from '@/components/ui/card/BlurCard'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from "@react-native-community/datetimepicker"
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type PickerProps = {
  value: Date
  onChange: (event: any, selectedDate?: Date) => void
  minimumDate?: Date
  placeholder?: string
  label?: string
  isDisabled?: boolean
  className?: string
  variant?: 'solid' | 'borderred' | 'underline'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
  size?: 'sm' | 'md' | 'lg'
  isInvalid?: boolean

  errorMessage?: string
  isRequired?: boolean
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  placement?: 'bottom' | 'top'
  animation?: {
    type?: 'timing' | 'spring'
    duration?: number
    delay?: number
    isFocused?: boolean
  }

}

export const DatePicker: React.FC<PickerProps> = ({
  value,
  onChange,
  minimumDate,
  placeholder = 'Select a date',
  label,
  isDisabled = false,
  className = '',
  variant = 'solid',
  radius = 'md',
  size = 'md',
  isInvalid = false,
  errorMessage,
  isRequired = false,
  startContent,
  endContent,
  placement = 'bottom',
  animation = {
    type: 'timing',
    duration: 300,
    delay: 0,
    isFocused: false
  }
}) => {
  const [open, setOpen] = useState(false)

  // Format date to readable string
  const formatDate = (date?: Date) => {
    if (!date) return placeholder
    return date.toLocaleDateString()
  }

  const variantMaps = {
    solid: {
      default: 'bg-zinc-200  dark:bg-zinc-500/30 px-3 text-white',
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
  }

  const sizeMaps = {
    sm: 'py-2 max-h-12 min-h-12',
    md: 'py-3 max-h-13 min-h-13',
    lg: 'py-4 max-h-15 min-h-15',
  }

  const placementMaps = {
    bottom: 'top-full',
    top: 'bottom-full',
  }

  const disabledClass = isDisabled ? 'opacity-50 pointer-events-none select-none' : 'opacity-100';

  return (
    // <MotiView
    //   from={{ opacity: 0, scale: animation.isFocused ? 1 : 0.9 }}
    //   animate={{ opacity: 1, scale: animation.isFocused ? 1 : 0.9 }}
    //   transition={{ type: animation.type, duration: animation.duration, delay: animation.delay }}
    // >
      <View className={`w-full ${className}`}>
        {label && (
          <Text className={["mb-1 text-base font-normal", isInvalid ? 'text-danger-600' : 'text-zinc-600 dark:text-zinc-300', disabledClass ].join(' ')}>
            {label}{isRequired && <Text className="text-red-500"> *</Text>}
          </Text>
        )}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isDisabled}
          onPress={() => setOpen(o => !o)}
          className={`
            flex-row items-center justify-between
            ${variantMaps[variant][isInvalid ? 'invalid' : 'default']} ${radiusMaps[radius]} ${sizeMaps[size]}
            ${disabledClass}
            ${isInvalid ? 'border-danger' : ''}
          `}
          style={{ minHeight: 48 }}
        >
          <View className='flex-row items-center gap-x-2'>
            {startContent}
            <Text className={`text-base ${value ? 'dark:text-white text-zinc-600' : 'dark:text-zinc-300 text-zinc-400'}`}>
              {formatDate(value)}
            </Text>
          </View>
          {endContent}
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#a1a1aa"
          />
        </TouchableOpacity>

        {isInvalid && errorMessage && (
          <Text className="text-red-600 text-xs mt-1">{errorMessage}</Text>
        )}

        <AnimatePresence>
          {open && (
            <MotiView 
              from={{ opacity: 0, translateY: -10, scale: 0.98 }} 
              animate={{ opacity: 1, translateY: 0, scale: 1 }} 
              exit={{ opacity: 0, translateY: -10, scale: 0.98 }} 
              transition={{ type: 'timing', duration: 200 }} 
              className={[
                "absolute left-0 right-0 z-50", 
                placementMaps[placement],
              ].join(" ")} 
              style={{ elevation: 8 }} 
            >
              <BlurCard radius='lg' placementRadius="all" intensity={40} tint="light" classNames={{wrapper: 'border-none'}}>
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => onChange(event, date)}
                  minimumDate={minimumDate}
                />
              </BlurCard>
          </MotiView>
          )}
        </AnimatePresence>
      </View>
    // </MotiView>
  )
}
