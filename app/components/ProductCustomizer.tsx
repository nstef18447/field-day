"use client";

import { useEffect, useRef, useState } from "react";
import type { Product, ProductVariant } from "@/app/types";
import { useCart } from "@/app/context/CartContext";
import { drawFeltLetter } from "@/lib/drawFeltLetter";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "0123456789".split("");

interface ProductCustomizerProps {
  product: Product;
}

export default function ProductCustomizer({ product }: ProductCustomizerProps) {
  const { addToCart } = useCart();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [tab, setTab] = useState<"letters" | "numbers">("letters");
  const [loading, setLoading] = useState(true);
  const [animatingChar, setAnimatingChar] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function fetchVariants() {
      try {
        const res = await fetch(`/api/variants?product_id=${product.id}`);
        if (res.ok) {
          const data: ProductVariant[] = await res.json();
          setVariants(data);
          if (data.length > 0) setSelectedVariant(data[0]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchVariants();
  }, [product.id]);

  // Draw felt-textured character on canvas when character or color changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedChar || !selectedVariant) return;
    drawFeltLetter(canvas, selectedChar, selectedVariant.character_color);
  }, [selectedChar, selectedVariant?.character_color, selectedVariant]);

  function handleSelectChar(char: string) {
    setSelectedChar(char);
    setAnimatingChar(true);
    setTimeout(() => setAnimatingChar(false), 300);
  }

  function handleAddToCart() {
    if (!selectedVariant || !selectedChar) return;
    addToCart(product, {
      variant_id: selectedVariant.id,
      variant_name: selectedVariant.name,
      selected_character: selectedChar,
    });
    setSelectedChar(null);
  }

  if (loading) {
    return (
      <div className="product-detail-actions">
        <p style={{ color: "#888", fontStyle: "italic" }}>Loading customizer...</p>
      </div>
    );
  }

  if (variants.length === 0) return null;

  const price = `$${(product.price_cents / 100).toFixed(2)}`;

  return (
    <div className="customizer-layout">
      {/* LEFT: Product photo with character overlay */}
      <div className="customizer-preview">
        <div className="customizer-photo-wrap">
          {selectedVariant?.photo ? (
            <img
              src={selectedVariant.photo}
              alt={selectedVariant.name}
              className="customizer-photo"
            />
          ) : (
            <div className="customizer-photo-placeholder">No photo</div>
          )}
          {selectedChar && selectedVariant && (
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className={`customizer-char-overlay${animatingChar ? " customizer-char-animate" : ""}`}
              style={{
                left: `${selectedVariant.character_position_x}%`,
                top: `${selectedVariant.character_position_y}%`,
                width: `${selectedVariant.character_size}vw`,
                height: `${selectedVariant.character_size}vw`,
              }}
            />
          )}
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className="customizer-controls">
        <h1 className="product-detail-name">{product.name}</h1>
        <p className="product-detail-price">{price}</p>
        <p className="product-detail-desc">{product.description}</p>

        {/* Color scheme selector */}
        <div className="customizer-section">
          <label className="customizer-label">Color Scheme</label>
          <div className="customizer-swatches">
            {variants.map((v) => (
              <button
                key={v.id}
                className={`customizer-swatch${selectedVariant?.id === v.id ? " customizer-swatch-active" : ""}`}
                onClick={() => setSelectedVariant(v)}
                title={v.name}
              >
                {v.photo ? (
                  <img src={v.photo} alt={v.name} />
                ) : (
                  <span style={{ fontSize: "0.6rem", color: "#888" }}>?</span>
                )}
              </button>
            ))}
          </div>
          {selectedVariant && (
            <p className="customizer-swatch-name">{selectedVariant.name}</p>
          )}
        </div>

        {/* Character picker */}
        <div className="customizer-section">
          <label className="customizer-label">Choose Your Character</label>
          <div className="customizer-tabs">
            <button
              className={`customizer-tab${tab === "letters" ? " customizer-tab-active" : ""}`}
              onClick={() => setTab("letters")}
            >
              A–Z
            </button>
            <button
              className={`customizer-tab${tab === "numbers" ? " customizer-tab-active" : ""}`}
              onClick={() => setTab("numbers")}
            >
              0–9
            </button>
          </div>
          <div className="customizer-char-grid">
            {(tab === "letters" ? LETTERS : NUMBERS).map((char) => (
              <button
                key={char}
                className={`customizer-char-btn${selectedChar === char ? " customizer-char-btn-active" : ""}`}
                onClick={() => handleSelectChar(char)}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        <button
          className="product-btn product-detail-btn"
          disabled={!selectedVariant || !selectedChar}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
