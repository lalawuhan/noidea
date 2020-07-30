import React, { useState, useEffect } from "react";
import useInterval from "./useInterval";
import TimerControls from "./timerControls";
import Timer from "./timer";

//TODO: set delay to a 1000, currently shorter for testing
export default function PomodoroTimer() {
  const [delay, setDelay] = useState(1000);
  let [session, setSession] = useState(25);
  let [timer, setTimer] = useState(25 * 60);
  let [active, setActive] = useState(false);
  let [breakTime, setBreakTime] = useState(5 * 60); //5min is 300sec
  let [mode, setMode] = useState("session");
  useInterval(
    () => {
      setTimer(timer - 1);
    },
    active ? delay : null
  );

  //any changes in main timer
  useEffect(() => {
    if (timer === 0 && mode === "session") {
      setMode("break");
      setTimer(breakTime);
    } else if (timer === 0 && mode === "break") {
      setMode("session");
      setTimer(session * 60);
    }
  }, [breakTime, timer, mode, session]);

  function handlePause() {
    setActive(!active);
  }

  const resetTimers = () => {
    console.log("resetting");
    setBreakTime(5 * 60);
    setTimer(25 * 60);
    setActive(false);
  };

  return (
    <div>
      <div className="maintimer">
        <Timer type={"Session"} values={[timer, setTimer, setSession]} />

        <TimerControls
          pause={handlePause}
          reset={resetTimers}
          active={active}
        />
      </div>
      <div>
        <Timer type={"Break"} values={[breakTime, setBreakTime]} />
      </div>
    </div>
  );
}
