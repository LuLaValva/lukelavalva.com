import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./KenKenStyles.module.css";

type KeyEvent = {
  key: string;
  repeat?: boolean;
  shiftKey?: boolean;
};

enum Color {
  NONE,
  RED,
  GREEN,
}

/** [0] represents the background color of the square */
type SquareDetails = Color[];

export type Cages = {
  labels?: string[];
  cageMap: number[][];
};

const LatinSquareBase: React.FC<{
  n: number;
  cages?: Cages;
}> = ({ n, cages }) => {
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [matrixDetails, setMatrixDetails] = useState<SquareDetails[][]>([]);
  const [focus, setFocus] = useState<[number, number] | undefined>();
  const [selected, setSelected] = useState<boolean[][]>([]);
  const [selectMode, setSelectMode] = useState<Color>(Color.NONE);
  const [justWrote, setJustWrote] = useState(false);
  const [borderClasses, setBorderClasses] = useState<string[][]>([]);
  const [labels, setLabels] = useState<(string | undefined)[][]>([]);

  const squareRefs = useRef<(HTMLElement | null)[][]>([]);

  useEffect(() => {
    if (!cages || cages.cageMap.length !== n) return;
    setBorderClasses(
      cages.cageMap.map((row, rowI) =>
        row.map(
          (cage, colI) =>
            `${
              (rowI === 0 || cages.cageMap[rowI - 1][colI] !== cage) &&
              styles.top
            } ${
              (colI === 0 || cages.cageMap[rowI][colI - 1] !== cage) &&
              styles.left
            }`
        )
      )
    );
    if (!cages.labels) return;
    const labelsLeft = [...cages.labels];
    setLabels(
      cages.cageMap.map((row) =>
        row.map((cage) => {
          if (labelsLeft[cage]) {
            const label = labelsLeft[cage];
            delete labelsLeft[cage];
            return label;
          }
          return undefined;
        })
      )
    );
  }, [cages, n]);

  const clearSelected = useCallback(() => {
    setSelected([...Array(n)].map(() => Array(n).fill(false)));
  }, [n]);

  const clearMatrix = useCallback(() => {
    setMatrix([...Array(n)].map(() => Array(n).fill(0)));
    setMatrixDetails(
      [...Array(n)].map(() =>
        [...Array(n)].map(() => Array(n + 1).fill(Color.NONE))
      )
    );
    clearSelected();
  }, [clearSelected, n]);

  const boardClick = (row: number, col: number) => {
    setFocus([row, col]);
    select();
  };

  const calcConflicts = (
    matrix: number[][],
    [forRow, forCol]: [number, number],
    num: number
  ) => {
    const onRows = matrix.flatMap(({ [forCol]: squareN }, rowI) =>
      squareN === num ? [rowI] : []
    );
    const onCols = matrix[forRow].flatMap((squareN, colI) =>
      squareN === num ? [colI] : []
    );

    setMatrixDetails((details) => {
      const newDetails = [...details];
      const rowConflict = onRows.length >= 2;
      onRows.forEach((rowI) => {
        const color =
          rowConflict ||
          matrix[rowI].some((val, colI) => forCol !== colI && val === num)
            ? Color.RED
            : Color.NONE;
        newDetails[rowI] = [...newDetails[rowI]];
        newDetails[rowI][forCol] = [...newDetails[rowI][forCol]];
        newDetails[rowI][forCol][0] = color;
      });

      const colConflict = onCols.length >= 2;
      newDetails[forRow] = [...newDetails[forRow]];
      onCols.forEach((colI) => {
        const color =
          colConflict ||
          matrix.some(({ [colI]: val }, rowI) => forRow !== rowI && val === num)
            ? Color.RED
            : Color.NONE;
        newDetails[forRow][colI] = [...newDetails[forRow][colI]];
        newDetails[forRow][colI][0] = color;
      });

      return newDetails;
    });
  };

  const writeBigNumber = (num: number) => {
    if (!focus) return;

    const newMatrix = [...matrix];
    newMatrix[focus[0]] = [...newMatrix[focus[0]]];
    newMatrix[focus[0]][focus[1]] = num;

    setMatrix(newMatrix);

    num && calcConflicts(newMatrix, focus, num);
    const prevNum = matrix[focus[0]][focus[1]];
    prevNum && calcConflicts(newMatrix, focus, prevNum);

    if (num === 0) {
      setMatrixDetails((details) => {
        const [row, col] = focus;
        const newDetails = [...details];
        newDetails[row] = [...newDetails[row]];
        newDetails[row][col] = Array(n + 1).fill(Color.NONE);
        return newDetails;
      });
    }
  };

  const writeLittleNumber = (num: number) => {
    const selectedCoords = selected.map((row) =>
      row.flatMap((isSelected, i) => (isSelected ? [i] : []))
    );
    setMatrixDetails((details) => {
      const newDetails = [...details];
      const allOn = !selectedCoords.some((row, rowI) =>
        row.some((colI) => details[rowI][colI][num] !== selectMode)
      );
      const newColor = allOn ? Color.NONE : selectMode;
      selectedCoords.forEach((row, rowI) => {
        if (row.length > 0) {
          newDetails[rowI] = [...newDetails[rowI]];
          row.forEach((colI) => {
            newDetails[rowI][colI] = [...newDetails[rowI][colI]];
            newDetails[rowI][colI][num] = newColor;
          });
        }
      });
      return newDetails;
    });
  };

  const write = (num: number) => {
    if (selectMode === Color.NONE) writeBigNumber(num);
    else writeLittleNumber(num);
    setJustWrote(true);
  };

  const select = (modeChange?: boolean) => {
    if (justWrote && !modeChange) {
      clearSelected();
      setJustWrote(false);
    }
    focus &&
      (modeChange || selectMode !== Color.NONE) &&
      setSelected((selected) => {
        const newSelected = [...selected];
        newSelected[focus[0]] = [...newSelected[focus[0]]];
        newSelected[focus[0]][focus[1]] =
          modeChange || !newSelected[focus[0]][focus[1]];
        return newSelected;
      });
  };

  const keyPress = ({ key, repeat }: KeyEvent) => {
    // if (repeat) return;

    switch (key) {
      case "ArrowUp":
        setFocus(focus ? [(focus[0] + n - 1) % n, focus[1]] : [0, 0]);
        break;
      case "ArrowLeft":
        setFocus(focus ? [focus[0], (focus[1] + n - 1) % n] : [0, 0]);
        break;
      case "ArrowDown":
        setFocus(focus ? [(focus[0] + 1) % n, focus[1]] : [0, 0]);
        break;
      case "ArrowRight":
        setFocus(focus ? [focus[0], (focus[1] + 1) % n] : [0, 0]);
        break;
      case "Backspace":
        write(0);
        break;
      case "r":
      case "R":
        setSelectMode(selectMode === Color.RED ? Color.NONE : Color.RED);
        if (selectMode === Color.RED) clearSelected();
        else select(true);
        break;
      case "g":
      case "G":
        setSelectMode(selectMode === Color.GREEN ? Color.NONE : Color.GREEN);
        if (selectMode === Color.GREEN) clearSelected();
        else select(true);
        break;
      case "n":
      case "N":
      case "c":
      case "C":
        setSelectMode(Color.NONE);
        clearSelected();
        break;
    }
    if (/^\d$/.test(key) && +key > 0 && +key <= n) {
      write(+key);
    }
  };

  useEffect(() => {
    clearMatrix();
    squareRefs.current = [];
    setFocus(undefined);
  }, [n, clearMatrix]);

  useEffect(() => {
    if (focus) squareRefs.current[focus[0]]?.[focus[1]]?.focus();
  }, [focus]);

  const focusedNum = focus ? matrix[focus[0]][focus[1]] : 0;
  return (
    <div
      className={`${styles.board} ${styles[`mode${selectMode}`]}`}
      style={{ "--num-squares": n } as React.CSSProperties}
      onKeyDown={keyPress}
    >
      {matrix.map((row, rowI) => (
        <div className={styles.row} key={rowI}>
          {row.map((num, colI) => (
            <button
              key={colI}
              ref={(el) => {
                squareRefs.current[rowI] ??= [];
                squareRefs.current[rowI][colI] = el;
              }}
              className={`${styles.square} ${
                focus && num && num === focusedNum && styles.numberHighlight
              } ${
                matrixDetails[rowI]?.[colI][0] === Color.RED &&
                styles.conflicting
              } ${selected[rowI][colI] && styles.selected} ${
                borderClasses[rowI]?.[colI]
              }`}
              onClick={() => boardClick(rowI, colI)}
              onFocus={() => setFocus([rowI, colI])}
              onBlur={() => setFocus(undefined)}
            >
              {num === 0 ? (
                <div className={styles.littleNumbers}>
                  {matrixDetails[rowI][colI].slice(1).map((color, i) => (
                    <div
                      className={`${styles[`little${color}`]} ${
                        i + 1 === focusedNum && styles.highlighted
                      }`}
                      key={i}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              ) : (
                num
              )}
              <div className={styles.label}>{labels[rowI]?.[colI]}</div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LatinSquareBase;
