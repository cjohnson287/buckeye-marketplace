import { Link, Outlet } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import styles from "./Layout.module.css";

export default function Layout() {
  const { state } = useCart();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌰</span>
            <h1 className={styles.title}>Buckeye Marketplace</h1>
          </Link>
          <nav className={styles.nav}>
            <Link to="/cart" className={styles.cartLink} aria-label="View cart">
              <span className={styles.cartIcon}>🛒</span>
              {state.itemCount > 0 && (
                <span className={styles.cartBadge}>{state.itemCount}</span>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
