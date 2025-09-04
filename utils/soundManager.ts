import { useAudioPlayer } from 'expo-audio';

// Since expo-audio uses hooks, we'll create a simpler approach
// This will be used as a utility function rather than a class

const soundFiles = {
  failed: require('../assets/sounds/error-beep.mp3'),
  success: require('../assets/sounds/success-chime.mp3'),
  error: require('../assets/sounds/error-beep.mp3'),
};

// Create a hook-based sound manager
export const useSoundManager = () => {
  const failedPlayer = useAudioPlayer(soundFiles.failed);
  const successPlayer = useAudioPlayer(soundFiles.success);
  const errorPlayer = useAudioPlayer(soundFiles.error);

  const play = (key: 'success' | 'error' | 'failed') => {
    try {
      switch (key) {
        case 'success':
          successPlayer.seekTo(0);
          successPlayer.play();
          break;
        case 'error':
          errorPlayer.seekTo(0);
          errorPlayer.play();
          break;
        case 'failed':
          failedPlayer.seekTo(0);
          failedPlayer.play();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };


  return { play };
};

// For backward compatibility, create a simple function-based approach
export const playSound = (key: 'success' | 'error' | 'failed') => {
  console.warn('playSound function is deprecated. Use useSoundManager hook instead.');
};

// Default export for backward compatibility
export default { useSoundManager, playSound };