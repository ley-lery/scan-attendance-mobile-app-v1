import { BlurCard } from '@/godui'
import { Ionicons } from '@expo/vector-icons'
import { AnimatePresence, MotiView } from 'moti'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'

type PickerOption = {
  label: string
  value: string | number
}

type PickerProps = {
  options: PickerOption[]
  value: string | number | null
  onChange: (value: string | number) => void
  placeholder?: string
  label?: string
  disabled?: boolean
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
  isClearable?: boolean,
  isDisabled?: boolean,
  classNames?: {
    wrapper?: string;
    input?: string;
    buttonClear?: string;
  };
}

export const Picker: React.FC<PickerProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  className = '',
  variant = 'borderred',
  radius = 'md',
  size = 'md',
  isInvalid = false,
  errorMessage,
  isRequired = false,
  startContent,
  endContent,
  placement = 'bottom',
  isClearable = true,
  isDisabled = false,
  classNames
}) => {
  const [open, setOpen] = useState(false)
  const selected = options.find(opt => opt.value === value)

  const handleSelect = (val: string | number) => {
    onChange(val)
    setOpen(false)
  }

  const handleClear = () => {
    onChange('')
    setOpen(true)
  }

  // Style Maps (same as Input)
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
    sm: {
      size: 'py-2 max-h-12 min-h-12',
      text: 'text-sm'
    },
    md: {
      size: 'py-3 max-h-13 min-h-13',
      text: 'text-base'
    },
    lg: {
      size: 'py-4 max-h-15 min-h-15',
      text: 'text-lg'
    },
  };

  const placementMaps = {
    bottom: 'top-full',
    top: 'bottom-full',
  }
  
  const disabledClass = isDisabled ? 'opacity-50 pointer-events-none select-none' : 'opacity-100';

  return (
    <View className={`w-full ${classNames?.wrapper || className}`}>
      {label && (
        <Text className={["mb-1 text-base font-normal", isInvalid ? 'text-danger-600' : 'text-zinc-600 dark:text-zinc-300', disabledClass ].join(' ')}>
          {label}{isRequired && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
     <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => setOpen(o => !o)}
        className={`
          flex-row items-center justify-between
          ${variantMaps[variant][isInvalid ? 'invalid' : 'default']} 
          ${radiusMaps[radius]} ${sizeMaps[size].size}
          ${disabledClass}
        `}
        style={{ minHeight: 48 }}
      >
        <View className='flex-row items-center gap-x-2'>
          {startContent}
          <Text className={[sizeMaps[size].text, selected ? 'text-black dark:text-white' : (isInvalid ? 'text-danger-600' : 'text-zinc-400 dark:text-zinc-400')].join(' ')}>
            {selected ? selected.label : placeholder}
          </Text>
        </View>
        <View className="flex-row items-center gap-x-2">
          <View className={["flex-row items-center gap-2 ", classNames?.buttonClear].join(' ')}>
            {isClearable && selected && (
              <TouchableOpacity
                onPress={() => {
                  handleClear();
                }}
              >
                <Ionicons name="close-circle" size={23} color="#71717a" />
              </TouchableOpacity>
            )}
            {endContent}
          </View>
          {endContent}
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={isInvalid ? '#db2777' : '#a1a1aa'}
          />
        </View>
      </TouchableOpacity>

      {/* Error Message */}
      {isInvalid && errorMessage && (
        <Text className="text-danger-600 text-xs mt-1">{errorMessage}</Text>
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
              label && placementMaps.bottom && 'translate-y-0', 
              !label && placementMaps.top && 'translate-y-10'
            ].join(" ")} 
            style={{ elevation: 8 }} 
          >
            <BlurCard radius='lg' placementRadius="all" intensity={60} tint="light">
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {options.map((item) => (
                  <Pressable
                    key={item.value}
                    onPress={() => handleSelect(item.value)}
                    className={`
                      px-4 py-3 rounded-sm flex-row items-center justify-between
                      ${item.value === value ? 'dark:bg-zinc-300/10 bg-zinc-400/30' : 'bg-transparent'}
                    `}
                    android_ripple={{ color: '#27272a' }}
                  >
                    <Text
                      className={`text-base ${
                        item.value === value ? 'dark:text-white text-black font-medium' : 'dark:text-zinc-300 text-zinc-500'
                      }`}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={20} color="#a1a1aa" />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </BlurCard>
         </MotiView>
        )}
      </AnimatePresence>
    </View>
  )
}

export default Picker
