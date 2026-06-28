import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { UserContext } from "../components/UserContext";
import API from "../utils/api";

function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payment, setPayment] = useState({ cardNumber: "", expiry: "", cvv: "", upiId: "" });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomer({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  if (cart.length === 0 && !status) {
    return (
      <div className="page-container">
        <h2 className="hero-title">Checkout</h2>
        <div className="auth-card" style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
          <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>🛒</span>
          <p className="empty-state" style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>Your cart is empty. Add stationery items before payment.</p>
          <Link to="/products" className="button" style={{ display: "inline-block" }}>
            Browse Supplies
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await API.post("/checkout", {
        cart: cart.map((item) => ({ 
          id: item.id, 
          quantity: item.quantity, 
          price: item.price, 
          name: item.name 
        })),
        payment: { method: paymentMethod, ...payment },
      });

      clearCart();
      setStatus(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const updatePayment = (field, value) => {
    setPayment((current) => ({ ...current, [field]: value }));
  };

  const getEmoji = (productId = "") => {
    if (productId.includes("notebook")) return "📓";
    if (productId.includes("pen")) return "🖊️";
    if (productId.includes("highlighter")) return "🖍️";
    if (productId.includes("sticky")) return "🗒️";
    return "📄";
  };

  if (status) {
    return (
      <div className="page-container">
        <div className="auth-card" style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center", padding: "3rem 2rem" }}>
          <div className="success-badge-wrapper" style={{ fontSize: "5rem", color: "#10b981", animation: "popCheck 0.5s ease" }}>
            ✓
          </div>
          <h2 className="hero-title" style={{ marginTop: "1rem", fontSize: "2rem" }}>Payment Confirmed!</h2>
          <p className="product-description" style={{ fontSize: "1.05rem", margin: "1rem 0" }}>{status.message}</p>
          
          <div className="order-customer-info" style={{ textAlign: "left", margin: "2rem 0" }}>
            <p><strong>Order ID:</strong> <span style={{ color: "#3b82f6", fontWeight: "700" }}>{status.orderId}</span></p>
            <p><strong>Total Paid:</strong> ₹{status.amount}</p>
            <p><strong>Status:</strong> <span className="status-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700" }}>Ready for Pickup</span></p>
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button onClick={() => window.print()} className="secondary-button">
              Print Receipt
            </button>
            <Link to="/products" className="button">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="hero-title">Checkout Securely</h2>
      <p className="product-description" style={{ marginBottom: "2rem" }}>Review your student cart items and select your cashless payment gateway simulator.</p>

      <div className="product-grid" style={{ gap: "2rem", gridTemplateColumns: "1.1fr 1.3fr" }}>
        {/* Left Side: Summary */}
        <div className="product-card" style={{ display: "flex", flexDirection: "column" }}>
          <h3 className="product-name" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.85rem", marginBottom: "1rem" }}>
            Order Summary
          </h3>
          
          <div style={{ flex: 1 }}>
            {cart.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>{getEmoji(item.id)}</span>
                  <div>
                    <p className="product-name" style={{ fontSize: "1rem", margin: 0 }}>{item.name}</p>
                    <p className="product-description" style={{ fontSize: "0.82rem", margin: 0 }}>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="product-price" style={{ fontWeight: "700" }}>₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="cart-total-section">
            <span>Total Payable</span>
            <span style={{ fontSize: "1.5rem", color: "#3b82f6" }}>₹{total}</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <form onSubmit={handleSubmit} className="product-card">
          <h3 className="product-name" style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "0.85rem", marginBottom: "1rem" }}>
            Payment Details
          </h3>

          <div className="form-row" style={{ marginBottom: "1rem" }}>
            <label>
              Your Name
              <input
                type="text"
                value={customer.name}
                onChange={(e) => updateCustomer("name", e.target.value)}
                className="form-input"
                required
              />
            </label>
            <label>
              Email Address
              <input
                type="email"
                value={customer.email}
                onChange={(e) => updateCustomer("email", e.target.value)}
                className="form-input"
                required
              />
            </label>
          </div>

          {/* Payment Method Selector Tab bar */}
          <div className="payment-method-selector">
            <button
              type="button"
              className={`method-tab ${paymentMethod === "card" ? "active" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              💳 Credit / Debit Card
            </button>
            <button
              type="button"
              className={`method-tab ${paymentMethod === "upi" ? "active" : ""}`}
              onClick={() => setPaymentMethod("upi")}
            >
              📱 UPI Handle
            </button>
          </div>

          {paymentMethod === "card" ? (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <label style={{ display: "block", marginBottom: "1rem" }}>
                Card Number
                <input
                  type="text"
                  placeholder="1111 2222 3333 4444"
                  value={payment.cardNumber}
                  onChange={(e) => updatePayment("cardNumber", e.target.value)}
                  className="form-input"
                  maxLength="19"
                  required
                />
                <span className="checkout-helper-text">Enter any 12 to 19 digit dummy card number</span>
              </label>
              
              <div className="form-row" style={{ marginBottom: "1.5rem" }}>
                <label>
                  Expiry Date
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={payment.expiry}
                    onChange={(e) => updatePayment("expiry", e.target.value)}
                    className="form-input"
                    maxLength="5"
                    required
                  />
                  <span className="checkout-helper-text">Format: MM/YY (e.g. 12/28)</span>
                </label>
                <label>
                  CVV Code
                  <input
                    type="password"
                    placeholder="123"
                    value={payment.cvv}
                    onChange={(e) => updatePayment("cvv", e.target.value)}
                    className="form-input"
                    maxLength="4"
                    required
                  />
                  <span className="checkout-helper-text">3 or 4 digits dummy code</span>
                </label>
              </div>
            </div>
          ) : (
            <div style={{ animation: "fadeIn 0.3s ease", marginBottom: "1.5rem" }}>
              <label style={{ display: "block" }}>
                UPI ID handle
                <input
                  type="text"
                  placeholder="student@okaxis"
                  value={payment.upiId}
                  onChange={(e) => updatePayment("upiId", e.target.value)}
                  className="form-input"
                  required
                />
                <span className="checkout-helper-text">Enter mock ID containing @ symbol (e.g. student@ybl)</span>
              </label>
            </div>
          )}

          {error && (
            <p className="empty-state" style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", padding: "0.75rem 1rem", borderRadius: "0.75rem", fontSize: "0.9rem", margin: "1rem 0" }}>
              ⚠️ {error}
            </p>
          )}

          <button type="submit" className="checkout-button" disabled={submitting} style={{ width: "100%", marginTop: "1rem" }}>
            {submitting ? "Validating simulated transaction..." : "Pay ₹" + total}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
