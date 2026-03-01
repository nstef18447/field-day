"use client";

import { useEffect, useState } from "react";
import type { ContactSubmission } from "@/app/types";

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
      <div className="admin-page-header">
        <h2>Contact Submissions</h2>
      </div>

      {loading ? (
        <p className="admin-loading">Loading contacts...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr
                key={c.id}
                className="admin-contact-row"
                onClick={() =>
                  setExpanded(expanded === c.id ? null : c.id)
                }
              >
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>
                  {expanded === c.id
                    ? c.message
                    : c.message.length > 80
                    ? c.message.slice(0, 80) + "..."
                    : c.message}
                </td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-empty">
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
