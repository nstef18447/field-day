import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type { CartItem } from "@/app/types";

export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 503 }
    );
  }

  const { items } = (await request.json()) as { items: CartItem[] };

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const origin = new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    line_items: items.map((item) => {
      let name = item.product.name;
      if (item.variant_name) name += ` (${item.variant_name})`;
      if (item.selected_character) name += ` — "${item.selected_character}"`;
      if (item.customization_text && !item.variant_name) name += ` — "${item.customization_text}"`;

      return {
        price_data: {
          currency: "usd",
          product_data: { name },
          unit_amount: item.product.price_cents ?? 0,
        },
        quantity: item.quantity,
      };
    }),
    metadata: {
      items_json: JSON.stringify(
        items.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price_cents: item.product.price_cents,
          variant_id: item.variant_id || null,
          variant_name: item.variant_name || null,
          selected_character: item.selected_character || null,
          customization_text: item.customization_text || null,
        }))
      ),
    },
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: ["US"],
    },
    return_url: `${origin}/?checkout=success`,
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}
