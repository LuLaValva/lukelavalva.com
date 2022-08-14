import React, { useMemo, useState } from "react";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import { SlidePuzzle } from "./SlidePuzzleDisplay";

const SOLVED_COLOR = "#0f06";

const SlidePuzzleWithReductionColors: React.FC<{
  dimensions: [rows: number, cols: number];
  includeShuffleButton?: boolean;
  shuffleImmediately?: boolean;
  boardState?: SlidePuzzle;
  onUpdate?: (newBoard: SlidePuzzle) => void;
  squareSize?: number;
  sizeUnit?: string;
  includeIndices?: boolean;
}> = ({ onUpdate, ...props }) => {
  const [numCompleteRows, setNumCompleteRows] = useState(0);
  const [numCompleteCols, setNumCompleteCols] = useState(0);

  const findCompleteRowsAndCols = (newBoard: SlidePuzzle) => {
    const [, nCols] = props.dimensions;

    setNumCompleteRows(
      newBoard.findIndex(
        (row, rowI) =>
          !row.every((num, colI) => num === rowI * nCols + colI + 1)
      )
    );

    let colI = 0;
    while (
      colI < nCols &&
      // eslint-disable-next-line no-loop-func
      newBoard.every((row, rowI) => row[colI] === rowI * nCols + colI + 1)
    ) {
      colI++;
    }

    setNumCompleteCols(colI);

    onUpdate && onUpdate(newBoard);
  };

  const colors = useMemo(() => {
    const [nRows, nCols] = props.dimensions;
    const colors: { [piece: number]: string } = {};

    // Rows
    [...Array(numCompleteRows * nCols)].forEach((_, i) => {
      colors[i + 1] = SOLVED_COLOR;
    });

    // Cols
    for (let i = 0; i < nRows; i++) {
      for (let j = 0; j < numCompleteCols; j++) {
        colors[i * nCols + j + 1] = SOLVED_COLOR;
      }
    }

    return colors;
  }, [numCompleteCols, numCompleteRows, props.dimensions]);

  return (
    <InteractiveSlidePuzzle
      onUpdate={findCompleteRowsAndCols}
      assignedColors={colors}
      {...props}
    />
  );
};

export default SlidePuzzleWithReductionColors;
