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
  );
};

export default GGLogin;
