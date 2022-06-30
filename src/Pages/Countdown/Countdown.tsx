import React, { useEffect, useState } from "react";
import styles from "./Countdown.module.css";

export const timezoneOffest = new Date().getTimezoneOffset() * 60 * 1000;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = week * 52;

const makeHeader = (number: number, label: string) => (
  <h1>
    {number} {label}
    {number !== 1 && "s"}
  </h1>
);

const makeHeaders = (breakdowns: [number, string][]) => {
  let largest0 = false;
  return breakdowns.map(([num, label]) => {
    if (largest0 || num) {
      largest0 = true;
      return makeHeader(num, label);
    }
    return undefined;
  });
};

const breakDownTimestamp = (ts: number, sections: number[]) => {
  return sections.map((size) => {
    const n = Math.floor(ts / size);
    ts %= size;
    return n;
  });
};

const Countdown: React.FC<{
  label: string;
  goalTime: number;
}> = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const timeRemaining = props.goalTime - currentTime;

  const [years, weeks, days, hours, minutes, seconds] = breakDownTimestamp(
    timeRemaining,
    [year, week, day, hour, minute, second]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearTimeout(timeout);
  });

  const downToMinutes = makeHeaders([
    [years, "year"],
    [weeks, "week"],
    [days, "day"],
    [hours, "hour"],
    [minutes, "minute"],
  ]);

  return (
    <div className={styles.countdown}>
      {downToMinutes}
      {downToMinutes[downToMinutes.length - 1] && <h4>and</h4>}
      {makeHeader(seconds, "second")}
      <h3>until</h3>
      <h1>{props.label}</h1>
    </div>
  );
};

export default Countdown;
