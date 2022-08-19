import React, { useState } from "react";
import BoxInSky, { Props as BoxProps } from "./BoxInSky";
import styles from "../styles/App.module.css";

const MAX_TOP = 77;

const RunawayBox: React.FC<BoxProps> = ({
  left: propLeft,
  top: propTop,
  ...props
}) => {
  const [left, setLeft] = useState(propLeft);
  const [top, setTop] = useState(propTop);

  const move = () => {
    let moveHoriz =
      (Math.ceil(Math.random() * 70) + 15) * (Math.random() < 0.35 ? -1 : 1);
    let moveVert =
      (Math.ceil(Math.random() * 50) + 10) * (Math.random() < 0.5 ? -1 : 1);
    if (left + moveHoriz < 0) moveHoriz -= (left + moveHoriz) * 2;
    if (top + moveVert < 0) moveVert -= (top + moveVert) * 2;
    if (top + moveVert > MAX_TOP) moveVert += (MAX_TOP - top - moveVert) * 2;

    setLeft(left + moveHoriz);
    setTop(top + moveVert);
  };

  return (
    <button onClick={move} className={styles.boxLink}>
      <BoxInSky left={left} top={top} {...props} />
    </button>
  );
};

export default RunawayBox;
