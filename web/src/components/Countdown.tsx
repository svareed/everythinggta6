"use client";

import { useEffect, useState } from "react";

const LAUNCH_TARGET = new Date("2026-11-19T00:00:00-05:00").getTime();

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function timeLeft() {
  const diff = Math.max(0, LAUNCH_TARGET - Date.now());
  return {
    days: pad(Math.floor(diff / 86400000)),
    hours: pad(Math.floor((diff % 86400000) / 3600000)),
    mins: pad(Math.floor((diff % 3600000) / 60000)),
    secs: pad(Math.floor((diff % 60000) / 1000)),
  };
}

export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof timeLeft> | null>(null);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    setT(timeLeft());
    const id = setInterval(() => {
      setT(timeLeft());
      setLaunched(Date.now() >= LAUNCH_TARGET);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (launched) {
    return (
      <div className="badge">
        <span className="v mono" style={{ color: "var(--pop)" }}>
          ● LIVE
        </span>
        <span className="l">Out Now</span>
      </div>
    );
  }

  const display = t ?? { days: "00", hours: "00", mins: "00", secs: "00" };

  return (
    <>
      <div className="badge">
        <span className="v mono">{display.days}</span>
        <span className="l">Days</span>
      </div>
      <div className="badge">
        <span className="v mono">{display.hours}</span>
        <span className="l">Hours</span>
      </div>
      <div className="badge">
        <span className="v mono">{display.mins}</span>
        <span className="l">Mins</span>
      </div>
      <div className="badge">
        <span className="v mono">{display.secs}</span>
        <span className="l">Secs</span>
      </div>
    </>
  );
}
