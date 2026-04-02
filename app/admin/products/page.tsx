"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/app/types";
import ProductForm from "../components/ProductForm";
import VariantManager from "../components/VariantManager";

const styles = {
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  } as React.CSSProperties,
  pageTitle: {
    fontFamily: '"Caveat Brush", cursive',
    fontSize: "1.8rem",
    color: "#5c622b",
    margin: 0,
  } as React.CSSProperties,
  btnPrimary: {
    background: "#5c622b",
    color: "#fff8ed",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    fontFamily: '"Caveat Brush", cursive',
    fontSize: "1rem",
    cursor: "pointer",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    background: "#fff8ed",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  } as React.CSSProperties,
  th: {
    textAlign: "left" as const,
    padding: "12px 16px",
    fontSize: "0.8rem",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    color: "#888",
    borderBottom: "2px solid #e0d8cb",
    background: "#fff8ed",
  } as React.CSSProperties,
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #f0e8db",
    fontSize: "0.9rem",
  } as React.CSSProperties,
  empty: {
    textAlign: "center" as const,
    color: "#888",
    padding: 32,
  } as React.CSSProperties,
  toggleOn: {
    padding: "3px 10px",
    borderRadius: 12,
    border: "none",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "#d4edda",
    color: "#155724",
  } as React.CSSProperties,
  toggleOff: {
    padding: "3px 10px",
    borderRadius: 12,
    border: "none",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "#f0d0d0",
    color: "#721c24",
  } as React.CSSProperties,
  btnSm: {
    background: "none",
    border: "1px solid #5c622b",
    color: "#5c622b",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.8rem",
  } as React.CSSProperties,
  btnDanger: {
    background: "none",
    border: "1px solid #c44",
    color: "#c44",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.8rem",
  } as React.CSSProperties,
  actions: {
    display: "flex",
    gap: 8,
  } as React.CSSProperties,
};

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [variantProduct, setVariantProduct] = useState<Product | null>(null);

  async function loadProducts() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      setProducts(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleToggleActive(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, is_active: !product.is_active }),
    });
    loadProducts();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  function handleSave() {
    setShowForm(false);
    setEditing(null);
    loadProducts();
  }

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Products</h2>
        <button
          style={styles.btnPrimary}
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + New Product
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#888", fontStyle: "italic", padding: "32px 0" }}>
          Loading products...
        </p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Badge</th>
              <th style={styles.th}>Active</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={!p.is_active ? { opacity: 0.5 } : {}}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{formatPrice(p.price_cents)}</td>
                <td style={styles.td}>
                  {p.badge || "—"}
                  {p.badge === "Customizable" && p.max_custom_chars
                    ? ` (${p.max_custom_chars} chars)`
                    : ""}
                </td>
                <td style={styles.td}>
                  <button
                    style={p.is_active ? styles.toggleOn : styles.toggleOff}
                    onClick={() => handleToggleActive(p)}
                  >
                    {p.is_active ? "On" : "Off"}
                  </button>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      style={styles.btnSm}
                      onClick={() => setVariantProduct(p)}
                    >
                      Color Schemes
                    </button>
                    <button
                      style={styles.btnSm}
                      onClick={() => {
                        setEditing(p);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.btnDanger}
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={styles.empty}>
                  No products yet. Click &quot;New Product&quot; to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showForm && (
        <ProductForm
          product={editing}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {variantProduct && (
        <VariantManager
          productId={variantProduct.id}
          productName={variantProduct.name}
          onClose={() => setVariantProduct(null)}
        />
      )}
    </div>
  );
}
