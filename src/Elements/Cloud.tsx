import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../styles/App.module.css";

interface Props {
  width: number;
  left: number;
  top: number;
  children?: string | React.ReactNode;
}

const Cloud = (props: Props) => {
  const [height, setHeight] = useState(0);

  useEffect(() => setHeight(props.width / 2), [props.width]);

  return (
    <div
      className={styles.cloud}
      style={{
        width: props.width + "em",
        height: height + "em",
        left: props.left + "em",
        top: props.top + "%",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${props.width} ${height}`}
        width="100%"
        height="100%"
      >
        {[...Array(7)].map((_val, index) => (
          <CloudCircle key={index} x={props.width} y={height} />
        ))}
      </svg>
      <div>{props.children}</div>
    </div>
  );
};

interface CloudCircleProps {
  x: number;
  y: number;
}

const CloudCircle = (props: CloudCircleProps) => {
  const [radius, setRadius] = useState(0);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    let dmin = Math.min(props.x, props.y);
    let rad = Math.random() * (dmin / 6) + dmin / 3;
    setRadius(rad);
    setXOffset(Math.random() * (props.x - 2 * rad) + rad);
    setYOffset(Math.random() * (props.y - 2 * rad) + rad);
  }, [props.x, props.y]);

  return <circle cx={xOffset} cy={yOffset} r={radius} fill="white" />;
};

export default Cloud;
