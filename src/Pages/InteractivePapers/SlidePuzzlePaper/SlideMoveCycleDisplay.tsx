import React, { useEffect, useState } from "react";
import SlidePuzzleDisplay, { SlidePuzzle } from "./SlidePuzzleDisplay";
import styles from "./GenericSlidePuzzle.module.css";

const SlideMoveCycleDisplay: React.FC<{
  cycle: SlidePuzzle[];
  repeatInfinitely?: boolean;
  squareSize?: number;
  sizeUnit?: string;
  includeIndices?: boolean;
}> = ({ cycle, repeatInfinitely, ...props }) => {
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(true);

  useEffect(() => {
    if (cycling) {
      const reachedEnd = index + 2 === cycle.length;
      const timeout = setTimeout(
        () => {
          setIndex((index + 1) % cycle.length);
          if (reachedEnd && !repeatInfinitely) setCycling(false);
        },
        index === 0 ? 800 : index === cycle.length - 1 ? 0 : 350
      );
      return () => clearTimeout(timeout);
    }
  }, [cycle.length, cycling, index, repeatInfinitely]);

  return (
    <>
      <SlidePuzzleDisplay piecePositions={cycle[index]} {...props} />
      {!cycling && (
        <button
          onClick={() => setCycling(true)}
          className={styles.actionButton}
        >
          Show Again
        </button>
      )}
    </>
  );
};

export default SlideMoveCycleDisplay;
