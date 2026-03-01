"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/app/types";
import ProductForm from "../components/ProductForm";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

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
      <div className="admin-page-header">
        <h2>Products</h2>
        <button
          className="admin-btn-primary"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + New Product
        </button>
      </div>

      {loading ? (
        <p className="admin-loading">Loading products...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Emoji</th>
              <th>Name</th>
              <th>Price</th>
              <th>Badge</th>
              <th>Category</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={!p.is_active ? "admin-row-inactive" : ""}>
                <td>{p.emoji}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.badge || "—"}</td>
                <td>{p.category || "—"}</td>
                <td>
                  <button
                    className={`admin-toggle ${p.is_active ? "on" : "off"}`}
                    onClick={() => handleToggleActive(p)}
                    title={p.is_active ? "Deactivate" : "Activate"}
                  >
                    {p.is_active ? "On" : "Off"}
                  </button>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn-sm"
                      onClick={() => {
                        setEditing(p);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-btn-sm admin-btn-danger"
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
                <td colSpan={7} className="admin-empty">
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
    </div>
  );
}
