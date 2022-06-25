import React, { useMemo } from "react";
import styles from "./GenericSlidePuzzle.module.css";

/**
 * Must be a rectangular grid of **UNIQUE** digits from `0` to `rows*cols`.
 */
export type SlidePuzzleBoard = number[][];
export type Coordinates = [number, number];

const SlidePuzzleDisplay: React.FC<{
  piecePositions: SlidePuzzleBoard;
  squareSize?: number;
  sizeUnit?: string;
  onSquareClick?: (coords: Coordinates) => void;
}> = ({ piecePositions, squareSize = 5, sizeUnit = "vmin", onSquareClick }) => {
  const piecePositionMap: { [k: number]: Coordinates } = useMemo(() => {
    return Object.fromEntries(
      piecePositions.flatMap((row, rowIndex) =>
        row.map((value, colIndex) => [value, [rowIndex, colIndex]])
      )
    );
  }, [piecePositions]);

  const squareBaseStyles = {
    width: `${squareSize}${sizeUnit}`,
    height: `${squareSize}${sizeUnit}`,
    fontSize: `${squareSize / 2}${sizeUnit}`,
    boxShadow: `inset white 0 0 ${squareSize / 4}${sizeUnit}`,
  };

  return (
    <div
      className={styles.puzzle}
      style={{
        width: `${squareSize * piecePositions[0].length}${sizeUnit}`,
        height: `${squareSize * piecePositions.length}${sizeUnit}`,
      }}
    >
      {[...new Array(piecePositions.length * piecePositions[0].length - 1)].map(
        (_, i) => {
          i++;
          return (
            <button
              key={i}
              style={{
                ...squareBaseStyles,
                transform: `translate(${
                  piecePositionMap[i][1] * squareSize
                }${sizeUnit}, ${
                  piecePositionMap[i][0] * squareSize
                }${sizeUnit})`,
              }}
              onClick={
                onSquareClick && (() => onSquareClick(piecePositionMap[i]))
              }
            >
              {i}
            </button>
          );
        }
      )}
    </div>
  );
};

export default SlidePuzzleDisplay;
