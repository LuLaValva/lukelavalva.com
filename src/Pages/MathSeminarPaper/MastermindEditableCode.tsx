import styles from "./Mastermind.module.css";
import { COLORS } from "./InteractiveMastermind";
import { useEffect } from "react";

type Props = {
  numColors: number;
  wordLength: number;
  code: number[];
  setCode: React.Dispatch<React.SetStateAction<number[]>>;
};

const EditableCode: React.FC<Props> = ({
  numColors,
  wordLength,
  code,
  setCode,
}) => {
  useEffect(() => {
    setCode((lastWord) =>
      wordLength - lastWord.length > 0
        ? [...lastWord, ...Array(wordLength - lastWord.length).fill(0)]
        : lastWord.slice(0, wordLength)
    );
  }, [wordLength, setCode]);

  useEffect(() => {
    setCode((lastWord) => lastWord.map((value) => value % numColors));
  }, [numColors, setCode]);

  return (
    <div className={styles.row}>
      {code.map((value, index) => (
        <button
          key={index}
          className={styles.guess}
          style={{ backgroundColor: COLORS[value] }}
          onClick={() => {
            setCode((lastWord) => {
              const newWord = [...lastWord];
              newWord[index] = (newWord[index] + 1) % numColors;
              return newWord;
            });
          }}
        />
      ))}
    </div>
  );
};

export default EditableCode;
