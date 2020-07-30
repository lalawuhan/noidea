import React from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";

export default function TimerControl({ pause, reset, active }) {
  return (
    <div>
      <div onClick={pause}>{active ? <FaPause /> : <FaPlay />}</div>
      <div onClick={reset}>
        {" "}
        <GrPowerReset />
      </div>
    </div>
  );
}
