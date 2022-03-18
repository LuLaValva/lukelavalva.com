import React, { useState } from "react";
import SlidePuzzle from "./SlidePuzzle";
import styles from "./SlidePuzzle.module.css";

type Props = {};

const SlidePuzzlePage = (props: Props) => {
  const [puzzleSize, setPuzzleSize] = useState(2);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  const incrementPuzzleSize = () => {
    setPuzzleSize(puzzleSize + 1);
    setPuzzleSolved(false);
  };

  return (
    <>
      <SlidePuzzle
        dim={puzzleSize}
        image={"me.gif"}
        whenSolved={() => {
          setPuzzleSolved(true);
          setTimeout(incrementPuzzleSize, 1000);
        }}
      />
      {puzzleSolved && <h1 className={styles.winMessage}>Whoo!</h1>}
    </>
  );
};

export default SlidePuzzlePage;
