"use client";

import { useState } from "react";
import type { Product } from "@/app/types";
import { useCart } from "@/app/context/CartContext";

export default function ProductDetailActions({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isCustomizable = product.badge === "Customizable" && (product.max_custom_chars ?? 0) > 0;

  const [customText, setCustomText] = useState("");

  function handleAddToCart() {
    addToCart(product, isCustomizable ? customText : undefined);
    setCustomText("");
  }

  return (
    <div className="product-detail-actions">
      {isCustomizable && (
        <div className="product-detail-customize">
          <label className="product-detail-customize-label">
            Personalize It
          </label>
          <input
            type="text"
            className="product-customize-input"
            placeholder={`Enter text (max ${product.max_custom_chars} chars)`}
            maxLength={product.max_custom_chars}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
          />
        </div>
      )}

      <button
        className="product-btn product-detail-btn"
        disabled={isCustomizable && customText.length === 0}
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
}
