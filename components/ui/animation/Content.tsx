import { Card } from '@/godui'
import { useIsFocused } from '@react-navigation/native'
import { MotiView } from 'moti'
import React from 'react'

interface ContentProps {
  children: React.ReactNode
  duration?: number
  delay?: number
}

export const Content = ({ children, duration = 300, delay = 0 }: ContentProps) => {
    const isFocused = useIsFocused();
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.9 }}
            transition={{ type: 'timing', duration: duration, delay: delay }}
        >
            <Card>
                {children}
            </Card>
        </MotiView>
    )
}

