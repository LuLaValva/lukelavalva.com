import React, { useEffect, useMemo, useState } from "react";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import { SlidePuzzle } from "./SlidePuzzleDisplay";
import TeX from "@matejmazur/react-katex";
import { cachePuzzle, getCachedPuzzle, getMoves } from "./SlidePuzzleUtilities";
import styles from "./GenericSlidePuzzle.module.css";

const SOLVED_COLOR = "#0f06";

type Leaf = [cachedState: string, parent: Leaf | null];

const SlidePuzzleWithReductionColors: React.FC<{
  dimensions: [rows: number, cols: number];
  includeShuffleButton?: boolean;
  shuffleImmediately?: boolean;
  boardState?: SlidePuzzle;
  onUpdate?: (newBoard: SlidePuzzle) => void;
  squareSize?: number;
  sizeUnit?: string;
  includeIndices?: boolean;
  showDims?: boolean;
  showReduceButton?: boolean;
}> = ({
  onUpdate,
  boardState,
  showDims = false,
  showReduceButton = false,
  ...props
}) => {
  const [nCompleteRows, setNCompleteRows] = useState(0);
  const [nCompleteCols, setNCompleteCols] = useState(0);
  const [currState, setCurrState] = useState<SlidePuzzle>([]);
  const [forcedState, setForcedState] = useState(boardState);
  const [nRows, nCols] = props.dimensions;

  useEffect(() => {
    setForcedState(boardState);
  }, [boardState]);

  const findCompleteRowsAndCols = (newBoard: SlidePuzzle) => {
    setNCompleteRows(
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

    setNCompleteCols(colI);

    setCurrState(newBoard);

    onUpdate && onUpdate(newBoard);
  };

  const findBoardReductionPath = () => {
    if (nCompleteRows === nRows - 1 && nCompleteCols === nCols - 1) return [];
    const cachedCurrState = cachePuzzle(currState);
    const seen = new Set([cachedCurrState]);
    let leaves: Leaf[] = [[cachedCurrState, null]];

    let solvedLeaf;
    while (
      leaves.length > 0 &&
      !(solvedLeaf = leaves.find(([cachedState]) => {
        const state = getCachedPuzzle(cachedState);
        return (
          state[nCompleteRows].every(
            (num, colI) => num === nCompleteRows * nCols + colI + 1
          ) ||
          state.every(
            (row, rowI) =>
              row[nCompleteCols] === rowI * nCols + nCompleteCols + 1
          )
        );
      }))
    ) {
      leaves = leaves.flatMap((leaf) =>
        getMoves(
          getCachedPuzzle(leaf[0]),
          nCompleteRows,
          nCompleteCols
        ).flatMap((state) => {
          const cached = cachePuzzle(state);
          if (seen.has(cached)) return [];
          seen.add(cached);
          return [[cachePuzzle(state), leaf]];
        })
      );
    }
    const reductionPath = [];
    while (solvedLeaf) {
      reductionPath.unshift(getCachedPuzzle(solvedLeaf[0]));
      solvedLeaf = solvedLeaf[1];
    }
    return reductionPath;
  };

  const reduceVisually = () => {
    findBoardReductionPath().forEach((state, i) =>
      setTimeout(() => setForcedState(state), 250 * i)
    );
  };

  const colors = useMemo(() => {
    const colors: { [piece: number]: string } = {};

    // Rows
    [...Array(nCompleteRows * nCols)].forEach((_, i) => {
      colors[i + 1] = SOLVED_COLOR;
    });

    // Cols
    for (let i = 0; i < nRows; i++) {
      for (let j = 0; j < nCompleteCols; j++) {
        colors[i * nCols + j + 1] = SOLVED_COLOR;
      }
    }

    return colors;
  }, [nCompleteCols, nCompleteRows, nCols, nRows]);

  return (
    <>
      <InteractiveSlidePuzzle
        onUpdate={findCompleteRowsAndCols}
        assignedColors={colors}
        boardState={forcedState}
        shuffleIterations={10}
        {...props}
      />
      {showDims && (
        <TeX
          block
          math={String.raw`(${nRows - nCompleteRows}\times ${
            nCols - nCompleteCols
          })`}
        />
      )}
      {showReduceButton && (
        <button onClick={reduceVisually} className={styles.actionButton}>
          Reduce Size
        </button>
      )}
    </>
  );
};

export default SlidePuzzleWithReductionColors;
