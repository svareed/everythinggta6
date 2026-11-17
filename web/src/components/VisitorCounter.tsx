"use client";

import { useEffect, useState } from "react";

const STARTING_COUNT = 128402;

export default function VisitorCounter() {
  const [count, setCount] = useState(STARTING_COUNT);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 5) + 1);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="badge">
      <span className="v mono">{count.toLocaleString("en-US")}</span>
      <span className="l">Reading now</span>
    </div>
  );
}
