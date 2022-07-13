import React, { useEffect, useRef, useState } from "react";
import { DataSet } from "vis-data";
import { Edge, Network, Node, Position } from "vis-network";
import { getCachedPuzzle } from "./SlidePuzzleUtilities";
import styles from "./GenericSlidePuzzle.module.css";

const NETWORK_OPTIONS = {
  edges: { color: "#777", width: 4 },
  nodes: {
    shape: "custom",
    ctxRenderer: ({
      ctx,
      id,
      x,
      y,
    }: {
      ctx: CanvasRenderingContext2D;
      id: string;
      x: number;
      y: number;
    }) => {
      return {
        drawNode: () => {
          const puzzle = getCachedPuzzle(id);
          const [nRows, nCols] = [puzzle.length, puzzle[0].length];
          const squareSize = 30;
          ctx.save();

          // Draw Board
          ctx.beginPath();
          const height = squareSize * nRows;
          const width = squareSize * nCols;
          const left = x - width / 2;
          const top = y - height / 2;
          ctx.rect(left, top, width, height);
          for (let i = 1; i < nCols; i++) {
            const x = left + squareSize * i;
            ctx.moveTo(x, top);
            ctx.lineTo(x, top + height);
          }
          for (let i = 1; i < nRows; i++) {
            const y = top + squareSize * i;
            ctx.moveTo(left, y);
            ctx.lineTo(left + width, y);
          }
          ctx.closePath();

          ctx.fillStyle = "#444";
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();

          // Draw Text
          ctx.fillStyle = "#fff";
          ctx.font = "20px Manrope";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          puzzle.forEach((row, rowI) =>
            row.forEach((num, colI) => {
              if (num !== 0) {
                ctx.fillText(
                  num.toString(),
                  left + colI * squareSize + squareSize / 2,
                  top + rowI * squareSize + squareSize / 2
                );
              }
            })
          );

          ctx.restore();
        },
        nodeDimensions: { width: 60, height: 60 },
      };
    },
  },
};

const VisGraph: React.FC<{
  nodes: { id: string }[];
  edges: { id: string; from: string; to: string }[];
  onPositionUpdate?: (positions: { [nodeId: string]: Position }) => void;
}> = (props) => {
  const parent = useRef<HTMLDivElement>(null);
  const [nodes] = useState(() => new DataSet<Node>());
  const [edges] = useState(() => new DataSet<Edge>());

  useEffect(() => {
    if (!parent.current) return;
    const network = new Network(
      parent.current,
      { nodes, edges },
      NETWORK_OPTIONS
    );
    network.on("initRedraw", () => {
      props.onPositionUpdate && props.onPositionUpdate(network.getPositions());
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges, nodes]);

  useEffect(() => {
    nodes.update(props.nodes);
  }, [nodes, props.nodes]);

  useEffect(() => {
    edges.update(props.edges);
  }, [edges, props.edges]);

  return <div ref={parent} className={styles.puzzleGraph} />;
};

export default VisGraph;
