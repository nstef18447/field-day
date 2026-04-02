import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <Image
            className="footer-logo"
            src="/images/field-day-logo.png"
            alt="Field Day"
            width={80}
            height={80}
          />
          <p className="footer-tagline">for the moments worth keeping</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link href="/#shop">All Products</Link>
          <Link href="/#shop">Pennants</Link>
          <Link href="/#shop">Ribbons &amp; Badges</Link>
          <Link href="/#shop">Gift Sets</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/#about">Our Story</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="#">Shipping &amp; Returns</Link>
          <Link href="#">FAQ</Link>
        </div>
        <div className="footer-col">
          <h4>Follow Along</h4>
          <Link href="#">Instagram</Link>
          <Link href="#">Pinterest</Link>
          <Link href="#">TikTok</Link>
        </div>
      </div>
      <p className="footer-bottom">&copy; 2026 Field Day. All rights reserved. Made with love and felt.</p>
    </footer>
  );
}
