import { useEffect, useState } from "react";

export function TopMenu({ height }: { height: string }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const timeout = setInterval(() => {
      const time = new Date(
        new Date().setFullYear(1899, 1, 1) - new Date(2020).valueOf()
      );
      setTime(time.toLocaleTimeString());
      setDate(time.toLocaleDateString());
    }, 1000);

    return () => clearInterval(timeout);
  }, []);

  return (
    <div
      style={{
        background: "white",
        display: "flex",
        flexDirection: "row",
        height,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          margin: "1em",
        }}
      >
        <div>
          {date} {time}
        </div>
        <div>{5556.22} ℳ</div>
      </div>
    </div>
  );
}
