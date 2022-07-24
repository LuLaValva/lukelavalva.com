import React, { useState } from "react";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import { SlidePuzzle } from "./SlidePuzzleDisplay";

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
  puzzle[Math.floor(index / puzzle.length)][index % puzzle[0].length];

function assignGroup(
  puzzle: SlidePuzzle,
  groupMap: number[],
  root: number,
  groupNum: number
) {
  let i = root;
  do {
    groupMap[i] = groupNum;
    i = atIndex(puzzle, i);
  } while (i !== root);
}

const SlidePuzzleWithGroups: React.FC<{
  onUpdate?: (puzzle: SlidePuzzle) => void;
  dimensions: [rows: number, cols: number];
  includeShuffleButton?: boolean;
  shuffleImmediately?: boolean;
  boardState?: SlidePuzzle;
  squareSize?: number;
  sizeUnit?: string;
  includeIndices?: boolean;
}> = ({ onUpdate, ...props }) => {
  const [groupColors, setGroupColors] = useState<{ [piece: number]: string }>();

  const generateColors = (puzzle: SlidePuzzle) => {
    const [nRows, nCols] = props.dimensions;
    const groupMap: number[] = Array(nRows * nCols).fill(-1);
    let colorIndex = 0;

    for (let i = 0; i < groupMap.length; i++)
      if (groupMap[i] === -1) assignGroup(puzzle, groupMap, i, colorIndex++);

    setGroupColors(
      Object.fromEntries(
        groupMap.flatMap((color, i) =>
          color ? [[i, GROUP_COLORS[color]]] : []
        )
      )
    );

    onUpdate && onUpdate(puzzle);
  };

  return (
    <InteractiveSlidePuzzle
      onUpdate={generateColors}
      assignedColors={groupColors}
      {...props}
    />
  );
};

export default SlidePuzzleWithGroups;
