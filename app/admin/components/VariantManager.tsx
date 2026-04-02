"use client";

import { useEffect, useState } from "react";
import type { ProductVariant } from "@/app/types";
import VariantForm from "./VariantForm";

interface VariantManagerProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  panel: {
    background: "#fff8ed",
    borderRadius: 16,
    width: "90%",
    maxWidth: 900,
    maxHeight: "90vh",
    overflowY: "auto" as const,
    boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid #e0d8cb",
  },
  title: {
    fontFamily: '"Caveat Brush", cursive',
    fontSize: "1.4rem",
    color: "#5c622b",
    margin: 0,
  },
  body: {
    padding: 24,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 16,
    marginTop: 16,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid #e0d8cb",
    position: "relative" as const,
  },
  cardInactive: {
    opacity: 0.5,
  },
  cardImage: {
    width: "100%",
    aspectRatio: "1",
    objectFit: "cover" as const,
    display: "block",
  },
  cardBody: {
    padding: 12,
  },
  cardName: {
    fontWeight: 600,
    fontSize: "0.9rem",
    color: "#333",
    margin: 0,
  },
  cardMeta: {
    fontSize: "0.75rem",
    color: "#888",
    marginTop: 4,
  },
  cardActions: {
    display: "flex",
    gap: 6,
    marginTop: 8,
  },
  btnSm: {
    background: "none",
    border: "1px solid #5c622b",
    color: "#5c622b",
    padding: "3px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.75rem",
  },
  btnDanger: {
    background: "none",
    border: "1px solid #c44",
    color: "#c44",
    padding: "3px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.75rem",
  },
  addCard: {
    background: "none",
    border: "2px dashed #bbb",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    cursor: "pointer",
    color: "#888",
    fontSize: "0.9rem",
    fontFamily: '"Caveat Brush", cursive',
    transition: "border-color 0.2s, color 0.2s",
  },
  noPhoto: {
    width: "100%",
    aspectRatio: "1",
    background: "#f0e8db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#aaa",
    fontSize: "0.8rem",
  },
};

export default function VariantManager({ productId, productName, onClose }: VariantManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);

  async function loadVariants() {
    setLoading(true);
    const res = await fetch(`/api/admin/variants?product_id=${productId}`);
    if (res.ok) {
      setVariants(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadVariants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this color scheme?")) return;
    await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
    loadVariants();
  }

  function handleSave() {
    setShowForm(false);
    setEditing(null);
    loadVariants();
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Color Schemes — {productName}</h2>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#888", lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
        <div style={styles.body}>
          {loading ? (
            <p style={{ color: "#888", fontStyle: "italic" }}>Loading...</p>
          ) : (
            <div style={styles.grid}>
              {variants.map((v) => (
                <div key={v.id} style={{ ...styles.card, ...(v.is_active ? {} : styles.cardInactive) }}>
                  {v.photo ? (
                    <img src={v.photo} alt={v.name} style={styles.cardImage} />
                  ) : (
                    <div style={styles.noPhoto}>No photo</div>
                  )}
                  <div style={styles.cardBody}>
                    <p style={styles.cardName}>{v.name}</p>
                    <p style={styles.cardMeta}>
                      {v.character_font} &middot;{" "}
                      <span
                        style={{
                          display: "inline-block",
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          background: v.character_color,
                          border: "1px solid #ccc",
                          verticalAlign: "middle",
                        }}
                      />{" "}
                      {v.character_color}
                    </p>
                    <div style={styles.cardActions}>
                      <button
                        style={styles.btnSm}
                        onClick={() => {
                          setEditing(v);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.btnDanger}
                        onClick={() => handleDelete(v.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                style={styles.addCard}
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = "#5c622b";
                  e.currentTarget.style.color = "#5c622b";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = "#bbb";
                  e.currentTarget.style.color = "#888";
                }}
              >
                + Add Color Scheme
              </button>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <VariantForm
          productId={productId}
          variant={editing}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
