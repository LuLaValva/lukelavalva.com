import React from "react";
import styles from "../styles/App.module.css";

export interface Props {
  width: number;
  left: number;
  top: number;
  size?: number;
  color?: string;
  children?: string | React.ReactNode;
}

const BoxInSky = (props: Props) => {
  let boxStyle: React.CSSProperties = {
    width: props.width + "em",
    left: props.left + "rem",
    top: props.top + "%",
    fontSize: (props.size ?? 1) + "em",
    backgroundColor: props.color,
  };

  return (
    <div className={styles.boxInSky} style={boxStyle}>
      {props.children}
    </div>
  );
};

export default BoxInSky;
