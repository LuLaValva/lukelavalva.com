import seedrandom, { PRNG } from "seedrandom";

function diagonalLatinSquare(n: number) {
  return [...Array(n)].map((_, i) =>
    [...Array(n)].map((_, j) => ((i + j) % n) + 1)
  );
}

function shuffle<T>(arr: T[], rng = seedrandom()) {
  return arr
    .map((val) => ({ val, shuf: rng() }))
    .sort((a, b) => a.shuf - b.shuf)
    .map(({ val }) => val);
}

export function randomLatinSquare(
  n: number,
  numShuffles: number = 5,
  rng?: PRNG
) {
  let square = diagonalLatinSquare(n);
  for (let i = 0; i < numShuffles; i++) {
    const shuffled = shuffle(square, rng);
    const rotated = shuffled[0].map((_, i) => shuffled.map((row) => row[i]));
    square = rotated;
  }
  return square;
}

function getAdjacent(cages: number[][], row: number, col: number, cageId = -1) {
  const adjacent: [number, number][] = [];
  if (row > 0 && cages[row - 1][col] === cageId) adjacent.push([row - 1, col]);
  if (col > 0 && cages[row][col - 1] === cageId) adjacent.push([row, col - 1]);
  if (row < cages.length - 1 && cages[row + 1][col] === cageId)
    adjacent.push([row + 1, col]);
  if (col < cages.length - 1 && cages[row][col + 1] === cageId)
    adjacent.push([row, col + 1]);
  return adjacent;
}

function makeCage(
  cages: number[][],
  startRow: number,
  startCol: number,
  cageIndex: number,
  rng = seedrandom()
) {
  cages[startRow][startCol] = cageIndex;
  let adjacentTiles = getAdjacent(cages, startRow, startCol);
  for (
    let numTiles = 1;
    numTiles < 4 && adjacentTiles.length > 0 && rng() < 0.75 ** numTiles;
    numTiles++
  ) {
    const [[row, col]] = adjacentTiles.splice(
      Math.floor(rng() * adjacentTiles.length),
      1
    );
    cages[row][col] = cageIndex;
    getAdjacent(cages, row, col).forEach(([newRow, newCol]) => {
      if (!adjacentTiles.some(([row, col]) => row === newRow && col === newCol))
        adjacentTiles.push([newRow, newCol]);
    });
  }
}

export function generateCageMap(n: number, seed?: string) {
  const rng = seedrandom(seed);

  const cages: number[][] = [...Array(n)].map(() => Array(n).fill(-1));
  let currCage = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (cages[i][j] === -1) {
        makeCage(cages, i, j, currCage++, rng);
      }
    }
  }
  return cages;
}

export function getCageTiles(
  cageMap: number[][],
  cageRow: number,
  cageCol: number
) {
  const cageId = cageMap[cageRow][cageCol];
  const adjacent: [number, number][] = [[cageRow, cageCol]];
  const cageTiles: [number, number][] = [];
  for (let nextTile; (nextTile = adjacent.pop()); ) {
    cageTiles.push(nextTile);
    getAdjacent(cageMap, nextTile[0], nextTile[1], cageId).forEach(
      ([newRow, newCol]) => {
        if (
          !cageTiles.some(([row, col]) => row === newRow && col === newCol) &&
          !adjacent.some(([row, col]) => row === newRow && col === newCol)
        ) {
          adjacent.push([newRow, newCol]);
        }
      }
    );
  }

  return cageTiles;
}

enum Operation {
  DIVIDE = "/",
  MULTIPLY = "x",
  SUBTRACT = "-",
  ADD = "+",
}

function chooseOperation(
  cageMap: number[][],
  matrix: number[][],
  cageRow: number,
  cageCol: number,
  rng = seedrandom()
) {
  const cageTiles = getCageTiles(cageMap, cageRow, cageCol);

  if (cageTiles.length === 1) {
    const [[row, col]] = cageTiles;
    return "" + matrix[row][col];
  }
  if (cageTiles.length === 2) {
    const [[r1, c1], [r2, c2]] = cageTiles;
    const [x, y] = [matrix[r1][c1], matrix[r2][c2]];
    if (x % y === 0 && rng() < 0.5) return "" + x / y + Operation.DIVIDE;
    if (y % x === 0 && rng() < 0.5) return "" + y / x + Operation.DIVIDE;
    if (y > x && rng() < 0.5) return "" + (y - x) + Operation.SUBTRACT;
    if (x > y && rng() < 0.5) return "" + (x - y) + Operation.SUBTRACT;
  }
  if (rng() < 0.5)
    return (
      "" +
      cageTiles.reduce((sum, [row, col]) => (sum += matrix[row][col]), 0) +
      Operation.ADD
    );
  return (
    "" +
    cageTiles.reduce(
      (product, [row, col]) => (product *= matrix[row][col]),
      1
    ) +
    Operation.MULTIPLY
  );
}

export function generateLabels(cageMap: number[][], seed?: string) {
  const rng = seedrandom(seed);

  const n = cageMap.length;
  const latinSquare = randomLatinSquare(n, 5, rng);
  const labels = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (cageMap[i][j] === labels.length) {
        labels.push(chooseOperation(cageMap, latinSquare, i, j, rng));
      }
    }
  }

  return labels;
}

export function satisfyOperation(numbers: number[], operation: string) {
  const goal = +operation.slice(0, -1);
  switch (operation.slice(-1)) {
    case Operation.DIVIDE: {
      const [x, y] = numbers;
      return x / y === goal || y / x === goal;
    }
    case Operation.SUBTRACT: {
      const [x, y] = numbers;
      return x - y === goal || y - x === goal;
    }
    case Operation.ADD:
      return numbers.reduce((sum, n) => (n += sum), 0) === goal;
    case Operation.MULTIPLY:
      return numbers.reduce((product, n) => (n *= product), 1) === goal;
    default:
      return numbers[0] === +operation;
  }
}
