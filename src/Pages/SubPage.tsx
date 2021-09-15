import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/App.module.css";

interface Props {
  children?: React.ReactNode;
}

const SubPage = (props: Props) => {
  return (
    <div className={styles.ground}>
      <Link to="/" className={styles.homeButton}>
        <img src="me.gif" alt="My face" />
        <br />
        Home
      </Link>
      {props.children}
    </div>
  );
};

export default SubPage;
