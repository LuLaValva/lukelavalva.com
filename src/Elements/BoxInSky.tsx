import React from "react";
import styles from "../styles/App.module.css";

interface Props {
  width: number;
  left: number;
  top: number;
  color?: string;
  children?: string | React.ReactNode;
}

const BoxInSky = (props: Props) => {
  let boxStyle: React.CSSProperties = {
    width: props.width + "em",
    left: props.left + "em",
    top: props.top + "%",
  };

  if (props.color !== null) boxStyle.backgroundColor = props.color;

  return (
    <div className={styles.boxInSky} style={boxStyle}>
      {props.children}
    </div>
  );
};

export default BoxInSky;
