const phrases = [
  "for the moments worth keeping",
  "keepsakes for growing up",
  "for field days & forever",
  "handmade with love",
];

export default function Marquee() {
  const items = [...phrases, ...phrases];

  return (
    <div className="marquee-wrap">
      <div className="marquee">
        {items.map((phrase, i) => (
          <span key={i}>
            {phrase}
            {i < items.length - 1 && <span className="dot"> ✦ </span>}
          </span>
        ))}
      </div>
    </div>
  );
}
