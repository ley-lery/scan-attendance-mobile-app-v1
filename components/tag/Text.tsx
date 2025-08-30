import i18n from '@/assets/translate/i18n';
import React, { ReactNode } from 'react';
import { StyleProp, Text as TextNative, TextStyle } from 'react-native';

interface TextProps {
    children: ReactNode;
    className?: string;
    style?: StyleProp<TextStyle>;
}

export const Text = ({children, className, style, ...props}: TextProps) => {
  const lang = i18n.language;
  return (
    <TextNative className={[
      className,
      lang === 'kh' ? 'font-kregular' : ''
      ].join(' ')} 
      {...props}
    >
      {children}
    </TextNative>
  )
}
