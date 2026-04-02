const values = [
  { icon: "✂️", title: "Handmade", desc: "Every piece cut, stitched, and assembled by hand" },
  { icon: "💌", title: "Personal", desc: "Customized to celebrate your child's name and story" },
  { icon: "🌻", title: "Timeless", desc: "Keepsakes designed to be treasured for years to come" },
];

export default function AboutSection() {
  return (
    <>
      <div className="scallop-bottom-navy"></div>
      <section className="about-section" id="about">
        <div className="about-inner">
          <h2 className="section-title reveal">Our Story</h2>
          <p className="section-subtitle reveal">rooted in tradition, made with heart</p>
          <p className="about-text reveal">
            Field Day is rooted in tradition and inspired by old school field days, summer camp
            trophies, pen pals, and keepsakes you never quite outgrow. Each piece is thoughtfully
            designed and carefully handmade, meant to mark a moment, celebrate a childhood chapter,
            or honor a season of growing.
          </p>
          <div className="about-values reveal">
            {values.map((v, i) => (
              <div className="about-value" key={i}>
                <div className="about-value-icon">{v.icon}</div>
                <p className="about-value-title">{v.title}</p>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="scallop-top"></div>
    </>
  );
}
