"use client";

import { useEffect, useState } from "react";

const STARTING_COUNT = 128402;
const MIN = 89;
const MAX = 150000;
const THRESHOLD = 100000;

// 80% of the time the count should read above 100k, 20% below.
function randomCount() {
  if (Math.random() < 0.8) {
    return Math.floor(THRESHOLD + 1 + Math.random() * (MAX - THRESHOLD - 1));
  }
  return Math.floor(MIN + Math.random() * (THRESHOLD - MIN));
}

export default function VisitorCounter() {
  const [count, setCount] = useState(STARTING_COUNT);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(randomCount());
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
