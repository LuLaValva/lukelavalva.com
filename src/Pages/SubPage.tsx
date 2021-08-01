import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/App.module.css";

interface Props {
  children?: React.ReactNode;
}

const SubPage = (props: Props) => {
  return (
    <div className={styles.ground}>
      <Link to="/">
        <img src="me_circle.gif" alt="My face" style={{ width: "4em" }}></img>
      </Link>
      {props.children}
    </div>
  );
};

export default SubPage;
