import React, { useEffect, useState } from "react";
import { generateCageMap, generateLabels } from "./KenKenUtilities";
import LatinSquareBase, { Cages } from "./LatinSquareBase";

const KenKen: React.FC<{
  n: number;
}> = ({ n }) => {
  const [cages, setCages] = useState<Cages>();

  useEffect(() => {
    const cageMap = generateCageMap(n);
    setCages({ cageMap, labels: generateLabels(cageMap) });
  }, [n]);

  return <LatinSquareBase n={n} cages={cages} />;
};

export default KenKen;
