import React, { useState } from "react";
import InteractiveSlidePuzzle from "./InteractiveSlidePuzzle";
import { SlidePuzzle } from "./SlidePuzzleDisplay";
import SlidePuzzleGraphDisplay, {
  SlidePuzzleGraph,
} from "./SlidePuzzleGraphDisplay";
import { cachePuzzle, getCompositeKey } from "./SlidePuzzleUtilities";

const ManualSlideGraphGenerator: React.FC<{
  dimensions: [rows: number, cols: number];
  squareSize?: number;
  sizeUnit?: string;
  includeShuffle?: boolean;
}> = ({ dimensions, squareSize, sizeUnit, includeShuffle }) => {
  const [graph, setGraph] = useState<SlidePuzzleGraph>({
    nodes: {},
    connections: {},
  });
  const [lastState, setLastState] = useState<string>();

  const onBoardUpdate = (puzzle: SlidePuzzle) => {
    const newGraph = { ...graph };
    const currState = cachePuzzle(puzzle);
    if (newGraph.nodes[currState] === undefined)
      newGraph.nodes = { ...newGraph.nodes, [currState]: true };
    if (lastState !== undefined) {
      const compositeKey = getCompositeKey(lastState, currState);
      if (newGraph.connections[compositeKey] === undefined)
        newGraph.connections = {
          ...newGraph.connections,
          [compositeKey]: true,
        };
    }
    setGraph(newGraph);
    setLastState(currState);
  };

  return (
    <>
      <InteractiveSlidePuzzle
        dimensions={dimensions}
        squareSize={squareSize}
        sizeUnit={sizeUnit}
        onUpdate={onBoardUpdate}
        includeShuffleButton={includeShuffle}
      />
      <SlidePuzzleGraphDisplay graph={graph} />
    </>
  );
};

export default ManualSlideGraphGenerator;
