import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import styles from './CartSidebar.module.css';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const navigate = useNavigate();
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const items = state.data?.items || [];
  const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setLoading(true);
    try {
      await updateQuantity(cartItemId, newQuantity);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    setLoading(true);
    try {
      await removeFromCart(cartItemId);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    setLoading(true);
    try {
      await clearCart();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Shopping Cart</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        <div className={styles.items}>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map((item: { id: number; productId: number; title: string; price: number; quantity: number; imageUrl?: string }) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className={styles.itemImage} />
                  )}
                  <div>
                    <h4>{item.title}</h4>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className={styles.quantityControls}>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={loading || item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={loading}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={loading}
                  aria-label="Remove item"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <strong>Total: ${total.toFixed(2)}</strong>
            </div>
            <button
              className={styles.clearButton}
              onClick={handleClearCart}
              disabled={loading}
            >
              Clear Cart
            </button>
            <button className={styles.checkoutButton} onClick={handleCheckout} disabled={loading}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}