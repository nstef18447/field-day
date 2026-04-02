import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const productId = request.nextUrl.searchParams.get("product_id");

  let query = supabaseAdmin
    .from("product_variants")
    .select("*")
    .order("sort_order", { ascending: true });

  if (productId) {
    query = query.eq("product_id", parseInt(productId));
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = await request.json();
  const {
    product_id,
    name,
    photo,
    character_font,
    character_color,
    character_stroke_color,
    character_stroke_width,
    character_position_x,
    character_position_y,
    character_size,
    is_active,
    sort_order,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("product_variants")
    .insert({
      product_id,
      name,
      photo: photo || null,
      character_font: character_font || "Lilita One",
      character_color: character_color || "#FFFFFF",
      character_stroke_color: character_stroke_color || null,
      character_stroke_width: character_stroke_width || 0,
      character_position_x: character_position_x ?? 50,
      character_position_y: character_position_y ?? 50,
      character_size: character_size ?? 20,
      is_active: is_active ?? true,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
