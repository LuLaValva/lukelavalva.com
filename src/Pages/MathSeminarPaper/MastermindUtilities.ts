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
  { guess, pegs }: GuessResponse,
  potentialSolution: number[]
) => {
  let pegsIfCorrect = calculateDistanceVector(guess, potentialSolution);
  return (
    pegsIfCorrect[PEG.BULLS] > pegs[PEG.BULLS] ||
    pegsIfCorrect[PEG.COWS] > pegs[PEG.COWS] ||
    pegsIfCorrect[PEG.EMPTY] > pegs[PEG.EMPTY]
  );
};

export const isPrimitiveCode = (code: number[]) => {
  // A primitive code is one that begins with 1 and is nondecreasing, with sequential increases
  if (code[0] !== 1) return false;
  for (let i = 1; i < code.length; i++) {
    if (!(code[i] === code[i - 1] || code[i] === code[i - 1] + 1)) return false;
  }
  return true;
};
