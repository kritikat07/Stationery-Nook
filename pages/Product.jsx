import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/CartContext";
import productsData from "../server/data.json";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function Products() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts(productsData.products);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <h2 className="hero-title">Products</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2 className="hero-title">Products</h2>
        <p className="empty-state">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-actions">
        <button onClick={handlePrint} className="secondary-button">
          Print Catalog
        </button>
      </div>
      <h2 className="hero-title">Products</h2>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-badge">Stationery</div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹{product.price}</p>
            <button onClick={() => addToCart(product)} className="product-button">
              Add To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
