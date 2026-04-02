"use client";

import Link from "next/link";
import type { Product } from "@/app/types";

export default function ProductCard({ product, fallbackImage }: { product: Product; fallbackImage?: string }) {
  const isComingSoon = product.badge === "Coming Soon";
  const price = `$${(product.price_cents / 100).toFixed(2)}`;
  const displayImage = (product.images && product.images.length > 0) ? product.images[0] : fallbackImage;

  return (
    <Link
      href={`/products/${product.id}`}
      className="product-card reveal"
      style={{ pointerEvents: isComingSoon ? "none" : "auto" }}
    >
      {product.badge && <span className="badge">{product.badge}</span>}
      <div className="product-img-wrap">
        {displayImage ? (
          <img src={displayImage} alt={product.name} className="product-img" />
        ) : (
          <span className="product-emoji">🏷️</span>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
        <p className="product-price">{isComingSoon ? "Coming Soon" : price}</p>
      </div>
    </Link>
  );
}
