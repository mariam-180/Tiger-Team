let currentAudio = null;

export const playSound = async (sound) => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      await currentAudio.play();
      return currentAudio;
    }

    const audio = new Audio(sound);

    currentAudio = audio;

    await currentAudio.play();

    return currentAudio;
  } catch (error) {
    console.error('Failed to play audio:', error);
    return null;
  }
};

export const stopSound = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};
