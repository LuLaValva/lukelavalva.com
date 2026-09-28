import React, { useEffect, useRef, useState } from "react";
import styles from "../AcademicPaper.module.css";

type Props = {
  value: number;
  updateValue: (newValue: number) => void;
  min?: number;
  max?: number;
};

const NumberScrubber = (props: Props) => {
  const [currentValue, setCurrentValue] = useState(props.value);
  const [pointerStartPos, setPointerStartPos] = useState({ x: 0, y: 0 });
  const scrubber = useRef<HTMLDivElement>(null);

  useEffect(() => setCurrentValue(props.value), [props.value]);

  // React listens for touches passively, where preventDefault does nothing, so
  // the drag would scroll the page out from under itself.
  useEffect(() => {
    const element = scrubber.current;
    if (!element) return;
    const holdStill = (e: TouchEvent) => e.preventDefault();
    element.addEventListener("touchstart", holdStill, { passive: false });
    element.addEventListener("touchmove", holdStill, { passive: false });
    return () => {
      element.removeEventListener("touchstart", holdStill);
      element.removeEventListener("touchmove", holdStill);
    };
  }, []);

  const applyBounds = (value: number) => {
    if (props.min && value < props.min) return props.min;
    if (props.max && value > props.max) return props.max;
    return value;
  };

  const updateValueWithBounds = (newValue: number) => {
    props.updateValue(applyBounds(newValue));
  };

  const handlePointerStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
    setPointerStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      setCurrentValue(
        applyBounds(
          props.value +
            Math.floor(
              (e.clientX - e.clientY - pointerStartPos.x + pointerStartPos.y) /
                30
            )
        )
      );
    }
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.releasePointerCapture(e.pointerId);
    updateValueWithBounds(currentValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let actionKey = true;
    switch (e.key) {
      case "ArrowUp":
      case "ArrowRight":
        updateValueWithBounds(currentValue + 1);
        break;
      case "ArrowDown":
      case "ArrowLeft":
        updateValueWithBounds(currentValue - 1);
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        updateValueWithBounds(+e.key);
        break;
      default:
        actionKey = false;
    }
    if (actionKey) e.preventDefault();
  };

  return (
    <div
      ref={scrubber}
      className={styles.draggableNumber}
      onPointerDown={handlePointerStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {currentValue}
    </div>
  );
};

export default NumberScrubber;
