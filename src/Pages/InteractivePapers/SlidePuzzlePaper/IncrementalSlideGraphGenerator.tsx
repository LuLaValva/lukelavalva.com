import React, { useEffect, useRef, useState } from "react";
import { SlidePuzzle } from "./SlidePuzzleDisplay";
import SlidePuzzleGraphDisplay, {
  SlidePuzzleGraph,
} from "./SlidePuzzleGraphDisplay";
import {
  cachePuzzle,
  generateBoard,
  getCachedPuzzle,
  getCompositeKey,
  getMoves,
  isSolved,
} from "./SlidePuzzleUtilities";
import styles from "./GenericSlidePuzzle.module.css";

type IdTree = {
  [id: string]: IdTree;
};

const indicatesLeaf = (tree: IdTree) => Object.keys(tree).length === 0;

function onLeaves(tree: IdTree, callback: (id: string) => IdTree) {
  Object.entries(tree).forEach(([id, children]) => {
    if (indicatesLeaf(children)) tree[id] = callback(id);
    else onLeaves(children, callback);
  });
}

function getDepth(tree: IdTree): number {
  const children = Object.values(tree);
  return children
    .map((child) => (indicatesLeaf(child) ? 0 : getDepth(child) + 1))
    .reduce((max, curr) => (max > curr ? max : curr));
}

function dropLeaves(tree: IdTree, callback?: (id: string) => boolean) {
  Object.entries(tree).forEach(([id, children]) => {
    if (indicatesLeaf(children)) {
      if (!callback || !callback(id)) delete tree[id];
    } else dropLeaves(children, callback);
  });
}

const IncrementalSlideGraphGenerator: React.FC<{
  dimensions: [rows: number, cols: number];
  rootState?: SlidePuzzle;
}> = ({ dimensions: [nRows, nCols], rootState }) => {
  const [graph, setGraph] = useState<SlidePuzzleGraph & { tree: IdTree }>(
    () => ({
      nodes: new Set<string>(),
      connections: new Set<string>(),
      tree: {}, // This one does not update statefully, but I don't care
    })
  );
  const [foundSolution, setFoundSolution] = useState(false);
  const [showedPath, setShowedPath] = useState(false);

  const reset = () => {
    const startState = cachePuzzle(rootState || generateBoard(nRows, nCols));
    setGraph({
      nodes: new Set<string>([startState]),
      connections: new Set<string>(),
      tree: { [startState]: {} },
    });
    setFoundSolution(false);
    setShowedPath(false);
  };

  useEffect(reset, [nRows, nCols, rootState]);

  const expand = () => {
    let { nodes, connections, tree } = { ...graph };
    nodes = new Set(nodes);
    connections = new Set(connections);

    onLeaves(tree, (from) => {
      return Object.fromEntries(
        getMoves(getCachedPuzzle(from)).flatMap((p) => {
          const to = cachePuzzle(p);
          if (nodes.has(to)) return [];
          nodes.add(to);
          connections.add(getCompositeKey(from, to));
          if (isSolved(to)) setFoundSolution(true);
          return [[to, {}]];
        })
      );
    });

    setGraph({
      nodes,
      connections,
      tree,
    });
  };

  const shrink = () => {
    const { nodes: prevNodes, connections, tree } = { ...graph };
    if (indicatesLeaf(Object.values(tree)[0])) return false;

    const nodes = new Set(prevNodes);

    dropLeaves(tree, (id) => {
      if (isSolved(id)) return true;
      nodes.delete(id);
      return false;
    });

    setGraph({ nodes, connections, tree });

    return nodes.size < prevNodes.size;
  };

  const shrinkCallback = useRef(shrink);
  useEffect(() => {
    shrinkCallback.current = shrink;
  });

  const showPath = () => {
    setShowedPath(true);

    shrinkCallback.current();

    const interval = setInterval(() => {
      if (!shrinkCallback.current()) clearInterval(interval);
    }, 400);
  };

  return (
    <>
      <SlidePuzzleGraphDisplay graph={graph} />
      {foundSolution ? (
        <>
          <h3>Solution Located in {getDepth(graph.tree)} moves!</h3>
          {!showedPath && (
            <button className={styles.actionButton} onClick={showPath}>
              Show Path
            </button>
          )}
        </>
      ) : (
        <button className={styles.actionButton} onClick={expand}>
          Expand Tree
        </button>
      )}
    </>
  );
};

export default IncrementalSlideGraphGenerator;
