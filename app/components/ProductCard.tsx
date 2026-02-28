"use client";

import type { Product } from "@/app/types";
import { useCart } from "@/app/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isComingSoon = product.badge === "Coming Soon";

  return (
    <div className="product-card reveal">
      {product.badge && <span className="badge">{product.badge}</span>}
      <div className="product-img-wrap">
        <span className="product-emoji">{product.emoji}</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">{product.price}</p>
        <button
          className="product-btn"
          disabled={isComingSoon}
          onClick={() => addToCart(product)}
        >
          {isComingSoon ? "Coming Soon" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
