import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { fetchProduct, NotFoundError } from "../api/products";
import type { Product } from "../types/product";
import styles from "./ProductDetailPage.module.css";

type FetchState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error"; message: string }
  | { status: "success"; data: Product };

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    fetchProduct(Number(id))
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof NotFoundError) {
          setState({ status: "not-found" });
        } else {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return <p className={styles.status}>Loading product…</p>;
  }

  if (state.status === "not-found") {
    return (
      <div className={styles.notFound}>
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/" className={styles.backLink}>
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return <p className={styles.error}>Error: {state.message}</p>;
  }

  const product = state.data;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    setAddToCartError(null);
    try {
      await addToCart(product.id, quantity);
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add to cart";
      setAddToCartError(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setQuantity(value);
  };

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.backLink}>
        ← Back to Catalog
      </Link>

      <div className={styles.detail}>
        <div className={styles.imageWrapper}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>
              <span>📦</span>
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.title}</h1>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}
          <p className={styles.seller}>Seller: {product.sellerName}</p>
          <p className={styles.date}>
            Listed on{" "}
            {new Date(product.postedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className={styles.purchaseSection}>
            <div className={styles.quantityControl}>
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className={styles.quantityInput}
              />
            </div>

            <button
              className={styles.addButton}
              onClick={handleAddToCart}
              aria-label={`Add ${product.title} to cart`}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Adding to cart..." : "Add to Cart"}
            </button>

            {addToCartError && (
              <p className={styles.error}>{addToCartError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
