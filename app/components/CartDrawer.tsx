"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import EmbeddedCheckoutForm from "./EmbeddedCheckoutForm";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, cartTotal, isOpen, setIsOpen } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  // Reset checkout state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setCheckoutError("");
    }
  }, [isOpen]);

  async function handleCheckout() {
    setCheckingOut(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckoutError(data.error || "Checkout failed");
        setCheckingOut(false);
        return;
      }
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
      setCheckingOut(false);
    } catch {
      setCheckoutError("Something went wrong. Please try again.");
      setCheckingOut(false);
    }
  }

  function handleBackToCart() {
    setClientSecret(null);
    setCheckoutError("");
  }

  const isCheckoutMode = !!clientSecret;

  return (
    <>
      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)} />
      )}
      <div className={`cart-drawer ${isOpen ? "cart-drawer-open" : ""} ${isCheckoutMode ? "cart-drawer-wide" : ""}`}>
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">
            {isCheckoutMode ? "Checkout" : "Your Cart"}
          </h2>
          <button className="cart-drawer-close" onClick={() => setIsOpen(false)}>
            ×
          </button>
        </div>

        {isCheckoutMode ? (
          /* ── Embedded Stripe Checkout ── */
          <div className="cart-checkout-wrap">
            <button className="cart-back-btn" onClick={handleBackToCart}>
              ← Back to Cart
            </button>
            <EmbeddedCheckoutForm clientSecret={clientSecret} />
          </div>
        ) : items.length === 0 ? (
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
                      {item.variant_name && (
                        <span className="cart-item-custom">
                          {item.variant_name}
                          {item.selected_character ? ` — "${item.selected_character}"` : ""}
                        </span>
                      )}
                      {item.customization_text && !item.variant_name && (
                        <span className="cart-item-custom">
                          &ldquo;{item.customization_text}&rdquo;
                        </span>
                      )}
                      <span className="cart-item-price">{itemPrice}</span>
                    </div>
                    <div className="cart-item-actions">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant_id, item.selected_character)}
                      >
                        −
                      </button>
                      <span className="cart-qty">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant_id, item.selected_character)}
                      >
                        +
                      </button>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.product.id, item.variant_id, item.selected_character)}
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

              {checkoutError && (
                <p className="cart-checkout-error">{checkoutError}</p>
              )}

              <button
                className="cart-checkout-btn"
                onClick={handleCheckout}
                disabled={checkingOut}
              >
                {checkingOut ? "Processing..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
