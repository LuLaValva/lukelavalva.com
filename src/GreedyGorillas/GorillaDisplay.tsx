import React from "react";
import { Player } from "./GreedyGorillasPage";
import styles from "../styles/GreedyGorillas.module.css";
import { useRive, useStateMachineInput } from "rive-react";

interface Props {
  player: Player;
}

const GorillaDisplay = (props: Props) => {
  const STATE_MACHINE_NAME = "All Anims";

  const { rive, RiveComponent } = useRive({
    src: "gorilla.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  const onHoverInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "Suspicion"
  );

  return (
    <div className={styles.playerDisplayBox}>
      <RiveComponent
        onMouseOver={() => Math.random() < 0.3 && onHoverInput?.fire()}
      />
      {props.player.username}
    </div>
  );
};

export default GorillaDisplay;
