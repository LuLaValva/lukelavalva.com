import React from "react";
import SlidePuzzleDisplay from "./SlidePuzzleDisplay";
import { getCachedPuzzle } from "./SlidePuzzleUtilities";
import styles from "./GenericSlidePuzzle.module.css";

export type SlidePuzzleGraph = {
  nodes: { [puzzleKey: string]: boolean };
  connections: { [compositeKey: string]: boolean };
};

const SlidePuzzleGraphDisplay: React.FC<{
  readonly graph: SlidePuzzleGraph;
}> = ({ graph }) => {
  return (
    <div className={styles.puzzleGraph}>
      {Object.keys(graph.nodes).map((encodedPuzzle) => (
        <SlidePuzzleDisplay
          key={encodedPuzzle}
          piecePositions={getCachedPuzzle(encodedPuzzle)}
          squareSize={2.5}
        />
      ))}
    </div>
  );
};

export default SlidePuzzleGraphDisplay;
