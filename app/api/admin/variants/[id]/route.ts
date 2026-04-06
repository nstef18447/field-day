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
  const {
    name,
    photo,
    character_font,
    character_color,
    character_stroke_color,
    character_stroke_width,
    character_position_x,
    character_position_y,
    character_size,
    stripe_color_1,
    stripe_color_2,
    stripe_color_3,
    is_active,
    sort_order,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("product_variants")
    .update({
      name,
      photo: photo || null,
      character_font,
      character_color,
      character_stroke_color: character_stroke_color || null,
      character_stroke_width: character_stroke_width || 0,
      character_position_x,
      character_position_y,
      character_size,
      stripe_color_1: stripe_color_1 || "#04324b",
      stripe_color_2: stripe_color_2 || "#a4cea6",
      stripe_color_3: stripe_color_3 || "#c97a4a",
      is_active,
      sort_order,
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
    .from("product_variants")
    .delete()
    .eq("id", parseInt(id));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
