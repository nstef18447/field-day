"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page gets a clean layout without sidebar/header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "relative", zIndex: 200 }}>
      <AdminSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f5f0e8", minHeight: "100vh" }}>
        <AdminHeader />
        <div style={{ padding: 32, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
