import React, { useMemo } from "react";
import { breakCompositeKey } from "./SlidePuzzleUtilities";
import VisGraph from "./VisGraph";

export type SlidePuzzleGraph = {
  nodes: Set<string>;
  connections: Set<string>;
};

const SlidePuzzleGraphDisplay: React.FC<{
  readonly graph: SlidePuzzleGraph;
}> = ({ graph }) => {
  const visNodes = useMemo(
    () =>
      Array.from(graph.nodes).map((id) => {
        return { id };
      }),
    [graph.nodes]
  );
  const visEdges = useMemo(
    () =>
      Array.from(graph.connections).map((compositeKey) => {
        const [from, to] = breakCompositeKey(compositeKey);
        return { from, to, id: compositeKey };
      }),
    [graph.connections]
  );

  return <VisGraph nodes={visNodes} edges={visEdges} />;
};

export default SlidePuzzleGraphDisplay;
