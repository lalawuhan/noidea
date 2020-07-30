import { useEffect, useRef } from "react";

const useInterval = (callback, delay) => {
  const intervalRef = useRef();
  useEffect(() => {
    intervalRef.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      intervalRef.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
