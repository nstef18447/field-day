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
  price_dollars: "",
  badge: "",
  max_custom_chars: 0,
  is_active: true,
  images: [] as string[],
};

function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

function dollarsToCents(dollars: string): number {
  const parsed = parseFloat(dollars);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

export default function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const [form, setForm] = useState(
    product
      ? {
          name: product.name,
          description: product.description,
          price_dollars: centsToDollars(product.price_cents),
          badge: product.badge || "",
          max_custom_chars: product.max_custom_chars || 0,
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

      const payload = {
        name: form.name,
        description: form.description,
        price_cents: dollarsToCents(form.price_dollars),
        badge: form.badge,
        max_custom_chars: form.badge === "Customizable" ? form.max_custom_chars : 0,
        is_active: form.is_active,
        images: form.images,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Price ($)</label>
              <input
                type="text"
                inputMode="decimal"
                value={form.price_dollars}
                onChange={(e) => updateField("price_dollars", e.target.value)}
                placeholder="12.00"
                required
              />
            </div>
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
          </div>

          {form.badge === "Customizable" && (
            <div className="admin-form-group">
              <label>Max Characters</label>
              <input
                type="number"
                min={1}
                value={form.max_custom_chars}
                onChange={(e) => updateField("max_custom_chars", parseInt(e.target.value) || 0)}
              />
            </div>
          )}

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
