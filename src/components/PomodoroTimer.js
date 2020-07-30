import React, { useState, useEffect } from "react";
import useInterval from "./useInterval";

//TODO: set delay to a 1000, currently shorter for testing
export default function PomodoroTimer() {
  const [delay, setDelay] = useState(5); //change this value : 1500 IS 25MIN
  let [session, setSession] = useState(25);
  let [timer, setTimer] = useState(session * 60);
  let [active, setActive] = useState(true);
  let [breakTime, setBreakTime] = useState(5 * 60); //5min is 300sec
  let [mode, setMode] = useState("session");

  useInterval(
    () => {
      setTimer(timer - 1);
    },
    active ? delay : null
  );
  useEffect(() => {
    console.log("useeffect session", session);
    setTimer(session * 60);
  }, [session]);

  //any changes in main timer
  useEffect(() => {
    console.log("es", timer);
    if (timer === 0 && mode === "session") {
      console.log("in break now");
      console.log("break will take :", breakTime);
      setMode("break");
      setTimer(breakTime);
    } else if (timer === 0 && mode === "break") {
      console.log("session will take main time of :", session);
      setMode("session");
      setTimer(session * 60);
    }
  }, [breakTime, timer, mode, session]);

  const handleMainTimer = (event) => {
    console.log("handle main time:", event.target.value * 60);
    console.log("timer", timer);
    setSession(event.target.value);
    setTimer(event.target.value * 60); // Set main timer to this
  };
  function handlePause() {
    setActive(!active);
  }

  const handleBreak = (event) => {
    console.log("break time:", event.target.value * 60);
    setBreakTime(event.target.value * 60); // Set main timer to this
  };
  // format a timer time in millisecods to a mm:ss format
  const formatTime = (time) => {
    let format = (val) => `0${Math.floor(val)}`.slice(-2);
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    return [minutes, seconds].map(format).join(":");
  };
  const resetTimers = () => {
    console.log("resetting");
    setBreakTime(5 * 60);
    setTimer(25 * 60);
    setActive(false);
  };
  const handleIncrease = () => {
    setTimer(timer + 60);
  };
  const handleDecrease = () => {
    let x = timer;
    if (x === 1) {
      return x;
    } else {
      setTimer(timer - 1);
    }
  };
  return (
    <div>
      <div className="maintimer">
        <h1>Main Timer: {formatTime(timer)}</h1>
        <h1>Session Timer: {formatTime(session)}</h1>

        <input type="number" defaultValue="25" onChange={handleMainTimer} />
        <button onClick={handlePause}>{active ? "Pause" : "Start"}</button>
        <button onClick={handleIncrease}>Increase</button>
        <button onClick={handleDecrease}>Decrease</button>
      </div>
      <div>
        <h1>Break Timer: {formatTime(breakTime)}</h1>
        <input type="number" defaultValue="5" onChange={handleBreak} />
      </div>
      <button onClick={resetTimers}>Reset</button>
    </div>
  );
}
