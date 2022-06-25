import React, { useEffect, useRef, useState } from "react";
import SlidePuzzleDisplay, {
  Coordinates,
  SlidePuzzleBoard,
} from "./SlidePuzzleDisplay";
import styles from "./GenericSlidePuzzle.module.css";

function initialHolePosition(nRows: number, nCols: number): Coordinates {
  return [nRows - 1, nCols - 1];
}

function generateBoard(nRows: number, nCols: number): SlidePuzzleBoard {
  const board = [...Array(nRows)].map((_, row) =>
    [...Array(nCols)].map((_, col) => row * nCols + col + 1)
  );
  const [holeRow, holeCol] = initialHolePosition(nRows, nCols);
  board[holeRow][holeCol] = 0;
  return board;
}

const InteractiveSlidePuzzle: React.FC<{
  dimensions: [rows: number, cols: number];
  squareSize?: number;
  sizeUnit?: string;
  onUpdate?: (newBoard: SlidePuzzleBoard) => void;
}> = ({ dimensions: [nRows, nCols], squareSize, sizeUnit }) => {
  const [board, setBoard] = useState(generateBoard(nRows, nCols));
  const [[holeRow, holeCol], setHole] = useState(
    initialHolePosition(nRows, nCols)
  );

  useEffect(() => {
    setBoard(generateBoard(nRows, nCols));
    setHole(initialHolePosition(nRows, nCols));
  }, [nRows, nCols]);

  const attemptSquareSlide = ([row, col]: Coordinates) => {
    let newBoard;
    if (row === holeRow) {
      // Slide square to right or left
      newBoard = [...board];
      newBoard[row] = [...board[row]];
      const dir = col > holeCol ? 1 : -1;
      for (let i = holeCol; i !== col; i += dir)
        newBoard[row][i] = board[row][i + dir];
    } else if (col === holeCol) {
      // Slide square up or down
      newBoard = [...board];
      const dir = row > holeRow ? 1 : -1;
      for (let i = holeRow; i !== row; i += dir) {
        newBoard[i] = [...board[i]];
        newBoard[i][col] = board[i + dir][col];
      }
    } else return;

    // Board has been updated
    newBoard[row][col] = 0;
    setBoard(newBoard);
    setHole([row, col]);
  };

  const [lastRandomMove, setLastRandomMove] = useState({ axis: true, dir: 1 });

  const randomMove = () => {
    let moveDir: number;
    if (!lastRandomMove.axis) {
      // Move on row axis
      if (holeRow === nRows - 1) moveDir = -1;
      else if (holeRow === 0) moveDir = 1;
      else moveDir = Math.random() < 0.5 ? 1 : -1;

      attemptSquareSlide([holeRow + moveDir, holeCol]);
    } else {
      // Move on col axis
      if (holeCol === nCols - 1) moveDir = -1;
      else if (holeCol === 0) moveDir = 1;
      else moveDir = Math.random() < 0.5 ? 1 : -1;

      attemptSquareSlide([holeRow, holeCol + moveDir]);
    }

    setLastRandomMove({ axis: !lastRandomMove.axis, dir: moveDir });
  };

  const randomMoveCallback = useRef<() => void>(randomMove);
  useEffect(() => {
    randomMoveCallback.current = randomMove;
  });

  const [shuffleInterval, setShuffleInterval] = useState<NodeJS.Timeout>();

  const shuffle = () => {
    if (!shuffleInterval) {
      const iterations = (nRows * nCols) ** 2;
      const moveDelay = 100;

      let i = 0;
      const interval = setInterval(() => {
        randomMoveCallback.current();

        if (i++ >= iterations) {
          clearInterval(interval);
          setShuffleInterval(undefined);
        }
      }, moveDelay);
      setShuffleInterval(interval);
    }
  };

  return (
    <>
      <SlidePuzzleDisplay
        piecePositions={board}
        squareSize={squareSize}
        sizeUnit={sizeUnit}
        onSquareClick={attemptSquareSlide}
      />
      <button onClick={shuffle} className={styles.actionButton}>
        Shuffle
      </button>
    </>
  );
};

export default InteractiveSlidePuzzle;
