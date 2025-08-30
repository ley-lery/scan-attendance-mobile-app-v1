import { Audio } from 'expo-av';

export function useSound() {
  const play = async (source: any, volume: number = 1) => {
    const { sound } = await Audio.Sound.createAsync(source, { volume });
    await sound.playAsync();
    await sound.unloadAsync();
  };

  return { play };
}
