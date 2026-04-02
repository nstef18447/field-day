import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json([]);
  }

  const productId = request.nextUrl.searchParams.get("product_id");
  if (!productId) {
    return NextResponse.json({ error: "product_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", parseInt(productId))
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
