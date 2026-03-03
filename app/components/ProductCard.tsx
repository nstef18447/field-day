"use client";

import type { Product } from "@/app/types";
import { useCart } from "@/app/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const isComingSoon = product.badge === "Coming Soon";
  const price = `$${(product.price_cents / 100).toFixed(2)}`;

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
