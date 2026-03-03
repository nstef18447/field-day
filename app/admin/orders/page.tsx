"use client";

import { useEffect, useState } from "react";
import OrderRow from "../components/OrderRow";

interface OrderData {
  id: string;
  customer_email: string;
  total_cents: number;
  status: string;
  created_at: string;
  order_items: {
    id: string;
    quantity: number;
    price_cents: number;
    products: { name: string } | null;
  }[];
}

const th: React.CSSProperties = {
  textAlign: "left", padding: "12px 16px", fontSize: "0.8rem",
  textTransform: "uppercase", letterSpacing: 1, color: "#888",
  borderBottom: "2px solid #e0d8cb", background: "#fff8ed",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      setOrders(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: '"Caveat Brush", cursive', fontSize: "1.8rem", color: "#5c622b", margin: 0 }}>Orders</h2>
      </div>

      {loading ? (
        <p style={{ color: "#888", fontStyle: "italic", padding: "32px 0" }}>Loading orders...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff8ed", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <thead>
            <tr>
              <th style={th}>Order ID</th>
              <th style={th}>Email</th>
              <th style={th}>Total</th>
              <th style={th}>Status</th>
              <th style={th}>Date</th>
              <th style={th}>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow key={order.id} order={order} onStatusChange={loadOrders} />
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#888", padding: 32 }}>No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
