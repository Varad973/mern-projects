import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Our Products</h1>
        <span className="record-count">{products.length} products</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-message">
          <h2>No products available</h2>
          <p>Add products or run the seed script to populate sample data.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
