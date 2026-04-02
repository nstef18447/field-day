"use client";

import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        background: "#f0efe0",
        borderBottom: "1px solid #e0d8cb",
      }}
    >
      <h1
        style={{
          fontFamily: '"Luckiest Guy", cursive',
          fontSize: "1.3rem",
          color: "#04324b",
          margin: 0,
        }}
      >
        Field Day Admin
      </h1>
      <button
        onClick={handleLogout}
        style={{
          background: "none",
          border: "1px solid #04324b",
          color: "#04324b",
          padding: "6px 16px",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: "0.85rem",
        }}
      >
        Log Out
      </button>
    </header>
  );
}
