"use client";

import { useEffect, useRef, useState } from "react";

// These are original, procedurally-generated synthwave loops (Web Audio
// oscillators), not the game's licensed in-game soundtrack -- that music is
// commercially licensed by Rockstar and isn't ours to stream. Each "track"
// is just a different chord pattern/tempo so Next actually changes what
// plays.
const TRACKS = [
  { name: "Night Drive", notes: [220, 277.18, 329.63, 440], stepMs: 260 },
  { name: "Neon Pier", notes: [196, 246.94, 293.66, 392], stepMs: 320 },
  { name: "Keys Sunset", notes: [164.81, 196, 246.94, 329.63], stepMs: 220 },
];

export default function RadioLeonida() {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);

  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function playStep(track: (typeof TRACKS)[number]) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const note = track.notes[stepRef.current % track.notes.length];
    stepRef.current += 1;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = note;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + track.stepMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + track.stepMs / 1000);
  }

  function start(index: number) {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    ctxRef.current.resume();
    stop();
    stepRef.current = 0;
    const track = TRACKS[index];
    playStep(track);
    timerRef.current = setInterval(() => playStep(track), track.stepMs);
  }

  function toggle() {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      start(trackIndex);
      setPlaying(true);
    }
  }

  function next() {
    const nextIndex = (trackIndex + 1) % TRACKS.length;
    setTrackIndex(nextIndex);
    if (playing) start(nextIndex);
  }

  useEffect(() => stop, []);

  const track = TRACKS[trackIndex];

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="label">Radio Leonida</span>
        <span className="chip">{playing ? "Now Playing" : "Paused"}</span>
      </div>
      <div className="eq">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ animationPlayState: playing ? "running" : "paused" }} />
        ))}
      </div>
      <p className="radio-now">
        Original loop &middot; <b>{track.name}</b> &middot; Synthwave Sunset FM &middot; not from
        the game
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button className="radio-btn" onClick={toggle} type="button">
          {playing ? "Pause" : "Play"}
        </button>
        <button className="radio-btn" onClick={next} type="button">
          Next
        </button>
      </div>
    </div>
  );
}
