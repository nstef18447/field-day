"use client";

import { createContext, useContext, useReducer, useState, type ReactNode } from "react";
import type { CartItem, Product } from "@/app/types";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; customization_text?: string; variant_id?: number; variant_name?: string; selected_character?: string }
  | { type: "REMOVE_ITEM"; productId: number; variant_id?: number; selected_character?: string }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number; variant_id?: number; selected_character?: string }
  | { type: "CLEAR_CART" };

function itemMatches(item: CartItem, productId: number, variantId?: number, selectedChar?: string, customText?: string): boolean {
  if (item.product.id !== productId) return false;
  if (item.variant_id !== variantId) return false;
  if (item.selected_character !== selectedChar) return false;
  if (item.customization_text !== customText) return false;
  return true;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) =>
        itemMatches(i, action.product.id, action.variant_id, action.selected_character, action.customization_text)
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            itemMatches(i, action.product.id, action.variant_id, action.selected_character, action.customization_text)
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: 1,
            customization_text: action.customization_text,
            variant_id: action.variant_id,
            variant_name: action.variant_name,
            selected_character: action.selected_character,
          },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) =>
          !(i.product.id === action.productId &&
            i.variant_id === action.variant_id &&
            i.selected_character === action.selected_character)
        ),
      };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) =>
            !(i.product.id === action.productId &&
              i.variant_id === action.variant_id &&
              i.selected_character === action.selected_character)
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          (i.product.id === action.productId &&
            i.variant_id === action.variant_id &&
            i.selected_character === action.selected_character)
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

interface AddToCartOptions {
  customization_text?: string;
  variant_id?: number;
  variant_name?: string;
  selected_character?: string;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, opts?: AddToCartOptions | string) => void;
  removeFromCart: (productId: number, variant_id?: number, selected_character?: string) => void;
  updateQuantity: (productId: number, quantity: number, variant_id?: number, selected_character?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product: Product, opts?: AddToCartOptions | string) => {
    // Backwards compatible: if opts is a string, treat as customization_text
    const options: AddToCartOptions = typeof opts === "string" ? { customization_text: opts } : (opts ?? {});
    dispatch({
      type: "ADD_ITEM",
      product,
      customization_text: options.customization_text,
      variant_id: options.variant_id,
      variant_name: options.variant_name,
      selected_character: options.selected_character,
    });
    setIsOpen(true);
  };
  const removeFromCart = (productId: number, variant_id?: number, selected_character?: string) =>
    dispatch({ type: "REMOVE_ITEM", productId, variant_id, selected_character });
  const updateQuantity = (productId: number, quantity: number, variant_id?: number, selected_character?: string) =>
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity, variant_id, selected_character });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const cartTotal = state.items.reduce(
    (sum, i) => sum + i.product.price_cents * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
