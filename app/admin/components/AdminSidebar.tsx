"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/products", label: "Products", icon: "📦" },
  { href: "/admin/orders", label: "Orders", icon: "🧾" },
  { href: "/admin/contacts", label: "Contacts", icon: "✉️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        minWidth: 240,
        minHeight: "100vh",
        background: "#4a4f22",
        color: "#fff8ed",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontFamily: '"Caveat Brush", cursive',
          fontSize: "1.6rem",
          padding: "24px 20px",
          color: "#c9b83a",
          borderBottom: "1px solid rgba(255,248,237,0.1)",
        }}
      >
        Field Day
      </div>
      <nav style={{ display: "flex", flexDirection: "column", padding: "16px 0" }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 20px",
              color: "#fff8ed",
              textDecoration: "none",
              fontSize: "0.95rem",
              background: pathname === link.href ? "rgba(255,248,237,0.12)" : "transparent",
              borderRight: pathname === link.href ? "3px solid #c9b83a" : "none",
              fontWeight: pathname === link.href ? 600 : 400,
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
