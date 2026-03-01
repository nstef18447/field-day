export interface Product {
  id: number;
  emoji: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
  // Supabase-ready fields (optional for backward compat)
  images?: string[];
  category?: string;
  is_active?: boolean;
  price_cents?: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  total_cents: number;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  price_cents: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
