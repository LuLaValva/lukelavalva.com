import React, { useEffect, useMemo, useState } from "react";
import styles from "./Mastermind.module.css";
import InteractiveMastermind, { COLORS } from "./InteractiveMastermind";
import {
  GuessResponse,
  getCodeFromIndex,
  shouldEliminatePotentialSolution,
} from "./MastermindUtilities";

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
    return getCodeFromIndex(
      props.wordLength,
      props.numColors,
      props.solutionIndex
    );
  }, [props.numColors, props.solutionIndex, props.wordLength]);

  useEffect(() => {
    if (props.latestGuessResponse === undefined) {
      setRuledOut(false);
    } else if (
      !ruledOut &&
      shouldEliminatePotentialSolution(props.latestGuessResponse, solution)
    ) {
      setRuledOut(true);
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

type SolutionBlockProps = {
  numColors: number;
  wordLength: number;
  blockNumber: number;
  latestGuessResponse?: GuessResponse;
  setGuess: React.Dispatch<React.SetStateAction<number[] | undefined>>;
};

const SolutionBlock = (props: SolutionBlockProps) => {
  return (
    <div
      className={styles.solutionSpaceGrid}
      style={{ gridTemplateColumns: `repeat(${props.numColors}, auto)` }}
    >
      {[...Array(props.numColors ** (props.wordLength === 1 ? 1 : 2))].map(
        (_, index) => (
          <PotentialSolution
            key={index}
            numColors={props.numColors}
            wordLength={props.wordLength}
            solutionIndex={props.blockNumber * props.numColors ** 2 + index}
            latestGuessResponse={props.latestGuessResponse}
            setGuess={props.setGuess}
          />
        )
      )}
    </div>
  );
};

type SolutionSetProps = {
  numColors: number;
  wordLength: number;
  layer?: number;
  blockNumber?: number;
  latestGuessResponse?: GuessResponse;
  setGuess: React.Dispatch<React.SetStateAction<number[] | undefined>>;
};

const SolutionSet: React.FC<SolutionSetProps> = ({
  layer = 0,
  blockNumber = 0,
  ...props
}) => {
  return props.wordLength - layer <= 2 ? (
    <SolutionBlock
      numColors={props.numColors}
      wordLength={props.wordLength}
      blockNumber={blockNumber}
      latestGuessResponse={props.latestGuessResponse}
      setGuess={props.setGuess}
    />
  ) : (
    <div className={styles.solutionSet}>
      {[...Array(props.numColors)].map((_0, index) => (
        <SolutionSet
          {...props}
          layer={layer + 1}
          blockNumber={blockNumber * props.numColors + index}
          key={index}
        />
      ))}
    </div>
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
        <SolutionSet
          numColors={numColors}
          wordLength={wordLength}
          latestGuessResponse={latestGuessResponse}
          setGuess={setPresetGuess}
        />
      </div>
      {props.children}
      <InteractiveMastermind
        numColors={numColors}
        wordLength={wordLength}
        setParentGuessResponse={setLatestGuessResponse}
        externalGuess={presetGuess}
      />
    </>
  );
};

export default MastermindWithSolutionSpace;
