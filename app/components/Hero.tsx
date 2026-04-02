import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-plaid">
        <div className="hero-logo-wrap">
          <Image
            className="hero-logo"
            src="/images/field-day-logo.png"
            alt="Field Day"
            width={305}
            height={305}
            priority
          />
        </div>
      </div>
      <div className="hero-text-band">
        <h1 className="hero-tagline">for field days &amp; forever</h1>
        <p className="hero-sub">Handmade keepsakes for growing up</p>
        <a href="#shop" className="hero-cta">Shop the Collection</a>
      </div>
    </section>
  );
}
