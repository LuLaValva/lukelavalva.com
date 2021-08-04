import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import styles from "../styles/App.module.css";

interface Props {
  x: number;
  y: number;
  left: number;
  top: number;
  children?: string | React.ReactNode;
}

const Cloud = (props: Props) => {
  return (
    <div
      className={styles.cloud}
      style={{
        width: props.x + "em",
        height: props.y + "em",
        left: props.left + "em",
        top: props.top + "em",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${props.x} ${props.y}`}
        width="100%"
        height="100%"
      >
        {[...Array(7)].map((_val, index) => (
          <CloudCircle key={index} x={props.x} y={props.y} />
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
