import React, { useEffect } from "react";
import { Player } from "./GreedyGorillasPage";
import { useRive, useStateMachineInput } from "rive-react";

interface Props {
  player: Player;
}

const GorillaRiveComponent = (props: Props) => {
  const STATE_MACHINE_NAME = "All Anims";

  const { rive, RiveComponent } = useRive({
    src: "gorilla.riv",
    stateMachines: STATE_MACHINE_NAME,
    autoplay: true,
  });

  const suspicionInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "Suspicion"
  );
  const angerInput = useStateMachineInput(rive, STATE_MACHINE_NAME, "Anger");
  const excitementInput = useStateMachineInput(
    rive,
    STATE_MACHINE_NAME,
    "Excitement"
  );
  const roleInput = useStateMachineInput(rive, STATE_MACHINE_NAME, "Role");

  useEffect(() => {
    roleInput &&
      (roleInput.value =
        props.player.gameState.apparentRole ||
        props.player.gameState.knownRole ||
        0);
  }, [
    roleInput,
    props.player.gameState.apparentRole,
    props.player.gameState.knownRole,
  ]);

  return (
    <RiveComponent
      onMouseOver={() => Math.random() < 0.3 && suspicionInput?.fire()}
      onClick={() =>
        Math.random() < 0.5 ? angerInput?.fire() : excitementInput?.fire()
      }
    />
  );
};

export default GorillaRiveComponent;
