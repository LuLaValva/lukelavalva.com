import React, { useEffect, useState } from "react";
import styles from "./SlidePuzzle.module.css";

const PUZZLE_SIZE = 90;

type PuzzlePieceProps = {
  image: string;
  dim: number;
  piece: number;
  loc: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const PuzzlePiece = (props: PuzzlePieceProps) => {
  return props.piece !== -1 ? (
    <div
      className={styles.puzzlePiece}
      style={{
        width: PUZZLE_SIZE / props.dim + "vmin",
        height: PUZZLE_SIZE / props.dim + "vmin",
        backgroundImage: `url(${props.image})`,
        backgroundPosition: `${
          -(PUZZLE_SIZE / props.dim) * (props.piece % props.dim)
        }vmin ${
          -(PUZZLE_SIZE / props.dim) * Math.floor(props.piece / props.dim)
        }vmin`,
        transform: `translate(${
          (PUZZLE_SIZE / props.dim) * (props.loc % props.dim)
        }vmin, ${
          (PUZZLE_SIZE / props.dim) * Math.floor(props.loc / props.dim)
        }vmin)`,
      }}
      onClick={props.onClick}
    />
  ) : (
    <></>
  );
};

const isSolved = (pieces: number[]) => {
  return pieces
    .slice(0, pieces.length - 1)
    .reduce((solved, value, index) => solved && value === index, true);
};

type Props = {
  dim: number;
  image: string;
  whenSolved?: () => void;
};

const SlidePuzzle = (props: Props) => {
  const [pieceLocations, setPieceLocations] = useState<number[]>([]);
  const [emptySpot, setEmptySpot] = useState(0);

  const generateBoard = () => {
    let locs = [...Array(props.dim * props.dim)].map((_0, index) => index);
    let empty = props.dim * props.dim - 1;
    while (isSolved(locs)) {
      for (let i = 0, lastMove = 0; i < props.dim ** 3; i++) {
        let nextMove = Math.floor(Math.random() * 3);
        if (nextMove >= lastMove) nextMove += 1;
        lastMove = nextMove ^ 0x01; // 0 <-> 1, 2 <-> 3
        let nextEmpty;

        // 0 and 1 are left and right, respectively
        if (nextMove <= 1) {
          if (empty % props.dim === 0) nextMove = 1;
          else if (empty % props.dim === props.dim - 1) nextMove = 0;

          if (nextMove === 0) nextEmpty = empty - 1;
          else nextEmpty = empty + 1;
        }
        // 2 and 3 are up and down, respectively
        else {
          if (Math.floor(empty / props.dim) === 0) nextMove = 3;
          else if (Math.floor(empty / props.dim) === props.dim - 1)
            nextMove = 2;

          if (nextMove === 2) nextEmpty = empty - props.dim;
          else nextEmpty = empty + props.dim;
        }

        [locs[empty], locs[nextEmpty]] = [locs[nextEmpty], locs[empty]];
        empty = nextEmpty;
      }
    }
    locs[empty] = -1;
    setPieceLocations(locs);
    setEmptySpot(empty);
  };

  const movePiece = (index: number) => {
    let blockDistance = 0;
    if (Math.floor(index / props.dim) === Math.floor(emptySpot / props.dim)) {
      // Row Matches
      blockDistance = index < emptySpot ? -1 : 1;
    } else if (index % props.dim === emptySpot % props.dim) {
      // Column Matches
      blockDistance = index < emptySpot ? -props.dim : props.dim;
    }
    if (blockDistance !== 0) {
      let newPieceLocations = [...pieceLocations];
      for (let i = emptySpot; i !== index; i += blockDistance) {
        newPieceLocations[i] = newPieceLocations[i + blockDistance];
      }
      newPieceLocations[index] = -1;
      setPieceLocations(newPieceLocations);
      setEmptySpot(index);
      if (isSolved(newPieceLocations)) {
        props.whenSolved && props.whenSolved();
      }
    }
  };

  useEffect(generateBoard, [props.dim, props.image]);

  return (
    <div className={styles.puzzleBox}>
      {pieceLocations.map((piece, index) => (
        <PuzzlePiece
          image={props.image}
          dim={props.dim}
          piece={piece}
          loc={index}
          key={piece}
          onClick={() => movePiece(index)}
        />
      ))}
    </div>
  );
};

export default SlidePuzzle;
