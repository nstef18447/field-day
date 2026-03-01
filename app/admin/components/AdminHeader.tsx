"use client";

import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="admin-header">
      <h1 className="admin-header-title">Field Day Admin</h1>
      <button onClick={handleLogout} className="admin-header-logout">
        Log Out
      </button>
    </header>
  );
}
