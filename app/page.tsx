export const dynamic = "force-dynamic";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import ShopSection from "./components/ShopSection";
import AboutSection from "./components/AboutSection";
import TaglineBanner from "./components/TaglineBanner";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ScrollReveal from "./components/ScrollReveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <ShopSection />
      <AboutSection />
      <TaglineBanner />
      <ContactSection />
      <Footer />
      <ScrollReveal />
    </>
  );
}
