import React from "react";
import { Eval, EVAL_COLORS } from "./Wordle";
import styles from "./WordleKeyboard.module.css";

type GenericKeyHandler = (e: { key: string }) => void;

const Key: React.FC<{
  letter: string;
  keyEvent: GenericKeyHandler;
  color?: Eval;
}> = ({ letter, keyEvent, color }) => {
  const colorStyles: React.CSSProperties =
    color === undefined ? {} : { backgroundColor: EVAL_COLORS[color] };

  return (
    <button
      key={letter}
      className={styles.key}
      style={colorStyles}
      onClick={() => keyEvent({ key: letter })}
    >
      {letter.toUpperCase()}
    </button>
  );
};

const KeyList: React.FC<{
  keys: string[];
  keyEvent: GenericKeyHandler;
  keyColors: { [letter: string]: Eval };
}> = ({ keys, keyEvent, keyColors }) => {
  return (
    <>
      {keys.map((key) => (
        <Key
          key={key}
          letter={key}
          keyEvent={keyEvent}
          color={keyColors[key]}
        />
      ))}
    </>
  );
};

const WordleKeyboard: React.FC<{
  keyEvent: GenericKeyHandler;
  keyColors: { [letter: string]: Eval };
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
