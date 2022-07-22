import React from "react";
import { colorClasses } from "./Wordle";
import styles from "./WordleKeyboard.module.css";

const KeyList: React.FC<{
  keys: string[];
  keyEvent: (e: { key: string }) => void;
  keyColors: { [letter: string]: 0 | 1 | 2 };
}> = ({ keys, keyEvent, keyColors }) => {
  return (
    <>
      {keys.map((key) => (
        <button
          key={key}
          className={
            styles.key +
            " " +
            (keyColors[key] !== undefined &&
              styles[colorClasses[keyColors[key]]])
          }
          onClick={() => keyEvent({ key })}
        >
          {key.toUpperCase()}
        </button>
      ))}
    </>
  );
};

const WordleKeyboard: React.FC<{
  keyEvent: (e: { key: string }) => void;
  keyColors: { [letter: string]: 0 | 1 | 2 };
}> = ({ keyEvent, keyColors }) => {
  return (
    <div className={styles.keyboard}>
      <div className={styles.keyboardRow}>
        <KeyList
          keys={["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]}
          keyEvent={keyEvent}
          keyColors={keyColors}
        />
      </div>
      <div className={styles.keyboardRow}>
        <KeyList
          keys={["a", "s", "d", "f", "g", "h", "j", "k", "l"]}
          keyEvent={keyEvent}
          keyColors={keyColors}
        />
      </div>
      <div className={styles.keyboardRow}>
        <button
          className={styles.key + " " + styles.special}
          onClick={() => keyEvent({ key: "Enter" })}
        >
          ENTER
        </button>
        <KeyList
          keys={["z", "x", "c", "v", "b", "n", "m"]}
          keyEvent={keyEvent}
          keyColors={keyColors}
        />
        <button
          className={styles.key + " " + styles.special}
          onClick={() => keyEvent({ key: "Delete" })}
        >
          DEL
        </button>
      </div>
    </div>
  );
};

export default WordleKeyboard;
