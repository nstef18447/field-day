"use client";

import { useState } from "react";
import type { Product } from "@/app/types";
import { useCart } from "@/app/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isComingSoon = product.badge === "Coming Soon";
  const isCustomizable = product.badge === "Customizable" && (product.max_custom_chars ?? 0) > 0;
  const price = `$${(product.price_cents / 100).toFixed(2)}`;

  const [customText, setCustomText] = useState("");
  const [showInput, setShowInput] = useState(false);

  function handleAddToCart() {
    if (isCustomizable && !showInput) {
      setShowInput(true);
      return;
    }
    addToCart(product, isCustomizable ? customText : undefined);
    setCustomText("");
    setShowInput(false);
  }

  return (
    <div className="product-card reveal">
      {product.badge && <span className="badge">{product.badge}</span>}
      <div className="product-img-wrap">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="product-img" />
        ) : (
          <span className="product-emoji">🏷️</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">{price}</p>

        {showInput && isCustomizable && (
          <div className="product-customize">
            <input
              type="text"
              className="product-customize-input"
              placeholder={`Enter text (max ${product.max_custom_chars} chars)`}
              maxLength={product.max_custom_chars}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <button
          className="product-btn"
          disabled={isComingSoon || (showInput && customText.length === 0)}
          onClick={handleAddToCart}
        >
          {isComingSoon
            ? "Coming Soon"
            : showInput
              ? "Add to Cart"
              : isCustomizable
                ? "Customize & Add"
                : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
