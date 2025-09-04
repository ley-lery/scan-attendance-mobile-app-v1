import { Card, useHaptic } from '@/godui';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface Card {
  id: number;
  title?: string;
  subtitle?: string;
  content?: string;
  status?: string;
  statusColor?: string;
}

interface Props {
  cardData: Card[];
  showCloseButton?: boolean;
}

const CardLongPress: React.FC<Props> = ({ cardData, showCloseButton = false }) => {
  const [showDetail, setShowDetail] = useState(false)
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const { trigger } = useHaptic()
  const colorScheme = useColorScheme()

  const handleLongPress = (card: any) => {
    setSelectedCard(card)
    setShowDetail(true)
    trigger(Haptics.ImpactFeedbackStyle.Medium)
  }

  const handleCloseDetail = () => {
    setShowDetail(false)
    setTimeout(() => setSelectedCard(null), 300)
  }

  const CardUi = ({ card }: { card: any }) => (
    <Pressable
      onLongPress={() => handleLongPress(card)}
      delayLongPress={300}
      className=" bg-white dark:bg-zinc-800 rounded-lg"
    >
      <View className="flex-row items-center justify-between p-4">
        <View className='flex-1 gap-1'> 
          <Text className="text-zinc-600 dark:text-zinc-200 font-semibold text-base mb-1">{card.title}</Text>
          <Text className="text-zinc-500 dark:text-zinc-400 text-sm">{card.subtitle}</Text>
        </View>
        <View className="flex-row items-center">
          <Entypo name="dot-single" size={24} color={card.statusColor} />
          <Text className={`text-base ${card.status === 'Upcoming' ? 'text-warning' : 'text-success'}`}>{card.status}</Text>
        </View>
      </View>
    </Pressable>
  )

  return (
    <>

      {/* Cards List */}
      <View className="flex-1">
        {cardData.map((card: any) => (
          <CardUi key={card.id} card={card} />
        ))}
      </View>

      {/* Detail Modal */}
      <Modal visible={showDetail} transparent animationType="fade" statusBarTranslucent>
        <AnimatePresence>
          {showDetail && selectedCard && (
            <BlurView intensity={50} tint={colorScheme === 'dark' ? 'dark' : 'light'} className='flex-1 '>
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'timing', duration: 200 }}
                className="absolute inset-0 flex-1 left-0 right-0  justify-center items-center"
                style={StyleSheet.absoluteFillObject}
              >
                <Pressable 
                  className="absolute inset-0" 
                  onPress={handleCloseDetail}
                />
                
                <MotiView
                  from={{ opacity: 0, scale: 0.8, translateY: 50 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, translateY: 50 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                  className="bg-white/70 dark:bg-zinc-600/70 rounded-3xl mx-6 w-full max-h-96"
                  style={styles.detailModal}
                >
                  {/* Detail Header */}
                  <View className="p-6">
                    <View className="flex-row items-center">
                      <View className="flex-1">
                        <Text className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
                          {selectedCard.title}
                        </Text>
                        <Text className="text-base text-zinc-500 dark:text-zinc-400">
                          {selectedCard.subtitle}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Detail Content */}
                  <View className="p-6 pt-0">
                    <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-6 ">
                      {selectedCard.content}
                    </Text>
                  </View>

                  {/* Close Button */}
                  {showCloseButton && (
                    <Pressable
                      onPress={handleCloseDetail}
                      className="absolute top-4 right-4 p-1 rounded-full items-center justify-center"
                      android_ripple={{
                        color: '#71717a',
                        borderless: true,
                      }}
                    >
                      <Ionicons name="close" size={20} color="#71717a" />
                    </Pressable>
                  )}
                </MotiView>
              </MotiView>
            </BlurView>
          )}
        </AnimatePresence>
      </Modal>
    </>
  )
}

export default CardLongPress

const styles = StyleSheet.create({
  detailModal: {
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    maxWidth: screenWidth - 48,
  }
})