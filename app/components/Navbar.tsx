"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, setIsOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav id="navbar" className={scrolled ? "scrolled" : ""}>
      <div className="nav-inner">
        <Link href="/#home">
          <Image
            className="nav-logo"
            src="/images/field-day-logo.svg"
            alt="Field Day"
            width={56}
            height={56}
          />
        </Link>
        <ul className={`nav-links${menuOpen ? " open" : ""}`} id="navLinks">
          <li><Link href="/#home" onClick={closeMenu}>Home</Link></li>
          <li><Link href="/#shop" onClick={closeMenu}>Shop</Link></li>
          <li><Link href="/#about" onClick={closeMenu}>About</Link></li>
          <li><Link href="/#contact" onClick={closeMenu}>Contact</Link></li>
        </ul>
        <div className="cart-icon-wrap" onClick={() => setIsOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
        <button
          className="hamburger"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
