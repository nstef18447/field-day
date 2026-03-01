import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, description, emoji, price, price_cents, badge, category, is_active, images } = body;

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({
      name,
      description,
      emoji,
      price,
      price_cents,
      badge: badge || null,
      category: category || null,
      is_active,
      images: images || [],
    })
    .eq("id", parseInt(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
