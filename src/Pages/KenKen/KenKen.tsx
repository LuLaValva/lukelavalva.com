import React, { useEffect, useState } from "react";
import {
  generateCageMap,
  generateLabels,
  getCageTiles,
  satisfyOperation,
} from "./KenKenUtilities";
import LatinSquareBase, { Cages } from "./LatinSquareBase";

const KenKen: React.FC<{
  n: number;
}> = ({ n }) => {
  const [cages, setCages] = useState<Cages & { labels: string[] }>();
  const [conflicts, setConflicts] = useState<boolean[][]>();

  useEffect(() => {
    const cageMap = generateCageMap(n);
    setCages({ cageMap, labels: generateLabels(cageMap) });
    setConflicts(undefined);
  }, [n]);

  const onUpdate = (matrix: number[][], row: number, col: number) => {
    if (!cages) return;
    const tileLocations = getCageTiles(cages.cageMap, row, col);
    const hasConflict =
      !tileLocations.some(([rowI, colI]) => matrix[rowI][colI] === 0) &&
      !satisfyOperation(
        tileLocations.map(([rowI, colI]) => matrix[rowI][colI]),
        cages.labels[cages.cageMap[row][col]]
      );
    setConflicts((conflicts) => {
      const newConflicts: boolean[][] = conflicts
        ? [...conflicts]
        : [...Array(n)].map(() => Array(n).fill(false));
      tileLocations.forEach(([row, col]) => {
        newConflicts[row] = [...newConflicts[row]];
        newConflicts[row][col] = hasConflict;
      });
      return newConflicts;
    });
  };

  return (
    <LatinSquareBase
      n={n}
      cages={cages}
      autoFillRed={true}
      onUpdate={onUpdate}
      additionalConflicts={conflicts}
    />
  );
};

export default KenKen;
