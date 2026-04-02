import { supabase } from "./supabase";
import type { ProductVariant } from "@/app/types";

export async function getVariantsByProductId(productId: number): Promise<ProductVariant[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as ProductVariant[];
}
