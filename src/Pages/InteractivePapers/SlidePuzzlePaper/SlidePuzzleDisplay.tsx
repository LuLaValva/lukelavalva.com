import React, { useMemo } from "react";
import styles from "./GenericSlidePuzzle.module.css";

/**
 * Must be a rectangular grid of **UNIQUE** digits from `0` to `rows*cols`.
 */
export type SlidePuzzle = number[][];
export type Coordinates = [row: number, col: number];

const SlidePuzzleDisplay: React.FC<{
  piecePositions: SlidePuzzle;
  squareSize?: number;
  sizeUnit?: string;
  includeIndices?: boolean;
  onSquareClick?: (coords: Coordinates) => void;
  assignedColors?: { [piece: number]: string };
}> = ({
  piecePositions,
  squareSize = 5,
  sizeUnit = "rem",
  includeIndices = false,
  onSquareClick,
  assignedColors,
}) => {
  const [nRows, nCols] = [piecePositions.length, piecePositions[0].length];
  const [isSolved, piecePositionMap]: [boolean, Coordinates[]] = useMemo(() => {
    const positions = [...Array(nRows * nCols)];
    let isSolved = true;

    piecePositions.forEach((row, rowIndex) =>
      row.forEach((value, colIndex) => {
        if (
          isSolved &&
          value !== 0 &&
          value !== rowIndex * nCols + colIndex + 1
        )
          isSolved = false;
        positions[value] = [rowIndex, colIndex];
      })
    );
    return [isSolved, positions];
  }, [nCols, nRows, piecePositions]);

  const squareBaseStyles = {
    width: `${squareSize}${sizeUnit}`,
    height: `${squareSize}${sizeUnit}`,
    fontSize: `${squareSize / 2}${sizeUnit}`,
    boxShadow: `inset white 0 0 ${squareSize / 4}${sizeUnit}`,
  };

  return (
    <div
      className={`${styles.puzzle} ${isSolved ? styles.solved : ""}`}
      style={{
        width: `${squareSize * nCols}${sizeUnit}`,
        height: `${squareSize * nRows}${sizeUnit}`,
        borderWidth: `${squareSize / 5}${sizeUnit}`,
        borderRadius: `${squareSize / 5}${sizeUnit}`,
      }}
    >
      {piecePositionMap.map(
        ([row, col], i) =>
          i !== 0 && (
            <button
              key={i}
              style={{
                ...squareBaseStyles,
                transform: `translate(${col * squareSize}${sizeUnit}, ${
                  row * squareSize
                }${sizeUnit})`,
                backgroundColor: assignedColors ? assignedColors[i] : undefined,
              }}
              onClick={onSquareClick && (() => onSquareClick([row, col]))}
            >
              {i}
              {includeIndices && <div>{row * nCols + col}</div>}
            </button>
          )
      )}
    </div>
  );
};

export default SlidePuzzleDisplay;
