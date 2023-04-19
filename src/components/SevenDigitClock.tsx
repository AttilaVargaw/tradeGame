import { useState, useEffect } from "react";
import { Button } from "./button";

const dT = 1000 * 60;

export function SevenDigitClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [tick, setTick] = useState(new Date().setFullYear(1899, 1, 1));

  useEffect(() => {
    const timeout = setInterval(() => {
      setTick(() => tick + dT);
      setTime(
        new Date(tick + dT).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDate(new Date(tick + dT).toLocaleDateString());
    }, 1000);

    return () => clearInterval(timeout);
  }, [tick]);

  return (
    <Button black>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {[...`${date} ${time}`].map((c, i) => (
          <div style={{ width: "0.6em" }} key={i}>
            {c}
          </div>
        ))}
      </div>
    </Button>
  );
}
