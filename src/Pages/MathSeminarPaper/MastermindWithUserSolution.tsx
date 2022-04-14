import React, { useEffect, useMemo, useState } from "react";
import InteractiveMastermind from "./InteractiveMastermind";
import styles from "./Mastermind.module.css";
import EditableCode from "./MastermindEditableCode";
import { GuessResponse } from "./MastermindUtilities";
import { SolutionSpace } from "./MastermindWithSolutionSpace";

type Props = {
  numColors?: number;
  wordLength?: number;
  showSolutionSpace?: boolean;
  presetGuess?: number[];
  setParentGuessResponse?: React.Dispatch<
    React.SetStateAction<GuessResponse | undefined>
  >;
  children?: React.ReactNode;
};

const MastermindWithUserSolution: React.FC<Props> = ({
  numColors = 6,
  wordLength = 4,
  setParentGuessResponse,
  ...props
}) => {
  const [solution, setSolution] = useState<number[]>(Array(wordLength).fill(0));
  const [guessResponse, setGuessResponse] = useState<GuessResponse>();
  const [presetGuess, setPresetGuess] = useState<number[] | undefined>();

  useEffect(() => {
    setPresetGuess(props.presetGuess);
  }, [props.presetGuess]);

  useEffect(() => {
    setParentGuessResponse?.(guessResponse);
  }, [guessResponse, setParentGuessResponse]);

  const solutionPlusOne = useMemo(
    () => solution.map((value) => value + 1),
    [solution]
  );

  return (
    <>
      {props.showSolutionSpace && (
        <SolutionSpace
          numColors={numColors}
          wordLength={wordLength}
          latestGuessResponse={guessResponse}
          setGuess={setPresetGuess}
        />
      )}
      <div className={styles.boardContainer}>
        <div className={styles.board}>
          Solution:
          <EditableCode
            numColors={numColors}
            wordLength={wordLength}
            code={solution}
            setCode={setSolution}
          />
        </div>
      </div>
      {props.children}
      <InteractiveMastermind
        numColors={numColors}
        wordLength={wordLength}
        setParentGuessResponse={setGuessResponse}
        externalSolution={solutionPlusOne}
        externalGuess={presetGuess}
      />
    </>
  );
};

export default MastermindWithUserSolution;
