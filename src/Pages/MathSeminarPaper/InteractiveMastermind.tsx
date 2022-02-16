import React, { useMemo, useState } from "react";
import styles from "./Mastermind.module.css";

const colors = [
  "red",
  "yellow",
  "lime",
  "aqua",
  "fuchsia",
  "white",
  "maroon",
  "blue",
  "green",
  "purple",
  "olive",
  "teal",
];

enum INFORMATION_PEGS {
  NOWHERE,
  WRONG_SPOT,
  CORRECT_SPOT,
}

type PegSet = {
  [INFORMATION_PEGS.WRONG_SPOT]: number;
  [INFORMATION_PEGS.CORRECT_SPOT]: number;
};

const generateRandomRow = (wordLength: number, numColors: number) =>
  [...Array(wordLength)].map(() => Math.floor(Math.random() * numColors) + 1);

const generatePegMessage = (pegs: PegSet) => {
  let correctMessage = pegs[INFORMATION_PEGS.CORRECT_SPOT]
    ? `${pegs[INFORMATION_PEGS.CORRECT_SPOT]} ${
        pegs[INFORMATION_PEGS.CORRECT_SPOT] === 1 ? "peg is" : "pegs are"
      } in the correct spot`
    : null;
  let presentMessage = pegs[INFORMATION_PEGS.WRONG_SPOT]
    ? `${pegs[INFORMATION_PEGS.WRONG_SPOT]} ${
        pegs[INFORMATION_PEGS.WRONG_SPOT] === 1 ? "peg is" : "pegs are"
      } present in the code but not in the same location`
    : null;

  if (presentMessage && correctMessage)
    return `${correctMessage}, and ${presentMessage}.`;
  else if (presentMessage || correctMessage)
    return `${correctMessage || presentMessage}.`;
  else return "None of these pegs are present in the code.";
};

type RowProps = {
  guesses: number[];
  updateColor: (guessIndex: number, value?: number) => void;
  submitGuesses: () => PegSet;
};

const MastermindRow: React.FC<RowProps> = (props: RowProps) => {
  const [answers, setAnswers] = useState<undefined | PegSet>();

  return (
    <div className={styles.row}>
      {props.guesses.map((guess, index) => (
        <button
          key={index}
          className={styles.guess}
          style={{ backgroundColor: guess ? colors[guess - 1] : "black" }}
          onClick={() => props.updateColor(index)}
        />
      ))}
      {answers ? (
        <div className={styles.pegs} title={generatePegMessage(answers)}>
          {[...Array(props.guesses.length)].map((_val, index) => (
            <div
              className={styles.peg}
              style={{
                backgroundColor:
                  index < answers[INFORMATION_PEGS.CORRECT_SPOT]
                    ? "white"
                    : index <
                      answers[INFORMATION_PEGS.CORRECT_SPOT] +
                        answers[INFORMATION_PEGS.WRONG_SPOT]
                    ? "red"
                    : "black",
              }}
              key={index}
            />
          ))}
        </div>
      ) : (
        <button
          className={styles.guessButton}
          onClick={() => setAnswers(props.submitGuesses())}
          disabled={props.guesses.includes(0)}
        >
          Guess
        </button>
      )}
    </div>
  );
};

type Props = {
  numColors?: number;
  wordLength?: number;
};

const InteractiveMastermind: React.FC<Props> = ({
  numColors = 6,
  wordLength = 4,
}) => {
  const [board, setBoard] = useState([Array<number>(wordLength).fill(0)]);
  const [answer, setAnswer] = useState(
    generateRandomRow(wordLength, numColors)
  );
  const [success, setSuccess] = useState(false);
  const [gameLengths, setGameLengths] = useState<number[]>([]);

  const rowIndexOffset = useMemo(
    () => gameLengths.reduce((sum, next) => sum + next, 0),
    [gameLengths]
  );

  const restartGame = () => {
    setGameLengths([...gameLengths, board.length]);
    setBoard([Array(wordLength).fill(0)]);
    setAnswer(generateRandomRow(wordLength, numColors));
    setSuccess(false);
  };

  const updateColor = (guessIndex: number, value?: number) => {
    success ||
      setBoard((currBoard) => {
        const newBoard = [...currBoard];
        const lastRow = newBoard.length - 1;
        newBoard[lastRow] = [...currBoard[lastRow]];
        newBoard[lastRow][guessIndex] =
          value || (newBoard[lastRow][guessIndex] + 1) % (numColors + 1);
        return newBoard;
      });
  };

  const submitGuesses: () => PegSet = () => {
    // Calculate information pegs
    let guesses = board[board.length - 1];
    const answerCopy = [...answer];
    let numCorrect = 0,
      numPresent = 0;
    guesses = guesses.filter((guess, index) => {
      if (answerCopy[index] === guess) {
        answerCopy[index] = -1;
        numCorrect++;
        return false;
      }
      return true;
    });
    guesses.forEach((guess) => {
      let found = answerCopy.indexOf(guess);
      if (found !== -1) {
        answerCopy[found] = -1;
        numPresent++;
      }
    });

    if (numCorrect === wordLength) {
      setSuccess(true);
    } else {
      // Add empty row
      setBoard((currBoard) => [...currBoard, Array(wordLength).fill(0)]);
    }
    return {
      [INFORMATION_PEGS.WRONG_SPOT]: numPresent,
      [INFORMATION_PEGS.CORRECT_SPOT]: numCorrect,
    };
  };

  return (
    <div className={styles.board}>
      {board.map((row, rowIndex) => (
        <MastermindRow
          guesses={row}
          key={rowIndex + rowIndexOffset}
          updateColor={updateColor}
          submitGuesses={submitGuesses}
        />
      ))}
      {success && (
        <>
          <h2>Code Found in {board.length} moves</h2>
          <button onClick={restartGame} className={styles.actionButton}>
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default InteractiveMastermind;
