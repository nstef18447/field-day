import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

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
  const { name, description, emoji, price, price_cents, badge, category, is_active, images } = body;

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      name,
      description,
      emoji,
      price,
      price_cents: price_cents || 0,
      badge: badge || null,
      category: category || null,
      is_active: is_active ?? true,
      images: images || [],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
