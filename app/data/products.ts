import type { Product } from "@/app/types";

export { type Product };

export const products: Product[] = [
  {
    id: 1,
    name: "Personalized Pennant",
    description: "Hand-stitched felt pennant with your child's name",
    price_cents: 3800,
    badge: "Customizable",
    max_custom_chars: 1,
  },
  {
    id: 2,
    name: "Award Ribbon",
    description: "Felt ribbon to celebrate every milestone",
    price_cents: 2400,
  },
  {
    id: 3,
    name: "Gold Star Badge",
    description: "A keepsake for your little champion",
    price_cents: 1800,
    badge: "Coming Soon",
  },
  {
    id: 4,
    name: "Mini Banner Set",
    description: "Set of 3 mini felt pennants for party or nursery",
    price_cents: 4500,
    badge: "Customizable",
    max_custom_chars: 5,
  },
  {
    id: 5,
    name: "Birthday Pennant",
    description: "A special pennant marking each year of growing",
    price_cents: 3400,
  },
  {
    id: 6,
    name: "Pen Pal Kit",
    description: "Vintage-inspired stationery for little letter writers",
    price_cents: 2800,
    badge: "Coming Soon",
  },
];
