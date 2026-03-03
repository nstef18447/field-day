"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, cartTotal, isOpen, setIsOpen } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setCheckingOut(false);
    }
  }

  return (
    <>
      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      )}
      <div className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""}`}>
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your Cart</h2>
          <button className="cart-drawer-close" onClick={() => setIsOpen(false)}>
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p className="cart-drawer-empty">Your cart is empty</p>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item, i) => {
                const itemPrice = `$${(item.product.price_cents / 100).toFixed(2)}`;
                return (
                  <div key={`${item.product.id}-${i}`} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{item.product.name}</span>
                      {item.customization_text && (
                        <span className="cart-item-custom">
                          &ldquo;{item.customization_text}&rdquo;
                        </span>
                      )}
                      <span className="cart-item-price">{itemPrice}</span>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${(cartTotal / 100).toFixed(2)}</span>
              </div>
              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? "Redirecting..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
