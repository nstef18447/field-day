"use client";

import { useState } from "react";
import type { Product } from "@/app/types";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onClose: () => void;
}

const emptyProduct = {
  name: "",
  description: "",
  emoji: "",
  price: "",
  price_cents: 0,
  badge: "",
  category: "",
  is_active: true,
  images: [] as string[],
};

export default function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          description: product.description,
          emoji: product.emoji,
          price: product.price,
          price_cents: product.price_cents || 0,
          badge: product.badge || "",
          category: product.category || "",
          is_active: product.is_active ?? true,
          images: product.images || [],
        }
      : emptyProduct
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: string, value: string | number | boolean | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        onSave();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{product ? "Edit Product" : "New Product"}</h2>
          <button onClick={onClose} className="admin-modal-close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="admin-product-form">
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Emoji</label>
              <input
                type="text"
                value={form.emoji}
                onChange={(e) => updateField("emoji", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Price (display)</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="$12"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Price (cents)</label>
              <input
                type="number"
                value={form.price_cents}
                onChange={(e) => updateField("price_cents", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Badge</label>
              <select
                value={form.badge}
                onChange={(e) => updateField("badge", e.target.value)}
              >
                <option value="">None</option>
                <option value="Customizable">Customizable</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-toggle-label">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
              />
              Active
            </label>
          </div>

          <div className="admin-form-group">
            <label>Images</label>
            <ImageUploader
              images={form.images}
              onChange={(imgs) => updateField("images", imgs)}
            />
          </div>

          {error && <p className="admin-form-error">{error}</p>}

          <div className="admin-form-actions">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
