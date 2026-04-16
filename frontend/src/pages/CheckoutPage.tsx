import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../contexts/CartContext';
import { placeOrder } from '../api/orders';
import styles from './CheckoutPage.module.css';

interface CheckoutFormData {
  shippingAddress: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state, refreshCart } = useCart();
  const cart = state.data;
  const [orderError, setOrderError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>();

  const total = cart?.total ?? 0;

  const onSubmit = async (data: CheckoutFormData) => {
    setOrderError(null);
    setIsSubmitting(true);

    try {
      const order = await placeOrder({ shippingAddress: data.shippingAddress });
      await refreshCart();

      navigate('/orders/confirmation', {
        state: {
          confirmationNumber: order.confirmationNumber,
          total: order.total,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      setOrderError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Checkout</h1>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2>Shipping Information</h2>
          {orderError && <p className={styles.error}>{orderError}</p>}
          <div className={styles.field}>
            <label htmlFor="shippingAddress">Shipping Address</label>
            <textarea
              id="shippingAddress"
              {...register('shippingAddress', {
                required: 'Shipping address is required',
                minLength: {
                  value: 10,
                  message: 'Please provide a complete shipping address',
                },
              })}
              aria-describedby={errors.shippingAddress ? 'shippingAddress-error' : undefined}
            />
            {errors.shippingAddress && (
              <span id="shippingAddress-error" className={styles.error}>
                {errors.shippingAddress.message}
              </span>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Placing order...' : 'Complete Order'}
          </button>
        </form>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.items}>
            {cart.items.map((item) => (
              <div key={item.productId} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}