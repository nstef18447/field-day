"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";

interface OrderItem {
  id: string;
  quantity: number;
  price_cents: number;
  products: { name: string } | null;
}

interface OrderData {
  id: string;
  customer_email: string;
  total_cents: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

interface OrderRowProps {
  order: OrderData;
  onStatusChange: () => void;
}

export default function OrderRow({ order, onStatusChange }: OrderRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setUpdating(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(false);
    onStatusChange();
  }

  const date = new Date(order.created_at).toLocaleDateString();
  const total = `$${(order.total_cents / 100).toFixed(2)}`;
  const shortId = order.id.slice(0, 8) + "...";

  return (
    <>
      <tr
        className="admin-order-row"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="admin-order-id">{shortId}</td>
        <td>{order.customer_email || "—"}</td>
        <td>{total}</td>
        <td>
          <StatusBadge status={order.status} />
        </td>
        <td>{date}</td>
        <td onClick={(e) => e.stopPropagation()}>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="admin-status-select"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="admin-order-detail">
          <td colSpan={6}>
            <div className="admin-order-items">
              <h4>Order Items</h4>
              {order.order_items.length === 0 ? (
                <p>No items</p>
              ) : (
                <table className="admin-subtable">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {item.products?.name || "Unknown"}
                        </td>
                        <td>{item.quantity}</td>
                        <td>${(item.price_cents / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
