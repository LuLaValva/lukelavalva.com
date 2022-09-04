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

/** [0] represents the background color of the tile */
type TileDetails = Color[];

export type Cages = {
  labels?: string[];
  cageMap: number[][];
};

const LatinSquareBase: React.FC<{
  n: number;
  cages?: Cages;
  onUpdate?: (matrix: number[][], row: number, col: number) => void;
  additionalConflicts?: boolean[][];
  autoFillRed?: boolean;
}> = ({ n, cages, onUpdate, additionalConflicts, autoFillRed = false }) => {
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [linearConflicts, setLinearConflicts] = useState<boolean[][]>([]);
  const [matrixDetails, setMatrixDetails] = useState<TileDetails[][]>([]);
  const [focus, setFocus] = useState<[number, number] | undefined>();
  const [selected, setSelected] = useState<boolean[][]>([]);
  const [selectMode, setSelectMode] = useState<Color>(Color.NONE);
  const [justWrote, setJustWrote] = useState(false);
  const [borderClasses, setBorderClasses] = useState<string[][]>([]);
  const [labels, setLabels] = useState<(string | undefined)[][]>([]);

  const tileRefs = useRef<(HTMLElement | null)[][]>([]);

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
    setSelected(() => [...Array(n)].map(() => Array(n).fill(false)));
    setJustWrote(false);
  }, [n]);

  const clearMatrix = useCallback(() => {
    setMatrix([...Array(n)].map(() => Array(n).fill(0)));
    setMatrixDetails(
      [...Array(n)].map(() =>
        [...Array(n)].map(() => Array(n + 1).fill(Color.NONE))
      )
    );
    setLinearConflicts([...Array(n)].map(() => Array(n).fill(false)));
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
    const onRows = matrix.flatMap(({ [forCol]: tileN }, rowI) =>
      tileN === num ? [rowI] : []
    );
    const onCols = matrix[forRow].flatMap((tileN, colI) =>
      tileN === num ? [colI] : []
    );

    setLinearConflicts((conflictMatrix) => {
      const newConflicts = [...conflictMatrix];
      const rowConflict = onRows.length >= 2;
      onRows.forEach((rowI) => {
        newConflicts[rowI] = [...newConflicts[rowI]];
        newConflicts[rowI][forCol] =
          rowConflict ||
          matrix[rowI].some((val, colI) => forCol !== colI && val === num);
      });

      const colConflict = onCols.length >= 2;
      newConflicts[forRow] = [...newConflicts[forRow]];
      onCols.forEach((colI) => {
        newConflicts[forRow][colI] =
          colConflict ||
          matrix.some(
            ({ [colI]: val }, rowI) => forRow !== rowI && val === num
          );
      });

      if (onCols.length <= 1 && onRows.length <= 1) {
        newConflicts[forRow][forCol] = false;
      }

      return newConflicts;
    });
  };

  useEffect(() => {
    setMatrixDetails((details) =>
      details.map((row, rowI) =>
        row.map((tile, colI) => {
          tile = [...tile];
          tile[0] =
            linearConflicts?.[rowI]?.[colI] ||
            additionalConflicts?.[rowI]?.[colI]
              ? Color.RED
              : Color.NONE;
          return tile;
        })
      )
    );
  }, [linearConflicts, additionalConflicts]);

  const writeBigNumber = (num: number) => {
    if (!focus) return;
    const [rowI, colI] = focus;

    const newMatrix = [...matrix];
    newMatrix[rowI] = [...newMatrix[rowI]];
    newMatrix[rowI][colI] = num;

    setMatrix(newMatrix);

    const prevNum = matrix[rowI][colI];
    prevNum && calcConflicts(newMatrix, focus, prevNum);
    num && calcConflicts(newMatrix, focus, num);

    if (num === 0) {
      setMatrixDetails((details) => {
        const newDetails = [...details];
        newDetails[rowI] = [...newDetails[rowI]];
        newDetails[rowI][colI] = Array(n + 1).fill(Color.NONE);
        return newDetails;
      });
    }
    if (autoFillRed) {
      setMatrixDetails((details) =>
        details.map((row, i) => {
          if (i === rowI)
            return row.map((detail) => {
              detail = [...detail];
              prevNum && (detail[prevNum] = Color.NONE);
              num && (detail[num] = Color.RED);
              return detail;
            });
          row = [...row];
          row[colI] = [...row[colI]];
          prevNum && (row[colI][prevNum] = Color.NONE);
          num && (row[colI][num] = Color.RED);
          return row;
        })
      );
    }

    onUpdate?.(newMatrix, rowI, colI);
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
    else {
      writeLittleNumber(num);
      setJustWrote(true);
    }
  };

  const moveFocus = (
    rowOffset: number,
    colOffset: number,
    selectPrevious?: boolean
  ) => {
    const newFocus: [number, number] = focus
      ? [(focus[0] + n + rowOffset) % n, (focus[1] + n + colOffset) % n]
      : [0, 0];
    if (focus && selectPrevious) {
      select(focus, true);
      select(newFocus, true);
    }
    setFocus(newFocus);
  };

  const toggleSelectMode = (mode: Color) => {
    setSelectMode(selectMode === mode ? Color.NONE : mode);
    if (selectMode === mode) clearSelected();
    else if (selectMode === Color.NONE) {
      clearSelected();
      select();
    }
  };

  const select = (location = focus, overrideToggle?: boolean) => {
    if (justWrote) {
      clearSelected();
      setJustWrote(false);
    }
    location &&
      setSelected((selected) => {
        const newSelected = [...selected];
        newSelected[location[0]] = [...newSelected[location[0]]];
        newSelected[location[0]][location[1]] =
          overrideToggle ?? !newSelected[location[0]][location[1]];
        return newSelected;
      });
  };

  const keyPress = ({ key, shiftKey }: KeyEvent) => {
    // if (repeat) return;

    switch (key) {
      case "ArrowUp":
        moveFocus(-1, 0, shiftKey);
        break;
      case "ArrowLeft":
        moveFocus(0, -1, shiftKey);
        break;
      case "ArrowDown":
        moveFocus(1, 0, shiftKey);
        break;
      case "ArrowRight":
        moveFocus(0, 1, shiftKey);
        break;
      case "Backspace":
        write(0);
        break;
      case "r":
      case "R":
        toggleSelectMode(Color.RED);
        break;
      case "g":
      case "G":
        toggleSelectMode(Color.GREEN);
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

  const selectCross = (location = focus) => {
    if (!location) return;
    setSelectMode(Color.RED);

    const [fromRow, fromCol] = location;
    setSelected((selected) =>
      selected.map((row, rowI) => {
        if (rowI === fromRow) {
          return Array(n).fill(true);
        } else {
          const newRow = [...row];
          newRow[fromCol] = true;
          return newRow;
        }
      })
    );
  };

  useEffect(() => {
    clearMatrix();
    tileRefs.current = [];
    setFocus(undefined);
  }, [n, clearMatrix]);

  useEffect(() => {
    if (focus) tileRefs.current[focus[0]]?.[focus[1]]?.focus();
  }, [focus]);

  const focusedNum = focus ? matrix[focus[0]][focus[1]] : 0;
  return (
    <div
      className={`${styles.board} ${styles[`mode${selectMode}`]}`}
      style={{ "--num-tiles": n } as React.CSSProperties}
      onKeyDown={keyPress}
    >
      {matrix.map((row, rowI) => (
        <div className={styles.row} key={rowI}>
          {row.map((num, colI) => (
            <button
              key={colI}
              ref={(el) => {
                tileRefs.current[rowI] ??= [];
                tileRefs.current[rowI][colI] = el;
              }}
              className={`${styles.tile} ${
                focus && num && num === focusedNum && styles.numberHighlight
              } ${
                matrixDetails[rowI]?.[colI][0] === Color.RED &&
                styles.conflicting
              } ${selected[rowI][colI] && styles.selected} ${
                borderClasses[rowI]?.[colI]
              }`}
              onClick={() => boardClick(rowI, colI)}
              onDoubleClick={() => num > 0 && selectCross([rowI, colI])}
              onKeyDown={({ key }) =>
                key === "Enter" && num > 0 && selectCross([rowI, colI])
              }
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
