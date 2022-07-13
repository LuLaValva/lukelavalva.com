import React, { useMemo } from "react";
import { breakCompositeKey } from "./SlidePuzzleUtilities";
import VisGraph from "./VisGraph";

export type SlidePuzzleGraph = {
  nodes: { [puzzleKey: string]: boolean };
  connections: { [compositeKey: string]: boolean };
};

const SlidePuzzleGraphDisplay: React.FC<{
  readonly graph: SlidePuzzleGraph;
}> = ({ graph }) => {
  const visNodes = useMemo(
    () =>
      Object.keys(graph.nodes).map((id) => {
        return { id };
      }),
    [graph.nodes]
  );
  const visEdges = useMemo(
    () =>
      Object.keys(graph.connections).map((compositeKey) => {
        const [from, to] = breakCompositeKey(compositeKey);
        return { from, to, id: compositeKey };
      }),
    [graph.connections]
  );

  return <VisGraph nodes={visNodes} edges={visEdges} />;
};

export default SlidePuzzleGraphDisplay;
