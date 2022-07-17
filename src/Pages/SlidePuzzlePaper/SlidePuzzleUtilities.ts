import { SlidePuzzle } from "./SlidePuzzleDisplay";

function encodePuzzle(puzzle: SlidePuzzle): string {
  const nRows = String.fromCharCode(puzzle.length);
  const nCols = String.fromCharCode(puzzle[0].length);
  return (
    nRows +
    nCols +
    puzzle
      .map((row) => row.map((num) => String.fromCharCode(num)).join(""))
      .join("")
  );
}

function decodePuzzle(code: string): SlidePuzzle {
  const nRows = code.charCodeAt(0);
  const nCols = code.charCodeAt(1);
  const board = code.substring(2);
  return [...Array(nRows)].map((_, i) =>
    board
      .substring(i * nCols, i * nCols + nCols)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
}

const puzzleCache: { [code: string]: SlidePuzzle } = {};

export function cachePuzzle(puzzle: SlidePuzzle): string {
  const encoded = encodePuzzle(puzzle);
  puzzleCache[encoded] ??= puzzle.map((row) => [...row]);
  return encoded;
}

export function getCachedPuzzle(code: string): SlidePuzzle {
  if (puzzleCache[code] === undefined) puzzleCache[code] = decodePuzzle(code);

  return puzzleCache[code];
}

export function getCompositeKey(code1: string, code2: string): string {
  const [from, to] = code1 > code2 ? [code1, code2] : [code2, code1];
  return from + "," + to;
}

export function breakCompositeKey(key: string): [string, string] {
  const [code1, code2] = key.split(",");
  return [code1, code2];
}

export function isSolved(key: string) {
  for (let i = 2; i < key.length - 1; i++)
    if (key.charAt(i) != (i - 2).toString()) return false;
  return true;
}
