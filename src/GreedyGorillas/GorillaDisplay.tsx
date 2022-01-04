import React from "react";
import { Player } from "./GreedyGorillasPage";

interface Props {
  player: Player;
}

const GorillaDisplay = (props: Props) => {
  return <div>{props.player.username}</div>;
};

export default GorillaDisplay;
