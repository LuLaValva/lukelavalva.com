import React, { useMemo, useState } from "react";
import { MastermindPegs } from "./InteractiveMastermind";
import { calculateDistanceVector, PEG } from "./MastermindUtilities";
import styles from "./Mastermind.module.css";
import EditableCode from "./MastermindEditableCode";

type Props = {
  numColors?: number;
  wordLength?: number;
};

const MastermindDistanceVector: React.FC<Props> = ({
  numColors = 6,
  wordLength = 4,
}) => {
  const [code1, setCode1] = useState<number[]>(Array(wordLength).fill(0));
  const [code2, setCode2] = useState<number[]>(Array(wordLength).fill(0));

  const distanceVector = useMemo(
    () => calculateDistanceVector(code1, code2),
    [code1, code2]
  );

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        <EditableCode
          numColors={numColors}
          wordLength={wordLength}
          code={code1}
          setCode={setCode1}
        />
        <div className={`${styles.row} ${styles.display}`}>
          <MastermindPegs pegSet={distanceVector} />
          <div className={styles.rowText}>
            ⟨{distanceVector[PEG.BULLS]}, {distanceVector[PEG.COWS]},{" "}
            {distanceVector[PEG.EMPTY]}⟩
          </div>
        </div>
        <EditableCode
          numColors={numColors}
          wordLength={wordLength}
          code={code2}
          setCode={setCode2}
        />
        <button
          onClick={() => {
            setCode1(Array(wordLength).fill(0));
            setCode2(Array(wordLength).fill(0));
          }}
        >
          Reset Colors
        </button>
      </div>
    </div>
  );
};

export default MastermindDistanceVector;
