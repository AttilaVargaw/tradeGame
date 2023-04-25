import { useState, useEffect } from "react";
import { Button } from "./button";
import { useTick } from "./hooks/useTick";

export function SevenDigitClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const [tick] = useTick();

  useEffect(() => {
    const date = new Date(tick);

    setTime(
      date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setDate(date.toLocaleDateString());
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
