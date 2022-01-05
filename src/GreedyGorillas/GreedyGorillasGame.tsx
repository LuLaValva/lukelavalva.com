import React from "react";
import { Player } from "./GreedyGorillasPage";
import GorillaDisplay from "./GorillaDisplay";

interface Props {
  players: { [connectionId: string]: Player };
  playerOrder: string[];
}

const GreedyGorillasGame = (props: Props) => {
  return (
    <>
      <h1>Greedy Gorillas!</h1>
      {props.playerOrder.map((connectionId) => (
        <GorillaDisplay
          key={connectionId}
          player={props.players[connectionId]}
        />
      ))}
    </>
  );
};

export default GreedyGorillasGame;
