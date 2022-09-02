import React, { useEffect } from "react";
import { useRive, useStateMachineInput } from "rive-react";

interface Props {
  activeRole: number;
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
    roleInput && (roleInput.value = props.activeRole);
  }, [roleInput, props.activeRole]);

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
