import React, { useEffect, useRef, useState } from "react";
import SlidePuzzleDisplay, {
  Coordinates,
  SlidePuzzle,
} from "./SlidePuzzleDisplay";
import styles from "./GenericSlidePuzzle.module.css";
import { findHole, generateBoard } from "./SlidePuzzleUtilities";

const InteractiveSlidePuzzle: React.FC<{
  dimensions: [rows: number, cols: number];
  includeShuffleButton?: boolean;
  shuffleImmediately?: boolean;
  boardState?: SlidePuzzle;
  onUpdate?: (newBoard: SlidePuzzle) => void;
  squareSize?: number;
  sizeUnit?: string;
  includeIndices?: boolean;
  assignedColors?: { [piece: number]: string };
}> = ({
  dimensions: [nRows, nCols],
  includeShuffleButton = false,
  shuffleImmediately = false,
  boardState: externalState,
  onUpdate,
  ...props
}) => {
  const [board, setBoard] = useState(() => generateBoard(nRows, nCols));
  const [[holeRow, holeCol], setHole] = useState(() => [nRows - 1, nCols - 1]);

  useEffect(() => {
    const board = externalState || generateBoard(nRows, nCols);
    setBoard(board);
    setHole(findHole(board));
    onUpdate && onUpdate(board);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nRows, nCols, externalState]);

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

    onUpdate && onUpdate(newBoard);
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

  useEffect(() => {
    shuffleImmediately && setTimeout(shuffle, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleImmediately]);

  return (
    <>
      <SlidePuzzleDisplay
        piecePositions={board}
        onSquareClick={attemptSquareSlide}
        {...props}
      />
      {includeShuffleButton && (
        <button onClick={shuffle} className={styles.actionButton}>
          Shuffle
        </button>
      )}
    </>
  );
};

export default InteractiveSlidePuzzle;
