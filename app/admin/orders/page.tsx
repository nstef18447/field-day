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
    products: { name: string; emoji: string } | null;
  }[];
}

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
      <div className="admin-page-header">
        <h2>Orders</h2>
      </div>

      {loading ? (
        <p className="admin-loading">Loading orders...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Email</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onStatusChange={loadOrders}
              />
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-empty">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
