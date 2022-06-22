import React from "react";
import styles from "./KeyboardDisplay.module.css";

export type GeneralKeyEvent = {
  readonly key: string;
  readonly repeat?: boolean;
};

const KEYBOARD = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
  ["z", "x", "c", "v", "b", "n", "m", ",", "."],
];

type Props = {
  onRelease: () => void;
  onKeydown: (e: GeneralKeyEvent) => void;
  additionalKeyLabels: { [key: string]: any };
};

const KeyboardDisplay = (props: Props) => {
  return (
    <div className={styles.keyboard}>
      {KEYBOARD.map((row) => (
        <div className={styles.keyboardRow}>
          {row.map((key) => (
            <button
              className={styles.key}
              onPointerDown={() => {
                props.onKeydown({ key: key });
              }}
              onPointerUp={props.onRelease}
              onPointerOut={props.onRelease}
            >
              <div>{key.toUpperCase()}</div>
              <div className={styles.mainKeyLabel}>
                {props.additionalKeyLabels[key]}
              </div>
            </button>
          ))}
        </div>
      ))}
      <div className={styles.keyboardRow}>
        <button
          className={styles.key + " " + styles.spacebar}
          onPointerDown={() => {
            props.onKeydown({ key: " " });
          }}
          onTouchStart={() => {
            props.onKeydown({ key: " " });
          }}
          onPointerUp={props.onRelease}
          onPointerOut={props.onRelease}
          onTouchCancel={props.onRelease}
          onTouchEnd={props.onRelease}
        >
          <div className={styles.mainKeyLabel}>
            {props.additionalKeyLabels[" "]}
          </div>
        </button>
      </div>
    </div>
  );
};

export default KeyboardDisplay;
