import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import CartSidebar from "./CartSidebar";
import styles from "./Layout.module.css";

export default function Layout() {
  const { state } = useCart();
  const { state: authState, logout } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌰</span>
            <h1 className={styles.title}>Buckeye Marketplace</h1>
          </Link>
          <nav className={styles.nav}>
            {authState.isAuthenticated ? (
              <>
                <Link to="/orders" className={styles.cartLink} aria-label="View my orders">📦</Link>
                {authState.user?.role === "Admin" && (
                  <Link to="/admin" className={styles.cartLink} aria-label="Open admin dashboard">🛠️</Link>
                )}
                <button 
                  className={styles.cartLink} 
                  onClick={() => setCartOpen(!cartOpen)}
                  aria-label="View cart"
                  type="button"
                >
                  <span className={styles.cartIcon}>🛒</span>
                  {state.itemCount > 0 && (
                    <span className={styles.cartBadge}>{state.itemCount}</span>
                  )}
                </button>
                <button className={styles.cartLink} onClick={logout} aria-label="Logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.cartLink} aria-label="Login">Login</Link>
                <Link to="/register" className={styles.cartLink} aria-label="Register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
