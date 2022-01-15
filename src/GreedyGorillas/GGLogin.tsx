import React, { useState } from "react";
import styles from "../styles/GreedyGorillas.module.css";

interface Props {
  socketConnectionFunction: (username: string, room: string) => void;
}

const GGLogin = (props: Props) => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoom(e.target.value);
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const joinRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.socketConnectionFunction(username, room);
  };

  return (
    <>
      <div className={styles.gameDescriptionBox}>
        <h1>Greedy Gorillas</h1>
        <h3>A game of lies and deceit</h3>
        <p>
          This game is designed to be played by a group of 3-23 people, each of
          whom are hiding their devices from one another.
        </p>
        <p>
          When the game begins, each player will be assigned a role from a
          predefined list. This role is to be kept secret, as no player is made
          aware of anyone else's role right away.
        </p>
        <p>
          Gorillas will take turns in a round-robin fashion. On their turn, a
          gorilla may perform the action associated with their role or they can
          pretend to be any other role.
        </p>
        <p>
          It is important for you to know what each role does, but I'm not gonna
          tell you here. If you really care to find out send me an email or
          something.
        </p>
        <p>
          To begin the game, get all your friends together in a virtual or
          physical location where you can all hear each other talking and decide
          on a name for your room. Everyone in your party must have the same
          room key. It is recommended that multiple people don't use the same
          name because that could quickly become confusing, but it is allowed.
        </p>
      </div>
      <div className={`${styles.loginContainer}`}>
        <div>
          Room Key: <input name="room" onChange={handleRoomChange} />
        </div>
        <div>
          Player Name: <input name="username" onChange={handleUsernameChange} />
        </div>
        <button onClick={joinRoom} className={styles.joinRoomButton}>
          Join Room
        </button>
      </div>
    </>
  );
};

export default GGLogin;
