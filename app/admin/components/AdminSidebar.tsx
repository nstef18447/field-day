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
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">Field Day</div>
      <nav className="admin-sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`admin-sidebar-link ${
              pathname === link.href ? "active" : ""
            }`}
          >
            <span className="admin-sidebar-icon">{link.icon}</span>
            <span className="admin-sidebar-label">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
