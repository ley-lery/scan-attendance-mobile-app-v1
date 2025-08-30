import { BlurCard, Button } from "@/godui";
import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, Modal, Text, View } from 'react-native';

interface AlertProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText,
  icon,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'timing', duration: 250 }}
        className="flex-1 justify-center items-center"
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.45)' }}
      >
        <MotiView
          from={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12 }}
          className="w-[90%] max-w-md  rounded-3xl px-7 py-8 shadow-2xl items-center"
          style={{
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
          }}
        >
          <BlurCard tint="default" radius="xl" classNames={{wrapper: 'bg-black/60 w-full'}}>
            <View className="items-center w-full">
              {icon}
              <Text className="text-lg font-semibold text-center mb-2 text-zinc-200 mt-1">{title}</Text>
              <Text className="text-base text-center mb-7 text-zinc-300 max-w-72">{message}</Text>
            </View>
            <View className="flex-row justify-center w-full gap-2 ">
              {onConfirm && (
                <Button
                  label={confirmText}
                  onPress={onConfirm}
                  color="primary"
                  className="flex-1"
                  size="sm"
                  radius="full"
                />
              )}
              {onCancel && (
                <Button
                  label={cancelText}
                  onPress={onCancel}
                  color="danger"
                  className="flex-1"
                  variant="flat"
                  size="sm"
                  radius="full"
                />
              )}
            </View>
          </BlurCard>
        </MotiView>
      </MotiView>
    </Modal>
  );
};
