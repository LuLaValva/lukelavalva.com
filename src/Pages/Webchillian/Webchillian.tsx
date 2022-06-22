import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import KeyboardDisplay, { GeneralKeyEvent } from "./KeyboardDisplay";
import useOscillator from "./useOscillator";

const KEY_OFFSETS: { [key: string]: number } = {
  z: -8,
  x: -7,
  c: -6,
  v: -5,
  a: -4,
  s: -3,
  d: -2,
  f: -1,
  " ": 0,
  j: 1,
  k: 2,
  l: 3,
  ";": 4,
  n: 5,
  m: 6,
  ",": 7,
  ".": 8,
};

const SPECIAL_KEYS = {
  repeat: ["g", "h"],
  reset: ["b"],
};

type Props = {
  scale: number[];
  baseGain?: number;
};

const Webchillian = ({ scale, baseGain = 0 }: Props) => {
  const [audioCtx] = useState(() => new AudioContext());
  const oscillator = useOscillator(audioCtx);

  const [gain, setGain] = useState(baseGain);
  const [scaleIndex, setScaleIndex] = useState(0);

  const [lastNoteChange, setLastNoteChange] = useState(0);

  const reset = useCallback(() => {
    setScaleIndex(0);
    setGain(baseGain);
  }, [baseGain]);

  useEffect(() => {
    reset();
  }, [scale, baseGain, reset]);

  const traverseScale = useCallback(
    (n: number) => {
      setLastNoteChange(n);

      let gainOffset = 0;
      let i = scaleIndex;
      if (n < 0) {
        while (n++ < 0) {
          gainOffset -= scale[i];
          i = (i || scale.length) - 1;
        }
      } else {
        while (n-- > 0) {
          i = (i + 1) % scale.length;
          gainOffset += scale[i];
        }
      }

      setScaleIndex(i);
      const newGain = gain + gainOffset;
      setGain(newGain);
      return newGain;
    },
    [gain, scale, scaleIndex]
  );

  const playWithOffset = useCallback(
    (n: number = 0) => {
      oscillator.start(traverseScale(n));
    },
    [oscillator, traverseScale]
  );

  const keyDownEvent = useCallback(
    (e: GeneralKeyEvent) => {
      if (e.repeat) return;

      if (Object.hasOwn(KEY_OFFSETS, e.key)) playWithOffset(KEY_OFFSETS[e.key]);
      else if (SPECIAL_KEYS.repeat.includes(e.key))
        playWithOffset(lastNoteChange);
      else if (SPECIAL_KEYS.reset.includes(e.key)) reset();
    },
    [lastNoteChange, playWithOffset, reset]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyDownEvent);
    window.addEventListener("keyup", oscillator.stop);

    return () => {
      window.removeEventListener("keydown", keyDownEvent);
      window.addEventListener("keyup", oscillator.stop);
    };
  }, [keyDownEvent, oscillator.stop]);

  return (
    <KeyboardDisplay
      onRelease={oscillator.stop}
      onKeydown={keyDownEvent}
      additionalKeyLabels={{ ...KEY_OFFSETS, g: "R", h: "R", b: "--" }}
    />
  );
};

export default Webchillian;
