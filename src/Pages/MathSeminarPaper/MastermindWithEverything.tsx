import React, { useCallback, useEffect, useMemo, useState } from "react";
import MastermindWithUserSolution from "./MastermindWithUserSolution";
import styles from "./Mastermind.module.css";
import { HeuristicFunction } from "./MastermindHeuristicAlgorithms";
import {
  getCodeFromIndex,
  GuessResponse,
  isPrimitiveCode,
  shouldEliminatePotentialSolution,
} from "./MastermindUtilities";

/**
 * I made this the day before it was due so it's super sloppy
 * and in dire need of a refactor. Many pieces are copy-paste
 * from MastermindWithHeuristic.
 */

type Props = {
  numColors?: number;
  wordLength?: number;
  heuristics: { [name: string]: HeuristicFunction };
};

const MastermindWithEverything: React.FC<Props> = ({
  numColors = 6,
  wordLength = 4,
  heuristics,
}) => {
  const numHeuristics = useMemo(
    () => Object.keys(heuristics).length,
    [heuristics]
  );

  const possibleGuesses = useMemo(
    () =>
      [...Array(numColors ** wordLength)].map((_, index) =>
        getCodeFromIndex(wordLength, numColors, index)
      ),
    [wordLength, numColors]
  );

  const [solSpace, setSolSpace] = useState(possibleGuesses);
  const [guessResponse, setGuessResponse] = useState<GuessResponse>();
  const [heuristicGuess, setHeuristicGuess] = useState<number[]>();
  const [isFirstGuess, setIsFirstGuess] = useState(true);

  const resetSolSpace = useCallback(() => {
    setSolSpace(possibleGuesses);
  }, [possibleGuesses]);

  useEffect(() => {
    resetSolSpace();
  }, [resetSolSpace]);

  const onRestart = () => {
    resetSolSpace();
    setIsFirstGuess(true);
    setHeuristicGuess(Array(wordLength).fill(0)); // SUPER dirty clear mechanism
  };

  useEffect(() => {
    if (guessResponse !== undefined) {
      setSolSpace((currSpace) =>
        currSpace.filter(
          (sol) => !shouldEliminatePotentialSolution(guessResponse, sol)
        )
      );
      setIsFirstGuess(false);
    }
  }, [guessResponse]);

  return (
    <MastermindWithUserSolution
      numColors={numColors}
      wordLength={wordLength}
      showSolutionSpace={true}
      presetGuess={heuristicGuess}
      onRestart={onRestart}
      setParentGuessResponse={setGuessResponse}
    >
      <div
        className={styles.heuristicButtonsGrid}
        style={{ gridTemplateColumns: `repeat(${numHeuristics}, 1fr)` }}
      >
        {Object.entries(heuristics).map(([name, heuristic], index) => (
          <button
            className={styles.heuristicButton}
            onClick={() =>
              heuristic(
                isFirstGuess
                  ? possibleGuesses.filter(isPrimitiveCode)
                  : possibleGuesses,
                solSpace
              ).then((guess) => setHeuristicGuess(guess))
            }
            key={index}
          >
            {name}
          </button>
        ))}
        {Object.entries(heuristics).map(([name, heuristic], index) => (
          <button
            className={styles.heuristicButton}
            onClick={() =>
              heuristic(
                isFirstGuess
                  ? possibleGuesses.filter(isPrimitiveCode)
                  : solSpace,
                solSpace
              ).then((guess) => setHeuristicGuess(guess))
            }
            key={numHeuristics + index}
          >
            consistent {name}
          </button>
        ))}
      </div>
    </MastermindWithUserSolution>
  );
};

export default MastermindWithEverything;
