import type { Product } from "@/app/types";

export { type Product };

export const products: Product[] = [
  {
    id: 1,
    emoji: "🏆",
    name: "Personalized Pennant",
    description: "Hand-stitched felt pennant with your child's name",
    price: "$38",
    badge: "Customizable",
  },
  {
    id: 2,
    emoji: "🎖️",
    name: "Award Ribbon",
    description: "Felt ribbon to celebrate every milestone",
    price: "$24",
  },
  {
    id: 3,
    emoji: "⭐",
    name: "Gold Star Badge",
    description: "A keepsake for your little champion",
    price: "$18",
    badge: "Coming Soon",
  },
  {
    id: 4,
    emoji: "🎪",
    name: "Mini Banner Set",
    description: "Set of 3 mini felt pennants for party or nursery",
    price: "$45",
    badge: "Customizable",
  },
  {
    id: 5,
    emoji: "🎀",
    name: "Birthday Pennant",
    description: "A special pennant marking each year of growing",
    price: "$34",
  },
  {
    id: 6,
    emoji: "✉️",
    name: "Pen Pal Kit",
    description: "Vintage-inspired stationery for little letter writers",
    price: "$28",
    badge: "Coming Soon",
  },
];
