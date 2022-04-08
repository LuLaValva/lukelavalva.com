import React, { useEffect, useMemo, useState } from "react";
import {
  calculateDistanceVector,
  COLORS,
  INFORMATION_PEGS,
  MastermindPegs,
} from "./InteractiveMastermind";
import styles from "./Mastermind.module.css";

type Props = {
  numColors?: number;
  wordLength?: number;
};

const MastermindDistanceVector: React.FC<Props> = ({
  numColors = 6,
  wordLength = 4,
  ...props
}) => {
  const [word1, setWord1] = useState<number[]>(Array(wordLength).fill(0));
  const [word2, setWord2] = useState<number[]>(Array(wordLength).fill(0));

  useEffect(() => {
    setWord1((lastWord) =>
      wordLength - lastWord.length > 0
        ? [...lastWord, ...Array(wordLength - lastWord.length).fill(0)]
        : lastWord.slice(0, wordLength)
    );
    setWord2((lastWord) =>
      wordLength - lastWord.length > 0
        ? [...lastWord, ...Array(wordLength - lastWord.length).fill(0)]
        : lastWord.slice(0, wordLength)
    );
  }, [wordLength]);

  useEffect(() => {
    setWord1((lastWord) => lastWord.map((value) => value % numColors));
    setWord2((lastWord) => lastWord.map((value) => value % numColors));
  }, [numColors]);

  const distanceVector = useMemo(
    () => calculateDistanceVector(word1, word2),
    [word1, word2]
  );

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        <div className={styles.row}>
          {word1.map((value, index) => (
            <button
              key={index}
              className={styles.guess}
              style={{ backgroundColor: COLORS[value] }}
              onClick={() => {
                setWord1((lastWord) => {
                  const newWord = [...lastWord];
                  newWord[index] = (newWord[index] + 1) % numColors;
                  return newWord;
                });
              }}
            />
          ))}
        </div>
        <div className={`${styles.row} ${styles.display}`}>
          <MastermindPegs pegSet={distanceVector} />
          <div className={styles.rowText}>
            ⟨{distanceVector[INFORMATION_PEGS.CORRECT_SPOT]},{" "}
            {distanceVector[INFORMATION_PEGS.WRONG_SPOT]},{" "}
            {distanceVector[INFORMATION_PEGS.NOWHERE]}⟩
          </div>
        </div>
        <div className={styles.row}>
          {word2.map((value, index) => (
            <button
              key={index}
              className={styles.guess}
              style={{ backgroundColor: COLORS[value] }}
              onClick={() => {
                setWord2((lastWord) => {
                  const newWord = [...lastWord];
                  newWord[index] = (newWord[index] + 1) % numColors;
                  return newWord;
                });
              }}
            />
          ))}
        </div>
        <button
          onClick={() => {
            setWord1(Array(wordLength).fill(0));
            setWord2(Array(wordLength).fill(0));
          }}
        >
          Reset Colors
        </button>
      </div>
    </div>
  );
};

export default MastermindDistanceVector;
