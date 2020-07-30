import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

export default function Timer({ type, values }) {
  const [value, setValue, setSession] = values;
  const handleIncrease = () => {
    setValue(value + 60);
    if (setSession) {
      setSession(value / 60);
    }
  };
  const handleDecrease = () => {
    if (value <= 60) {
      return null;
    } else {
      setValue(value - 60);
      if (setSession) {
        setSession(value / 60);
      }
    }
  };
  const formatTime = (time) => {
    let format = (val) => `0${Math.floor(val)}`.slice(-2);
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    return [minutes, seconds].map(format).join(":");
  };

  return (
    <div class="control">
      <h2>{type} Length</h2>
      <button value={type} onClick={handleIncrease}>
        <FaArrowUp />
      </button>
      <h3>{formatTime(value)}</h3>
      <button onClick={handleDecrease}>
        <FaArrowDown />
      </button>
    </div>
  );
}
