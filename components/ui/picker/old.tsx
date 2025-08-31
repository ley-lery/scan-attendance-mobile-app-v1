import { BlurCard } from '@/godui'
import { Ionicons } from '@expo/vector-icons'
import { AnimatePresence, MotiView } from 'moti'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'

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
  placement?: 'bottom' | 'top' | 'auto'
  isClearable?: boolean
  isDisabled?: boolean
  classNames?: {
    wrapper?: string
    input?: string
    buttonClear?: string
  }
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
  placement = 'auto',
  isClearable = true,
  isDisabled = false,
  classNames
}) => {
  const [open, setOpen] = useState(false)
  const [actualPlacement, setActualPlacement] = useState<'bottom' | 'top'>('bottom')
  const triggerRef = useRef<TouchableOpacity>(null)
  const selected = options.find(opt => opt.value === value)

  // Calculate optimal placement when opening
  useEffect(() => {
    if (open && placement === 'auto' && triggerRef.current) {
      triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
        const screenHeight = Dimensions.get('window').height
        const dropdownHeight = Math.min(150, options.length * 48) // Estimate dropdown height
        const spaceBelow = screenHeight - (pageY + height)
        const spaceAbove = pageY
        
        // If there's more space above and not enough space below, place on top
        if (spaceAbove > spaceBelow && spaceBelow < dropdownHeight + 20) {
          setActualPlacement('top')
        } else {
          setActualPlacement('bottom')
        }
      })
    } else if (placement !== 'auto') {
      setActualPlacement(placement)
    }
  }, [open, placement, options.length])

  const handleSelect = (val: string | number) => {
    onChange(val)
    setOpen(false)
  }

  const handleClear = (e: any) => {
    e.stopPropagation() // Prevent triggering the main press event
    onChange('')
    // Don't auto-open after clearing
  }

  const handleToggle = () => {
    if (!disabled && !isDisabled) {
      setOpen(prev => !prev)
    }
  }

  // Style Maps
  const variantMaps = {
    solid: {
      default: 'bg-zinc-200 dark:bg-zinc-500/30 px-3 text-white',
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
  }

  const placementMaps = {
    bottom: 'top-full mt-1',
    top: 'bottom-full mb-1',
  }
  
  const disabledClass = (isDisabled || disabled) ? 'opacity-50' : 'opacity-100'

  return (
    <View className={`w-full ${classNames?.wrapper || className}`}>
      {label && (
        <Text className={[
          "mb-1 text-base font-normal", 
          isInvalid ? 'text-danger-600' : 'text-zinc-600 dark:text-zinc-300', 
          disabledClass 
        ].join(' ')}>
          {label}{isRequired && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      
      <TouchableOpacity
        ref={triggerRef}
        activeOpacity={0.8}
        disabled={disabled || isDisabled}
        onPress={handleToggle}
        className={`
          flex-row items-center justify-between
          ${variantMaps[variant][isInvalid ? 'invalid' : 'default']} 
          ${radiusMaps[radius]} ${sizeMaps[size].size}
          ${disabledClass}
          ${classNames?.input || ''}
        `}
        style={{ minHeight: 48 }}
      >
        <View className='flex-row items-center gap-x-2 flex-1'>
          {startContent}
          <Text className={[
            sizeMaps[size].text, 
            selected ? 'text-black dark:text-white' : (isInvalid ? 'text-danger-600' : 'text-zinc-400 dark:text-zinc-400')
          ].join(' ')}>
            {selected ? selected.label : placeholder}
          </Text>
        </View>
        
        <View className="flex-row items-center gap-x-2">
          {isClearable && selected && (
            <TouchableOpacity
              onPress={handleClear}
              className={classNames?.buttonClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="#71717a" />
            </TouchableOpacity>
          )}
          {endContent}
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={20}
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
            from={{ 
              opacity: 0, 
              translateY: actualPlacement === 'bottom' ? -10 : 10, 
              scale: 0.98 
            }} 
            animate={{ 
              opacity: 1, 
              translateY: 0, 
              scale: 1 
            }} 
            exit={{ 
              opacity: 0, 
              translateY: actualPlacement === 'bottom' ? -10 : 10, 
              scale: 0.98 
            }} 
            transition={{ type: 'timing', duration: 200 }} 
            className={`
              absolute left-0 right-0 z-50
              ${placementMaps[actualPlacement]}
            `} 
            style={{ elevation: 8 }} 
          >
            <BlurCard radius='lg' placementRadius="all" intensity={60} tint="light">
              <ScrollView 
                style={{ maxHeight: 200 }} 
                nestedScrollEnabled 
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                {options.map((item, index) => (
                  <Pressable
                    key={`${item.value}-${index}`}
                    onPress={() => handleSelect(item.value)}
                    className={`
                      px-4 py-3 flex-row items-center justify-between
                      ${item.value === value ? 'dark:bg-zinc-300/10 bg-zinc-400/30' : 'bg-transparent'}
                      ${index === 0 ? 'rounded-t-lg' : ''}
                      ${index === options.length - 1 ? 'rounded-b-lg' : ''}
                    `}
                    android_ripple={{ color: '#27272a' }}
                  >
                    <Text
                      className={`text-base ${
                        item.value === value 
                          ? 'dark:text-white text-black font-medium' 
                          : 'dark:text-zinc-300 text-zinc-600'
                      }`}
                    >
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={18} color="#10b981" />
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