export enum PEG {
  EMPTY,
  COWS,
  BULLS,
}

export type PegSet = {
  [PEG.EMPTY]: number;
  [PEG.COWS]: number;
  [PEG.BULLS]: number;
};

export type GuessResponse = {
  guess: number[];
  pegs: PegSet;
};

export const calculateDistanceVector: (
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
    [PEG.EMPTY]: solution.length - numPresent - numCorrect,
    [PEG.COWS]: numPresent,
    [PEG.BULLS]: numCorrect,
  };
};

export const getCodeFromIndex = (
  wordLength: number,
  numColors: number,
  index: number
) => {
  const code = [];
  for (
    let i = 0, currSolution = index;
    i < wordLength;
    i++, currSolution = Math.floor(currSolution / numColors)
  )
    code.push((currSolution % numColors) + 1);
  return code;
};

export const shouldEliminatePotentialSolution = (
  response: GuessResponse,
  potentialSolution: number[]
) => {
  let pegsIfCorrect = calculateDistanceVector(
    response.guess,
    potentialSolution
  );
  return (
    pegsIfCorrect[PEG.BULLS] > response.pegs[PEG.BULLS] ||
    pegsIfCorrect[PEG.COWS] > response.pegs[PEG.COWS] ||
    pegsIfCorrect[PEG.EMPTY] > response.pegs[PEG.EMPTY]
  );
};
