function diagonalLatinSquare(n: number) {
  return [...Array(n)].map((_, i) =>
    [...Array(n)].map((_, j) => ((i + j) % n) + 1)
  );
}

function shuffle<T>(arr: T[]) {
  return arr
    .map((val) => ({ val, shuf: Math.random() }))
    .sort((a, b) => a.shuf - b.shuf)
    .map(({ val }) => val);
}

export function randomLatinSquare(n: number, numShuffles: number = 5) {
  let square = diagonalLatinSquare(n);
  for (let i = 0; i < numShuffles; i++) {
    const shuffled = shuffle(square);
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
  cageIndex: number
) {
  cages[startRow][startCol] = cageIndex;
  let adjacentTiles = getAdjacent(cages, startRow, startCol);
  for (
    let numTiles = 1;
    numTiles < 4 &&
    adjacentTiles.length > 0 &&
    Math.random() < 0.75 ** numTiles;
    numTiles++
  ) {
    const [[row, col]] = adjacentTiles.splice(
      Math.floor(Math.random() * adjacentTiles.length),
      1
    );
    cages[row][col] = cageIndex;
    getAdjacent(cages, row, col).forEach(([newRow, newCol]) => {
      if (!adjacentTiles.some(([row, col]) => row === newRow && col === newCol))
        adjacentTiles.push([newRow, newCol]);
    });
  }
}

export function generateCageMap(n: number) {
  const cages: number[][] = [...Array(n)].map(() => Array(n).fill(-1));
  let currCage = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (cages[i][j] === -1) {
        makeCage(cages, i, j, currCage++);
      }
    }
  }
  return cages;
}

function chooseOperation(
  cageMap: number[][],
  matrix: number[][],
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
  if (cageTiles.length === 1) {
    const [[row, col]] = cageTiles;
    return "" + matrix[row][col];
  }
  if (cageTiles.length === 2) {
    const [[r1, c1], [r2, c2]] = cageTiles;
    const [x, y] = [matrix[r1][c1], matrix[r2][c2]];
    if (x % y === 0 && Math.random() < 0.5) return "" + x / y + "/";
    if (y % x === 0 && Math.random() < 0.5) return "" + y / x + "/";
    if (y > x && Math.random() < 0.5) return "" + (y - x) + "-";
    if (x > y && Math.random() < 0.5) return "" + (x - y) + "-";
  }
  if (Math.random() < 0.5)
    return (
      "" +
      cageTiles.reduce((sum, [row, col]) => (sum += matrix[row][col]), 0) +
      "+"
    );
  return (
    "" +
    cageTiles.reduce(
      (product, [row, col]) => (product *= matrix[row][col]),
      1
    ) +
    "x"
  );
}

export function generateLabels(cageMap: number[][]) {
  const n = cageMap.length;
  const latinSquare = randomLatinSquare(n);
  const labels = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (cageMap[i][j] === labels.length) {
        labels.push(chooseOperation(cageMap, latinSquare, i, j));
      }
    }
  }

  return labels;
}
