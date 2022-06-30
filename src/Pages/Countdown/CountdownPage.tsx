import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Countdown, { timezoneOffest } from "./Countdown";
import styles from "./Countdown.module.css";

const useSearchParam = (key: string): [string, (val: string) => void] => {
  const [params, setParams] = useSearchParams();
  const param = params.get(key) || "";
  const setParam = (val: string) => {
    setParams({ ...Object.fromEntries(params), [key]: val }, { replace: true });
  };

  return [param, setParam];
};

const CountdownPage = () => {
  const [inEditMode, setEditMode] = useState(true);
  const [label, setLabel] = useSearchParam("label");
  const [goalTimestamp, setGoalTimestamp] = useSearchParam("ts");
  const goalDate = useMemo(
    () => new Date(+goalTimestamp - timezoneOffest),
    [goalTimestamp]
  );

  useEffect(() => {
    if (goalTimestamp && label) {
      setEditMode(false);
    }
    if (!goalTimestamp) setGoalTimestamp(new Date().getTime().toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {inEditMode ? (
        <div className={styles.inputs}>
          <input
            value={label}
            onChange={(e) => setLabel(e.currentTarget.value)}
            placeholder="Event"
          />
          <input
            value={goalDate.toISOString().substring(0, 16)}
            type="datetime-local"
            onChange={(e) =>
              setGoalTimestamp(
                new Date(e.currentTarget.value).getTime().toString()
              )
            }
            placeholder="Time of Event"
          />
          <button onClick={() => setEditMode(false)}>Get Timer</button>
        </div>
      ) : (
        <>
          <Countdown label={label} goalTime={+goalTimestamp} />
          <button
            onClick={() => setEditMode(true)}
            className={styles.editButton}
          >
            (Edit)
          </button>
        </>
      )}
    </>
  );
};

export default CountdownPage;
