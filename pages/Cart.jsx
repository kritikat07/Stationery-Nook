import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../components/CartContext";

function Cart() {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  const handlePrint = () => {
    window.print();
  };

  if (cart.length === 0) {
    return (
      <div className="page-container">
        <h2 className="hero-title">Cart</h2>
        <p className="empty-state">Your cart is empty. Add stationery items so you can checkout faster.</p>
        <Link to="/products" className="button">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="hero-title">Cart</h2>
      <div className="product-grid">
        {cart.map((product) => (
          <div key={product.id} className="cart-item">
            <div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description || `Price: ₹${product.price}`}</p>
              {product.fileCount && (
                <p className="product-description" style={{ fontSize: "0.9rem", color: "#64748b" }}>
                  Files: {product.fileCount}
                </p>
              )}
            </div>
            <div className="quantity-controls">
              <button
                onClick={() => updateQuantity(product.id, product.quantity - 1)}
                className="qty-button"
                disabled={product.quantity <= 1}
              >
                -
              </button>
              <span>{product.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, product.quantity + 1)}
                className="qty-button"
              >
                +
              </button>
              <button onClick={() => removeFromCart(product.id)} className="remove-button">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div>
          <p className="product-name">Total: ₹{total}</p>
          <p className="product-description">Your order will be ready fast so you can skip the line.</p>
        </div>
        <div className="quantity-controls">
          <Link to="/checkout" className="checkout-button">
            Proceed to Payment
          </Link>
          <button onClick={handlePrint} className="secondary-button">
            Print Cart
          </button>
          <button onClick={clearCart} className="secondary-button">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;