import React from "react";
import { Link } from "react-router-dom";
import BoxInSky, { Props as BoxInSkyProps } from "./BoxInSky";
import styles from "../styles/App.module.css";

const BoxLink: React.FC<{ to: string } & BoxInSkyProps> = ({
  to,
  ...props
}) => (
  <Link to={to} className={styles.boxLink}>
    <BoxInSky {...props} />
  </Link>
);

export default BoxLink;
