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
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
