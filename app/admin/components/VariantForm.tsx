"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductVariant } from "@/app/types";
import ImageUploader from "./ImageUploader";
import { drawFeltLetter } from "@/lib/drawFeltLetter";

const FONT_OPTIONS = [
  "Lilita One",
  "Bungee",
  "Rubik Mono One",
  "Passion One",
  "Barriecito",
  "Fugaz One",
];

interface VariantFormProps {
  productId: number;
  variant?: ProductVariant | null;
  onSave: () => void;
  onClose: () => void;
}

const defaultVariant = {
  name: "",
  photo: "",
  character_font: "Lilita One",
  character_color: "#FFFFFF",
  character_stroke_color: "",
  character_stroke_width: 0,
  character_position_x: 50,
  character_position_y: 50,
  character_size: 20,
  is_active: true,
  sort_order: 0,
};

export default function VariantForm({ productId, variant, onSave, onClose }: VariantFormProps) {
  const [form, setForm] = useState(
    variant
      ? {
          name: variant.name,
          photo: variant.photo || "",
          character_font: variant.character_font,
          character_color: variant.character_color,
          character_stroke_color: variant.character_stroke_color || "",
          character_stroke_width: variant.character_stroke_width || 0,
          character_position_x: variant.character_position_x,
          character_position_y: variant.character_position_y,
          character_size: variant.character_size,
          is_active: variant.is_active ?? true,
          sort_order: variant.sort_order,
        }
      : defaultVariant
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [previewChar, setPreviewChar] = useState("A");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !previewChar) return;
    drawFeltLetter(canvas, previewChar, form.character_color);
  }, [previewChar, form.character_color]);

  function updateField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = variant
        ? `/api/admin/variants/${variant.id}`
        : "/api/admin/variants";
      const method = variant ? "PUT" : "POST";

      const payload = {
        product_id: productId,
        name: form.name,
        photo: form.photo || null,
        character_font: form.character_font,
        character_color: form.character_color,
        character_stroke_color: form.character_stroke_color || null,
        character_stroke_width: form.character_stroke_width || 0,
        character_position_x: form.character_position_x,
        character_position_y: form.character_position_y,
        character_size: form.character_size,
        is_active: form.is_active,
        sort_order: form.sort_order,
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

  // Font link kept for potential future use with character_font field
  const fontLink = `https://fonts.googleapis.com/css2?family=${form.character_font.replace(/ /g, "+")}&display=swap`;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal"
        style={{ maxWidth: 800 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={fontLink} />
        <div className="admin-modal-header">
          <h2>{variant ? "Edit Color Scheme" : "New Color Scheme"}</h2>
          <button onClick={onClose} className="admin-modal-close">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="admin-product-form">
          {/* Top: Preview + Photo side by side */}
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {/* Live Preview */}
            <div style={{ flex: "1 1 260px", minWidth: 260 }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#04324b", marginBottom: 8, display: "block" }}>
                Live Preview
              </label>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1",
                  background: "#eee",
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid #ddd",
                }}
              >
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt="Variant preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                      fontSize: "0.85rem",
                    }}
                  >
                    Upload a photo first
                  </div>
                )}
                {/* Character overlay — felt texture canvas */}
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  style={{
                    position: "absolute",
                    left: `${form.character_position_x}%`,
                    top: `${form.character_position_y}%`,
                    transform: "translate(-50%, -50%)",
                    width: `${form.character_size}%`,
                    height: `${form.character_size}%`,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />
              </div>
              <div className="admin-form-group" style={{ marginTop: 8 }}>
                <label>Preview Character</label>
                <input
                  type="text"
                  maxLength={1}
                  value={previewChar}
                  onChange={(e) => setPreviewChar(e.target.value.toUpperCase() || "A")}
                  style={{ width: 60, textAlign: "center", fontSize: "1.2rem" }}
                />
              </div>
            </div>

            {/* Right column: fields */}
            <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="admin-form-group">
                <label>Scheme Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Gold & Mint"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Photo</label>
                <ImageUploader
                  images={form.photo ? [form.photo] : []}
                  onChange={(imgs) => updateField("photo", imgs[imgs.length - 1] || "")}
                />
              </div>

              <div className="admin-form-group">
                <label>Font</label>
                <select
                  value={form.character_font}
                  onChange={(e) => updateField("character_font", e.target.value)}
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Character Color</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={form.character_color}
                      onChange={(e) => updateField("character_color", e.target.value)}
                      style={{ width: 40, height: 36, padding: 2, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={form.character_color}
                      onChange={(e) => updateField("character_color", e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Stroke Color</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={form.character_stroke_color || "#000000"}
                      onChange={(e) => updateField("character_stroke_color", e.target.value)}
                      style={{ width: 40, height: 36, padding: 2, border: "1px solid #ddd", borderRadius: 6, cursor: "pointer" }}
                    />
                    <input
                      type="text"
                      value={form.character_stroke_color}
                      onChange={(e) => updateField("character_stroke_color", e.target.value)}
                      placeholder="Optional"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Stroke Width</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={form.character_stroke_width}
                    onChange={(e) => updateField("character_stroke_width", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Position & Size controls */}
          <div style={{ borderTop: "1px solid #e0d8cb", paddingTop: 16 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#04324b", marginBottom: 12, display: "block" }}>
              Character Position &amp; Size
            </label>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>X Position ({form.character_position_x}%)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={form.character_position_x}
                  onChange={(e) => updateField("character_position_x", parseFloat(e.target.value))}
                />
              </div>
              <div className="admin-form-group">
                <label>Y Position ({form.character_position_y}%)</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={form.character_position_y}
                  onChange={(e) => updateField("character_position_y", parseFloat(e.target.value))}
                />
              </div>
              <div className="admin-form-group">
                <label>Size ({form.character_size}%)</label>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={0.5}
                  value={form.character_size}
                  onChange={(e) => updateField("character_size", parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Sort order and active toggle */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Sort Order</label>
              <input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="admin-form-group" style={{ justifyContent: "flex-end" }}>
              <label className="admin-toggle-label">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateField("is_active", e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>

          {error && <p className="admin-form-error">{error}</p>}

          <div className="admin-form-actions">
            <button type="button" onClick={onClose} className="admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Color Scheme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
