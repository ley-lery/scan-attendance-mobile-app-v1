import { Audio } from 'expo-av';

class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: Audio.Sound } = {};

  private constructor() {}

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  // Preload all sounds
  public async preloadSounds() {
    const failed = new Audio.Sound();
    const success = new Audio.Sound();
    const error = new Audio.Sound();

    await failed.loadAsync(require('../assets/sounds/error-beep.mp3'));
    await success.loadAsync(require('../assets/sounds/success-chime.mp3'));
    await error.loadAsync(require('../assets/sounds/error-beep.mp3'));

    this.sounds = { failed, success, error };
  }

  // Play a sound by key
  public async play(key: 'success' | 'error' | 'failed') {
    const sound = this.sounds[key];
    if (sound) {
      await sound.replayAsync(); // resets and plays
    }
  }

  // Optionally unload sounds to free memory
  public async unloadAll() {
    for (const key in this.sounds) {
      await this.sounds[key].unloadAsync();
    }
  }
}

export default SoundManager.getInstance();
