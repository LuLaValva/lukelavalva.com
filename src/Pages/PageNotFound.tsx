import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/App.module.css";

type Props = {};

const PageNotFound = (props: Props) => {
  return (
    <>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.title}>
        <Link to="/" className={styles.link}>
          Go Home
        </Link>
      </p>
    </>
  );
};

export default PageNotFound;
