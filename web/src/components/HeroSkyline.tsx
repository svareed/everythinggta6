const BUILDINGS = [
  { w: 8, h: 55 },
  { w: 11, h: 80 },
  { w: 7, h: 40 },
  { w: 13, h: 95 },
  { w: 9, h: 60 },
  { w: 6, h: 35 },
  { w: 12, h: 100 },
  { w: 8, h: 50 },
  { w: 10, h: 70 },
  { w: 7, h: 45 },
  { w: 14, h: 85 },
  { w: 9, h: 58 },
];

function Palm({ side }: { side: "p1" | "p2" }) {
  return (
    <div className={`palm ${side}`}>
      <div className="trunk" />
      <div className="frond f1" />
      <div className="frond f2" />
      <div className="frond f3" />
      <div className="frond f4" />
    </div>
  );
}

export default function HeroSkyline() {
  return (
    <>
      <div className="bg-sky" />
      <div className="bg-streak s1" />
      <div className="bg-streak s2" />
      <div className="bg-streak s3" />
      <div className="bg-skyline">
        {BUILDINGS.map((b, i) => (
          <div key={i} className="bldg" style={{ width: `${b.w}%`, height: `${b.h}%` }} />
        ))}
      </div>
      <div className="bg-ground" />
      <Palm side="p1" />
      <Palm side="p2" />
      <div className="hero-fade" />
    </>
  );
}
