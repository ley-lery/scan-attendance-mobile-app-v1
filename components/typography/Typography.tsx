import { useThemeStore } from '@/stores/useThemeStore'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

type TypographyProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'subtitle'
  children: React.ReactNode
}

export const Typography: React.FC<TypographyProps> = ({ variant, children }) => {
    const theme = useThemeStore((state) => state.theme);
    const typographyStyles = {
        h1: styles.h1,
        h2: styles.h2,
        h3: styles.h3,
        h4: styles.h4,
        h5: styles.h5,
        h6: styles.h6,
        body: styles.body,
        caption: styles.caption,
        subtitle: styles.subtitle,
    }

    return (
        <Text style={[typographyStyles[variant], { color: theme === "1" ? "#db2777" : "#008ded" }]} >{children}</Text>
    )
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  h5: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  h6: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'normal',
  },
})
