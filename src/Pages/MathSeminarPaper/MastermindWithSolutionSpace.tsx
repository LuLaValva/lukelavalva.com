import React, { useEffect, useMemo, useState } from "react";
import styles from "./Mastermind.module.css";
import InteractiveMastermind, {
  INFORMATION_PEGS,
  calculateInformationPegs,
  COLORS,
  GuessResponse,
} from "./InteractiveMastermind";

type PotentialSolutionProps = {
  numColors: number;
  wordLength: number;
  solutionIndex: number;
  latestGuessResponse?: GuessResponse;
  setGuess: React.Dispatch<React.SetStateAction<number[] | undefined>>;
};

const PotentialSolution: React.FC<PotentialSolutionProps> = (props) => {
  const [ruledOut, setRuledOut] = useState(false);

  const solution = useMemo(() => {
    const word = [];
    for (
      let i = 0, currSolution = props.solutionIndex;
      i < props.wordLength;
      i++, currSolution = Math.floor(currSolution / props.numColors)
    )
      word.push((currSolution % props.numColors) + 1);
    return word;
  }, [props.numColors, props.solutionIndex, props.wordLength]);

  useEffect(() => {
    if (props.latestGuessResponse !== undefined) {
      if (!ruledOut) {
        let pegsIfCorrect = calculateInformationPegs(
          props.latestGuessResponse.guess,
          solution
        );
        if (
          pegsIfCorrect[INFORMATION_PEGS.CORRECT_SPOT] >
            props.latestGuessResponse.pegs[INFORMATION_PEGS.CORRECT_SPOT] ||
          pegsIfCorrect[INFORMATION_PEGS.WRONG_SPOT] >
            props.latestGuessResponse.pegs[INFORMATION_PEGS.WRONG_SPOT] ||
          pegsIfCorrect[INFORMATION_PEGS.NOWHERE] >
            props.latestGuessResponse.pegs[INFORMATION_PEGS.NOWHERE]
        )
          setRuledOut(true);
      }
    } else {
      setRuledOut(false);
    }
  }, [props.latestGuessResponse, ruledOut, solution]);

  return (
    <button
      className={styles.solution}
      onClick={() => props.setGuess(solution)}
      disabled={ruledOut}
    >
      {solution.map((colorIndex, index) => (
        <div
          className={styles.peg}
          key={index}
          style={{ backgroundColor: COLORS[colorIndex - 1] }}
        />
      ))}
    </button>
  );
};

type Props = {
  numColors?: number;
  wordLength?: number;
  children?: React.ReactNode;
};

const MastermindWithSolutionSpace: React.FC<Props> = ({
  numColors = 4,
  wordLength = 2,
  ...props
}) => {
  const [latestGuessResponse, setLatestGuessResponse] =
    useState<GuessResponse>();

  const [presetGuess, setPresetGuess] = useState<number[]>();

  return (
    <>
      <div className={styles.solutionSpaceGridContainer}>
        <div
          className={styles.solutionSpaceGrid}
          style={{ gridTemplateColumns: `repeat(${numColors}, auto)` }}
        >
          {[...Array(numColors ** wordLength)].map((_, index) => (
            <PotentialSolution
              numColors={numColors}
              wordLength={wordLength}
              solutionIndex={index}
              key={index}
              latestGuessResponse={latestGuessResponse}
              setGuess={setPresetGuess}
            />
          ))}
        </div>
      </div>
      {props.children}
      <InteractiveMastermind
        numColors={numColors}
        wordLength={wordLength}
        setParentGuessResponse={setLatestGuessResponse}
        presetGuess={presetGuess}
      />
    </>
  );
};

export default MastermindWithSolutionSpace;
