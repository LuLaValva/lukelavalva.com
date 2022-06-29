import React from "react";
import styles from "./styles/App.module.css";
import { useLocation } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

const NavigationHandler: React.FC = (props: Props) => {
  let isHomepage = useLocation().pathname === "/";

  return (
    <div className={`${styles.fullWindow} ${!isHomepage && styles.subpage}`}>
      {props.children}
    </div>
  );
};

export default NavigationHandler;
