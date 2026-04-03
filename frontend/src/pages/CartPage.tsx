import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart, refreshCart } = useCart();
  const [actionErrors, setActionErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    refreshCart();
  }, []);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setActionErrors((prev) => ({ ...prev, [cartItemId]: "" }));
      await updateQuantity(cartItemId, newQuantity);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update quantity";
      setActionErrors((prev) => ({ ...prev, [cartItemId]: message }));
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setActionErrors((prev) => ({ ...prev, [cartItemId]: "" }));
      await removeFromCart(cartItemId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to remove item";
      setActionErrors((prev) => ({ ...prev, [cartItemId]: message }));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Failed to clear cart:", error);
      }
    }
  };

  if (state.status === "loading") {
    return <p className={styles.status}>Loading cart…</p>;
  }

  if (state.error) {
    return <p className={styles.error}>Error: {state.error}</p>;
  }

  const cart = state.data;
  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className={styles.page}>
      <h1>Shopping Cart</h1>

      {isEmpty ? (
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
          <Link to="/" className={styles.browseLink}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.cartTable}>
            <div className={styles.cartHeader}>
              <div className={styles.columnProduct}>Product</div>
              <div className={styles.columnPrice}>Price</div>
              <div className={styles.columnQuantity}>Quantity</div>
              <div className={styles.columnSubtotal}>Subtotal</div>
              <div className={styles.columnAction}></div>
            </div>

            {cart.items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.columnProduct}>{item.title}</div>
                <div className={styles.columnPrice}>${item.price.toFixed(2)}</div>
                <div className={styles.columnQuantity}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                    }
                    className={styles.quantityInput}
                    aria-label={`Quantity for ${item.title}`}
                  />
                </div>
                <div className={styles.columnSubtotal}>${item.subtotal.toFixed(2)}</div>
                <div className={styles.columnAction}>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className={styles.removeButton}
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    ✕
                  </button>
                </div>
                {actionErrors[item.id] && (
                  <div className={styles.itemError}>{actionErrors[item.id]}</div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.totalRow}>
              <span>Total:</span>
              <span className={styles.totalAmount}>${cart.total.toFixed(2)}</span>
            </div>

            <div className={styles.cartActions}>
              <button
                onClick={handleClearCart}
                className={styles.clearButton}
                aria-label="Clear entire cart"
              >
                Clear Cart
              </button>
              <Link to="/checkout" className={styles.checkoutButton}>
                Proceed to Checkout
              </Link>
            </div>
          </div>

          <div className={styles.continueShopping}>
            <Link to="/" className={styles.browseLink}>
              ← Continue Shopping
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
