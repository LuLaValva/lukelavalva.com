import React from "react";
import { GameState, Player } from "./GreedyGorillasPage";
import GreedyGorillasRoleSelection from "./GreedyGorillasRoleSelection";
import PlusMinusScoreDisplay from "./PlusMinusScoreDisplay";

interface Props {
  players: { [connectionId: string]: Player };
  wsConnection: WebSocket;
  gameState: GameState;
}

const GreedyGorillasLobby = (props: Props) => {
  const startGame = () => {
    if (Object.keys(props.players).length < props.gameState.roleList.length) {
      props.wsConnection.send(
        JSON.stringify({
          action: "startGame",
        })
      );
    } else {
      console.log("Add more roles before you start the game");
    }
  };

  return (
    <>
      {Object.values(props.players).map((player) => (
        <div key={player.connectionId}>{player.username}</div>
      ))}
      {Object.keys(props.players).length > 0 && (
        <>
          <GreedyGorillasRoleSelection
            roles={props.gameState.roleList}
            wsConnection={props.wsConnection}
          />
          <div>
            <PlusMinusScoreDisplay
              score={props.gameState.startingPoints}
              changeAction="updateStartingPoints"
              wsConnection={props.wsConnection}
              title="Starting Points"
            />
            <PlusMinusScoreDisplay
              score={props.gameState.pointsToWin}
              changeAction="updatePointsToWin"
              wsConnection={props.wsConnection}
              title="Goal Points"
            />
          </div>
          <button onClick={startGame}>Start Game</button>
        </>
      )}
    </>
  );
};

export default GreedyGorillasLobby;
