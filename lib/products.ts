import { products as localProducts } from "@/app/data/products";
import type { Product } from "@/app/types";

export async function getProducts(): Promise<Product[]> {
  // TODO: swap to Supabase query when ready
  return localProducts;
}
