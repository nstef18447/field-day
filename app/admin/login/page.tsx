"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h1 className="admin-login-title">Field Day Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="admin-login-input"
          autoFocus
        />
        {error && <p className="admin-login-error">{error}</p>}
        <button type="submit" className="admin-login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
