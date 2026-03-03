export interface Product {
  id: number;
  name: string;
  description: string;
  price_cents: number;
  badge?: string;
  images?: string[];
  max_custom_chars?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customization_text?: string;
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
  customization_text?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
