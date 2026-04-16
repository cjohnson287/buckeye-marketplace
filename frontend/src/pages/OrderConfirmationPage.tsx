import { Link, useLocation } from "react-router-dom";
import styles from "./OrderConfirmationPage.module.css";

interface LocationState {
  confirmationNumber?: string;
  total?: number;
}

export default function OrderConfirmationPage() {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;

  return (
    <section className={styles.page}>
      <h1>Order Confirmed</h1>
      <p>Your order was placed successfully.</p>
      {state?.confirmationNumber && <p>Confirmation #: <strong>{state.confirmationNumber}</strong></p>}
      {typeof state?.total === "number" && <p>Order Total: <strong>${state.total.toFixed(2)}</strong></p>}
      <div className={styles.actions}>
        <Link to="/orders">View order history</Link>
        <Link to="/">Continue shopping</Link>
      </div>
    </section>
  );
}
