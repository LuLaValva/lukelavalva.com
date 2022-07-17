import React, { useCallback, useEffect, useMemo, useState } from "react";
import { HeuristicFunction } from "./MastermindHeuristicAlgorithms";
import {
  getCodeFromIndex,
  GuessResponse,
  isPrimitiveCode,
  shouldEliminatePotentialSolution,
} from "./MastermindUtilities";
import MastermindWithUserSolution from "./MastermindWithUserSolution";

type Props = {
  numColors: number;
  wordLength: number;
  heuristic: HeuristicFunction;
  showSolutionSpace?: boolean;
  isConsistent?: boolean;
};

const MastermindWithHeuristic: React.FC<Props> = ({
  numColors = 6,
  wordLength = 4,
  heuristic,
  ...props
}) => {
  const possibleGuesses = useMemo(
    () =>
      [...Array(numColors ** wordLength)].map((_, index) =>
        getCodeFromIndex(wordLength, numColors, index)
      ),
    [wordLength, numColors]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [solSpace, setSolSpace] = useState(possibleGuesses);
  const [guessResponse, setGuessResponse] = useState<
    GuessResponse | undefined
  >();
  const [heuristicGuess, setHeuristicGuess] = useState<number[] | undefined>();

  const resetSolSpace = useCallback(() => {
    setSolSpace(possibleGuesses);
  }, [possibleGuesses]);

  useEffect(() => {
    resetSolSpace();
  }, [resetSolSpace]);

  useEffect(() => {
    if (guessResponse) {
      setSolSpace((currSpace) => {
        const newSolSpace = currSpace.filter(
          (sol) => !shouldEliminatePotentialSolution(guessResponse, sol)
        );
        heuristic(
          props.isConsistent ? newSolSpace : possibleGuesses,
          newSolSpace
        ).then((guess) => setHeuristicGuess(guess));
        return newSolSpace;
      });
    } else {
      heuristic(possibleGuesses.filter(isPrimitiveCode), possibleGuesses).then(
        (guess) => {
          setHeuristicGuess(guess);
        }
      );
    }
  }, [guessResponse, heuristic, possibleGuesses, props.isConsistent]);

  return (
    <MastermindWithUserSolution
      numColors={numColors}
      wordLength={wordLength}
      presetGuess={heuristicGuess}
      setParentGuessResponse={setGuessResponse}
      showSolutionSpace={props.showSolutionSpace}
      onRestart={resetSolSpace}
    />
  );
};

export default MastermindWithHeuristic;
