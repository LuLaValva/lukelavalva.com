import {
  PEG,
  PegSet,
  shouldEliminatePotentialSolution,
} from "./MastermindUtilities";

export type HeuristicFunction = (
  possibleGuesses: number[][],
  solSpace: number[][]
) => Promise<number[]>;

const getPossiblePegSets: (wordLength: number) => PegSet[] = (
  wordLength: number
) => {
  const possibleResponses = [...Array(wordLength + 1)].flatMap((_, numBulls) =>
    [...Array(wordLength - numBulls + 1)].map((_, numCows) => {
      return {
        [PEG.BULLS]: numBulls,
        [PEG.COWS]: numCows,
        [PEG.EMPTY]: wordLength - numBulls - numCows,
      };
    })
  );
  possibleResponses.splice(possibleResponses.length - 2, 1); // Impossible response
  return possibleResponses;
};

const getSolSpaceSizeAfterResponse = (
  solSpace: number[][],
  guess: number[],
  response: PegSet
) => {
  return solSpace.reduce(
    (count, solution) =>
      shouldEliminatePotentialSolution(
        { guess: guess, pegs: response },
        solution
      )
        ? count
        : count + 1,
    0
  );
};

const applyHeuristic = (
  possibleGuesses: number[][],
  solSpace: number[][],
  heuristic: (
    guess: number[],
    pegResponses: PegSet[],
    solSpace: number[][]
  ) => number
) => {
  if (solSpace.length === 1) return solSpace[0];
  let bestGuess = possibleGuesses[0];
  let bestScore = undefined;
  let pegResponses = getPossiblePegSets(possibleGuesses[0].length);
  for (let guess of possibleGuesses) {
    const currScore = heuristic(guess, pegResponses, solSpace);
    if (bestScore === undefined || currScore < bestScore) {
      bestScore = currScore;
      bestGuess = guess;
    }
  }
  return bestGuess;
};

export const minimax: HeuristicFunction = async (possibleGuesses, solSpace) => {
  return applyHeuristic(
    possibleGuesses,
    solSpace,
    (guess, pegResponses, solSpace) => {
      let worstCase = 0;
      for (let pegSet of pegResponses) {
        const solSpaceReducedSize = getSolSpaceSizeAfterResponse(
          solSpace,
          guess,
          pegSet
        );
        if (solSpaceReducedSize > worstCase) worstCase = solSpaceReducedSize;
      }
      return worstCase;
    }
  );
};

export const expectedValue: HeuristicFunction = async (
  possibleGuesses,
  solSpace
) => {
  return applyHeuristic(
    possibleGuesses,
    solSpace,
    (guess, pegResponses, solSpace) =>
      pegResponses.reduce(
        (score, pegResponse) =>
          score +
          getSolSpaceSizeAfterResponse(solSpace, guess, pegResponse) ** 2,
        0
      )
  );
};
