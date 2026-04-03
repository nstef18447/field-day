"use client";

import { useEffect, useState } from "react";
import type { ContactSubmission } from "@/app/types";

const th: React.CSSProperties = {
  textAlign: "left", padding: "12px 16px", fontSize: "0.8rem",
  textTransform: "uppercase", letterSpacing: 1, color: "#888",
  borderBottom: "2px solid #e0d8cb", background: "#f0efe0",
};
const td: React.CSSProperties = {
  padding: "12px 16px", borderBottom: "1px solid #f0e8db", fontSize: "0.9rem",
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) {
        setContacts(await res.json());
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: '"Barriecito", cursive', fontSize: "1.8rem", color: "#04324b", margin: 0 }}>Contact Submissions</h2>
      </div>

      {loading ? (
        <p style={{ color: "#888", fontStyle: "italic", padding: "32px 0" }}>Loading contacts...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#f0efe0", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Message</th>
              <th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr
                key={c.id}
                style={{ cursor: "pointer" }}
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              >
                <td style={td}>{c.name}</td>
                <td style={td}>{c.email}</td>
                <td style={td}>
                  {expanded === c.id
                    ? c.message
                    : c.message.length > 80
                    ? c.message.slice(0, 80) + "..."
                    : c.message}
                </td>
                <td style={td}>{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "#888", padding: 32 }}>
                  No contact submissions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
