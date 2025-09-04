import { useAudioPlayer } from 'expo-audio';

export function useSound() {
  const play = async (source: any, volume: number = 1) => {
    try {
      const player = useAudioPlayer(source);
      player.volume = volume;
      player.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return { play };
}
