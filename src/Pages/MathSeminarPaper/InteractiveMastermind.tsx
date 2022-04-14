import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./Mastermind.module.css";
import {
  PegSet,
  PEG,
  GuessResponse,
  calculateDistanceVector,
} from "./MastermindUtilities";

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

const generateRandomRow = (wordLength: number, numColors: number) =>
  [...Array(wordLength)].map(() => Math.floor(Math.random() * numColors) + 1);

const generatePegMessage = (pegs: PegSet) => {
  let correctMessage = pegs[PEG.BULLS]
    ? `${pegs[PEG.BULLS]} ${
        pegs[PEG.BULLS] === 1 ? "peg is" : "pegs are"
      } in the correct spot`
    : null;
  let presentMessage = pegs[PEG.COWS]
    ? `${pegs[PEG.COWS]} ${
        pegs[PEG.COWS] === 1 ? "peg is" : "pegs are"
      } present in the code but not in the right location`
    : null;

  if (presentMessage && correctMessage)
    return `${correctMessage}, and ${presentMessage}.`;
  else if (presentMessage || correctMessage)
    return `${correctMessage || presentMessage}.`;
  else return "None of these pegs are present in the code.";
};

type PegsProps = {
  pegSet: PegSet;
};

export const MastermindPegs: React.FC<PegsProps> = (props) => (
  <div className={styles.pegs} title={generatePegMessage(props.pegSet)}>
    {[...Array(props.pegSet[PEG.BULLS])].map((_, index) => (
      <div
        className={styles.peg}
        style={{ backgroundColor: "red" }}
        key={index}
      />
    ))}
    {[...Array(props.pegSet[PEG.COWS])].map((_, index) => (
      <div
        className={styles.peg}
        style={{ backgroundColor: "white" }}
        key={index + props.pegSet[PEG.BULLS]}
      />
    ))}
    {[...Array(props.pegSet[PEG.EMPTY])].map((_, index) => (
      <div
        className={styles.peg}
        style={{ backgroundColor: "black" }}
        key={index + props.pegSet[PEG.BULLS] + props.pegSet[PEG.COWS]}
      />
    ))}
  </div>
);

type RowProps = {
  guesses: number[];
  updateColor: (guessIndex: number, value?: number) => void;
  submitGuess: () => PegSet;
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
          onClick={() =>
            props.updateColor(index, solutions ? guess : undefined)
          }
        />
      ))}
      {solutions ? (
        <MastermindPegs pegSet={solutions} />
      ) : (
        <button
          className={styles.guessButton}
          onClick={() => setAnswers(props.submitGuess())}
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
  setParentGuessResponse?: React.Dispatch<
    React.SetStateAction<GuessResponse | undefined>
  >;
  externalGuess?: number[];
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
  const [gameLengthHistory, setGameLengthHistory] = useState<number[]>([]);

  const numTotalGuesses = useMemo(
    () => gameLengthHistory.reduce((sum, next) => sum + next, 0),
    [gameLengthHistory]
  );

  const restartGame = useCallback(() => {
    setGameLengthHistory([...gameLengthHistory, board.length]);
    setBoard([Array(wordLength).fill(0)]);
    setAnswer(generateRandomRow(wordLength, numColors));
    setSuccess(false);
    props.setParentGuessResponse && props.setParentGuessResponse(undefined);
  }, [board.length, gameLengthHistory, numColors, wordLength, props]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => restartGame(), [numColors, wordLength]);

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

  const submitGuess = () => {
    const guess = board[board.length - 1];
    const pegs = calculateDistanceVector(board[board.length - 1], solution);

    props.setParentGuessResponse &&
      props.setParentGuessResponse({ guess: guess, pegs: pegs });

    if (pegs[PEG.BULLS] === wordLength) {
      setSuccess(true);
    } else {
      // Add empty row
      setBoard((currBoard) => [...currBoard, Array(wordLength).fill(0)]);
    }
    return pegs;
  };

  useEffect(() => {
    setBoard((currBoard) => {
      if (props.externalGuess) {
        let newBoard = [...currBoard];
        newBoard[newBoard.length - 1] = props.externalGuess;
        return newBoard;
      } else return currBoard;
    });
  }, [props.externalGuess]);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <MastermindRow
            guesses={row}
            key={rowIndex + numTotalGuesses}
            updateColor={updateColor}
            submitGuess={submitGuess}
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
    </div>
  );
};

export default InteractiveMastermind;
