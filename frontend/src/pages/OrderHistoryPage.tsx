import { useEffect, useState } from "react";
import { fetchMyOrders } from "../api/orders";
import type { Order } from "../types/order";
import styles from "./OrderHistoryPage.module.css";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchMyOrders()
      .then((data) => {
        if (!cancelled) {
          setOrders(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load order history");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className={styles.status}>Loading your orders...</p>;
  }

  if (error) {
    return <p className={styles.error}>Error: {error}</p>;
  }

  if (orders.length === 0) {
    return <p className={styles.status}>You have not placed any orders yet.</p>;
  }

  return (
    <section className={styles.page}>
      <h1>My Orders</h1>
      <div className={styles.list}>
        {orders.map((order) => (
          <article key={order.id} className={styles.card}>
            <h2>{order.confirmationNumber}</h2>
            <p>Status: <strong>{order.status}</strong></p>
            <p>Total: ${order.total.toFixed(2)}</p>
            <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
            <p>Ship To: {order.shippingAddress}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
