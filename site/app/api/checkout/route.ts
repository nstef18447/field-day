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
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.name },
        unit_amount: item.product.price_cents ?? 0,
      },
      quantity: item.quantity,
    })),
    success_url: `${origin}/?checkout=success`,
    cancel_url: `${origin}/?checkout=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
