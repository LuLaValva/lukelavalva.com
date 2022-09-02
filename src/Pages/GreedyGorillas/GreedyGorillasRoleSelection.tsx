import React from "react";
import { ApiConstants } from "../../consts";
import styles from "./GreedyGorillas.module.css";

interface RoleSelectionProps {
  roles: number[];
  wsConnection: WebSocket;
}

interface RoleSelectorProps {
  roleId: number;
  wsConnection: WebSocket;
}

const GreedyGorillasRoleSelector = (props: RoleSelectorProps) => {
  const addRole = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "addGameRole",
        role: props.roleId,
      })
    );
  };

  return (
    <div
      className={`${styles.lobbyButton} ${styles.large} ${styles.add}`}
      onClick={addRole}
    >
      {ApiConstants.GREEDY_GORILLAS_ROLES[props.roleId]}
    </div>
  );
};
interface ActiveRoleProps {
  roleId: number;
  wsConnection: WebSocket;
  index: number;
}

const GreedyGorillasActiveRole = (props: ActiveRoleProps) => {
  const removeRole = () => {
    props.wsConnection.send(
      JSON.stringify({
        action: "removeGameRole",
        index: props.index,
      })
    );
  };

  return (
    <div
      className={`${styles.lobbyButton} ${styles.large} ${styles.remove}`}
      onClick={removeRole}
    >
      {ApiConstants.GREEDY_GORILLAS_ROLES[props.roleId]}
    </div>
  );
};

const GreedyGorillasRoleSelection = (props: RoleSelectionProps) => {
  return (
    <>
      <div className={styles.buttonContainer}>
        <h2>Roles available to add</h2>
        {ApiConstants.GREEDY_GORILLAS_ROLES.slice(1).map((_name, index) => (
          <GreedyGorillasRoleSelector
            key={index}
            roleId={index + 1}
            wsConnection={props.wsConnection}
          />
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <h2>Currently Selected Roles</h2>
        {props.roles.map((role, index) => (
          <GreedyGorillasActiveRole
            key={index}
            index={index}
            roleId={role}
            wsConnection={props.wsConnection}
          />
        ))}
      </div>
    </>
  );
};

export default GreedyGorillasRoleSelection;
