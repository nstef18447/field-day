import { products as localProducts } from "@/app/data/products";
import type { Product } from "@/app/types";
import { supabase } from "./supabase";

export async function getProducts(): Promise<Product[]> {
  if (!supabase) return localProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("id");

  if (error || !data) return localProducts;

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    detail: p.detail ?? undefined,
    materials: p.materials ?? undefined,
    size: p.size ?? undefined,
    hanging: p.hanging ?? undefined,
    shipping: p.shipping ?? undefined,
    price_cents: p.price_cents,
    badge: p.badge ?? undefined,
    images: p.images ?? [],
    max_custom_chars: p.max_custom_chars ?? 0,
  }));
}

export async function getProductById(id: string): Promise<Product | null> {
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return null;

  if (!supabase) {
    return localProducts.find((p) => p.id === numId) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", numId)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return localProducts.find((p) => p.id === numId) ?? null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? "",
    detail: data.detail ?? undefined,
    materials: data.materials ?? undefined,
    size: data.size ?? undefined,
    hanging: data.hanging ?? undefined,
    shipping: data.shipping ?? undefined,
    price_cents: data.price_cents,
    badge: data.badge ?? undefined,
    images: data.images ?? [],
    max_custom_chars: data.max_custom_chars ?? 0,
  };
}
