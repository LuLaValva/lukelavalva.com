import React, { useMemo } from "react";
import styles from "./GenericSlidePuzzle.module.css";

/**
 * Must be a rectangular grid of **UNIQUE** digits from `0` to `rows*cols`.
 */
export type SlidePuzzle = number[][];
export type Coordinates = [number, number];

const SlidePuzzleDisplay: React.FC<{
  piecePositions: SlidePuzzle;
  squareSize?: number;
  sizeUnit?: string;
  onSquareClick?: (coords: Coordinates) => void;
}> = ({ piecePositions, squareSize = 5, sizeUnit = "vmin", onSquareClick }) => {
  const [isSolved, piecePositionMap]: [boolean, Coordinates[]] = useMemo(() => {
    const [nRows, nCols] = [piecePositions.length, piecePositions[0].length];
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
  }, [piecePositions]);

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
        width: `${squareSize * piecePositions[0].length}${sizeUnit}`,
        height: `${squareSize * piecePositions.length}${sizeUnit}`,
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
              }}
              onClick={onSquareClick && (() => onSquareClick([row, col]))}
            >
              {i}
            </button>
          )
      )}
    </div>
  );
};

export default SlidePuzzleDisplay;
