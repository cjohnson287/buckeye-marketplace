import { useEffect, useMemo, useState } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { fetchAllOrders, updateOrderStatus } from "../api/orders";
import type { Product } from "../types/product";
import type { Order } from "../types/order";
import styles from "./AdminDashboardPage.module.css";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    id: 0,
    title: "",
    description: "",
    price: "",
    categoryId: "1",
    sellerName: "",
    imageUrl: "",
  });

  const isEditing = useMemo(() => form.id > 0, [form.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productData, orderData] = await Promise.all([fetchProducts(), fetchAllOrders()]);
      setProducts(productData);
      setOrders(orderData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const resetForm = () => {
    setForm({
      id: 0,
      title: "",
      description: "",
      price: "",
      categoryId: "1",
      sellerName: "",
      imageUrl: "",
    });
  };

  const handleProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        sellerName: form.sellerName,
        imageUrl: form.imageUrl || null,
      };

      if (isEditing) {
        await updateProduct(form.id, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const handleEditProduct = (product: Product) => {
    const categoryMap: Record<string, string> = {
      Vinyl: "1",
      Clothing: "2",
      CD: "3",
      "Video Game": "4",
    };

    setForm({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      categoryId: categoryMap[product.category] ?? "1",
      sellerName: product.sellerName,
      imageUrl: product.imageUrl ?? "",
    });
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(productId);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleOrderStatusUpdate = async (orderId: number, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update order status");
    }
  };

  if (loading) {
    return <p className={styles.status}>Loading admin dashboard...</p>;
  }

  return (
    <section className={styles.page}>
      <h1>Admin Dashboard</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
          <form onSubmit={handleProductSubmit} className={styles.form}>
            <input aria-label="Product title" placeholder="Title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
            <textarea aria-label="Product description" placeholder="Description" value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
            <input aria-label="Product price" placeholder="Price" type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))} />
            <select aria-label="Category" value={form.categoryId} onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}>
              <option value="1">Vinyl</option>
              <option value="2">Clothing</option>
              <option value="3">CD</option>
              <option value="4">Video Game</option>
            </select>
            <input aria-label="Seller name" placeholder="Seller Name" value={form.sellerName} onChange={(event) => setForm((prev) => ({ ...prev, sellerName: event.target.value }))} />
            <input aria-label="Image URL" placeholder="Image URL" value={form.imageUrl} onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))} />
            <div className={styles.formActions}>
              <button type="submit" aria-label={isEditing ? "Update product" : "Create product"}>{isEditing ? "Update" : "Create"}</button>
              {isEditing && (
                <button type="button" aria-label="Cancel edit product" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>

          <h3>Products</h3>
          <ul className={styles.list}>
            {products.map((product) => (
              <li key={product.id}>
                <span>{product.title} (${product.price.toFixed(2)})</span>
                <div className={styles.rowActions}>
                  <button aria-label={`Edit ${product.title}`} onClick={() => handleEditProduct(product)}>Edit</button>
                  <button aria-label={`Delete ${product.title}`} onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.panel}>
          <h2>All Orders</h2>
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order.id}>
                <div>
                  <strong>{order.confirmationNumber}</strong> — ${order.total.toFixed(2)}
                </div>
                <div className={styles.orderControls}>
                  <select
                    aria-label={`Update status for ${order.confirmationNumber}`}
                    value={order.status}
                    onChange={(event) => void handleOrderStatusUpdate(order.id, event.target.value)}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
