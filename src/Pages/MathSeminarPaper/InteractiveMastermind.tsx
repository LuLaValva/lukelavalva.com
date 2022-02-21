import React, { useMemo, useState } from "react";
import styles from "./Mastermind.module.css";

export const COLORS = [
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

export enum INFORMATION_PEGS {
  NOWHERE,
  WRONG_SPOT,
  CORRECT_SPOT,
}

export type PegSet = {
  [INFORMATION_PEGS.NOWHERE]: number;
  [INFORMATION_PEGS.WRONG_SPOT]: number;
  [INFORMATION_PEGS.CORRECT_SPOT]: number;
};

export type GuessResponse = {
  guess: number[];
  pegs: PegSet;
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
  const [solutions, setAnswers] = useState<undefined | PegSet>();

  return (
    <div className={styles.row}>
      {props.guesses.map((guess, index) => (
        <button
          key={index}
          className={styles.guess}
          style={{
            backgroundColor: guess ? COLORS[guess - 1] : "black",
          }}
          onClick={() => props.updateColor(index)}
        />
      ))}
      {solutions ? (
        <div className={styles.pegs} title={generatePegMessage(solutions)}>
          {[...Array(props.guesses.length)].map((_val, index) => (
            <div
              className={styles.peg}
              style={{
                backgroundColor:
                  index < solutions[INFORMATION_PEGS.CORRECT_SPOT]
                    ? "red"
                    : index <
                      solutions[INFORMATION_PEGS.CORRECT_SPOT] +
                        solutions[INFORMATION_PEGS.WRONG_SPOT]
                    ? "white"
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

export const calculateInformationPegs: (
  guesses: number[],
  solution: number[]
) => PegSet = (guesses: number[], solution: number[]) => {
  const solutionCopy = [...solution];
  let numCorrect = 0,
    numPresent = 0;
  let impreciseGuesses = guesses.filter((guess, index) => {
    if (solutionCopy[index] === guess) {
      solutionCopy[index] = -1;
      numCorrect++;
      return false;
    }
    return true;
  });
  impreciseGuesses.forEach((guess) => {
    let found = solutionCopy.indexOf(guess);
    if (found !== -1) {
      solutionCopy[found] = -1;
      numPresent++;
    }
  });

  return {
    [INFORMATION_PEGS.NOWHERE]: solution.length - numPresent - numCorrect,
    [INFORMATION_PEGS.WRONG_SPOT]: numPresent,
    [INFORMATION_PEGS.CORRECT_SPOT]: numCorrect,
  };
};

type Props = {
  numColors?: number;
  wordLength?: number;
  setParentGuessResponse?: React.Dispatch<
    React.SetStateAction<GuessResponse | undefined>
  >;
};

const InteractiveMastermind: React.FC<Props> = ({
  numColors = 6,
  wordLength = 4,
  ...props
}) => {
  const [board, setBoard] = useState([Array<number>(wordLength).fill(0)]);
  const [solution, setAnswer] = useState(
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
    props.setParentGuessResponse && props.setParentGuessResponse(undefined);
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

  const submitGuesses = () => {
    const guess = board[board.length - 1];
    const pegs = calculateInformationPegs(board[board.length - 1], solution);

    props.setParentGuessResponse &&
      props.setParentGuessResponse({ guess: guess, pegs: pegs });

    if (pegs[INFORMATION_PEGS.CORRECT_SPOT] === wordLength) {
      setSuccess(true);
    } else {
      // Add empty row
      setBoard((currBoard) => [...currBoard, Array(wordLength).fill(0)]);
    }
    return pegs;
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
          <h2>Code found after {board.length} guesses</h2>
          <button onClick={restartGame} className={styles.actionButton}>
            Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default InteractiveMastermind;
