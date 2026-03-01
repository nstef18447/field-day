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
    emoji: p.emoji ?? "",
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    badge: p.badge ?? undefined,
  }));
}
