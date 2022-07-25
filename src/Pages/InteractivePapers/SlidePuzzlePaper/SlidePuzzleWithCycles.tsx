import React, { useState } from "react";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import { SlidePuzzle } from "./SlidePuzzleDisplay";
import TeX from "@matejmazur/react-katex";
import { findHole } from "./SlidePuzzleUtilities";

const GROUP_COLORS = [
  "none",
  "#00f6",
  "#0f06",
  "#f006",
  "#ff06",
  "#f0f6",
  "#0ff6",
  "#f806",
  "#0f86",
  "#80f6",
  "#8f06",
  "#08f6",
  "#f086",
  "#0006",
  "#88f6",
  "#8f86",
  "#f886",
  "#0086",
  "#0806",
  "#8006",
  "#fff6",
  "#8806",
  "#8086",
  "#0886",
];

const atIndex = (puzzle: SlidePuzzle, index: number) =>
  puzzle[Math.floor(index / puzzle[0].length)][index % puzzle[0].length];

function assignGroup(
  puzzle: SlidePuzzle,
  groupMap: number[],
  root: number,
  groupNum: number
) {
  const cycle: number[] = [];
  let i = root;
  do {
    groupMap[i] = groupNum;
    cycle.push(i);
    i = atIndex(puzzle, i);
  } while (i !== root);
  return cycle;
}

const SlidePuzzleWithCycles: React.FC<{
  onUpdate?: (puzzle: SlidePuzzle) => void;
  showCycleNotation?: boolean;
  showNumCyclesAndManhattanDistance?: boolean;
  dimensions: [rows: number, cols: number];
  includeShuffleButton?: boolean;
  shuffleImmediately?: boolean;
  boardState?: SlidePuzzle;
  squareSize?: number;
  sizeUnit?: string;
  includeIndices?: boolean;
}> = ({
  onUpdate,
  showCycleNotation = false,
  showNumCyclesAndManhattanDistance = false,
  ...props
}) => {
  const [groupColors, setGroupColors] = useState<{ [piece: number]: string }>();
  const [cycles, setCycles] = useState<number[][]>([]);
  const [manhattanDist, setManhattanDist] = useState(0);

  const generateColors = (puzzle: SlidePuzzle) => {
    const [nRows, nCols] = [puzzle.length, puzzle[0].length];
    const groupMap: number[] = Array(nRows * nCols).fill(-1);
    let colorIndex = 0;
    const cycles: number[][] = [];

    for (let i = 0; i < groupMap.length; i++)
      if (groupMap[i] === -1)
        cycles.push(assignGroup(puzzle, groupMap, i, colorIndex++));

    setCycles(cycles);

    setGroupColors(
      Object.fromEntries(
        groupMap.flatMap((color, i) =>
          color ? [[i, GROUP_COLORS[color]]] : []
        )
      )
    );

    if (showNumCyclesAndManhattanDistance) {
      const [holeRow, holeCol] = findHole(puzzle);
      setManhattanDist(
        puzzle.length - holeRow + puzzle[0].length - holeCol - 2
      );
    }

    onUpdate && onUpdate(puzzle);
  };

  return (
    <>
      <InteractiveSlidePuzzle
        onUpdate={generateColors}
        assignedColors={groupColors}
        {...props}
      />
      {showCycleNotation && (
        <TeX
          block
          math={String.raw`\begin{pmatrix}${cycles
            .map((cycle) => cycle.join("&"))
            .join(String.raw`\end{pmatrix}\begin{pmatrix}`)}\end{pmatrix}`}
        />
      )}
      {showNumCyclesAndManhattanDistance && (
        <TeX
          math={String.raw`
            \begin{aligned}
              \text{Number of Cycles} & = ${cycles.length}\ \text{(${
            cycles.length & 1 ? "odd" : "even"
          })} \\
              \text{Manhattan Distance} & = ${manhattanDist}\ \text{(${
            manhattanDist & 1 ? "odd" : "even"
          })}
            \end{aligned}
          `}
        />
      )}
    </>
  );
};

export default SlidePuzzleWithCycles;
