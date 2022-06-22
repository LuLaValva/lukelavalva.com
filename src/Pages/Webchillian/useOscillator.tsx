import { useEffect, useState } from "react";
import { MIDDLE_C_FREQUENCY } from "./MusicalConstants";

function useOscillator(audioCtx: AudioContext) {
  const [oscillator] = useState(() => audioCtx.createOscillator());
  const [gain] = useState(() => audioCtx.createGain());

  useEffect(() => {
    oscillator.connect(gain);
    oscillator.start();
    oscillator.frequency.value = MIDDLE_C_FREQUENCY;
    gain.connect(audioCtx.destination);
    gain.gain.value = 0;
  }, [oscillator, audioCtx, gain]);

  return {
    get detune() {
      return oscillator.detune.value;
    },

    start: (detune = 0, desiredGain = 2) => {
      oscillator.detune.value = detune;
      gain.gain.linearRampToValueAtTime(desiredGain, 0.01);
    },
    stop: () => {
      gain.gain.linearRampToValueAtTime(0, 0.01);
    },
  };
}

export default useOscillator;
