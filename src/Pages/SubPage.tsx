import React from "react";
import styles from "../styles/App.module.css";

interface Props {
  children?: React.ReactNode;
}

const SubPage = (props: Props) => {
  return (
    <div className={styles.ground}>
      <div className={styles.groundScroll}>{props.children}</div>
    </div>
  );
};

export default SubPage;
