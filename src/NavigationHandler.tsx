import React from "react";
import styles from "./styles/App.module.css";
import { useRouteMatch } from "react-router";

interface Props {
  children?: React.ReactNode;
}

const NavigationHandler: React.FC = (props: Props) => {
  let isHomepage = useRouteMatch({ path: "/", exact: true });

  return (
    <div className={`${styles.fullWindow} ${!isHomepage && styles.subpage}`}>
      {props.children}
    </div>
  );
};

export default NavigationHandler;
