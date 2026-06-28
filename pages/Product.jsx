import { useContext, useEffect, useState } from "react";
import { CartContext } from "../components/CartContext";
import API from "../utils/api";

function Products() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    API.get("/products")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError("Failed to load products: Invalid response format from server.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load products: ${err.response?.data?.error || err.message}`);
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
        {Array.isArray(products) && products.map((product) => (
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
