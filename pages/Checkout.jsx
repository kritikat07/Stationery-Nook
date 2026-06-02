import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import { createOrder } from "../utils/localDb";

function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [payment, setPayment] = useState({ cardNumber: "", expiry: "", cvv: "", upiId: "" });
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0 && !status) {
    return (
      <div className="page-container">
        <h2 className="hero-title">Checkout</h2>
        <p className="empty-state">Your cart is empty. Add stationery items before payment.</p>
        <Link to="/products" className="button">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = createOrder({
        cart,
        customer,
        payment: { method: paymentMethod, ...payment },
        documents: documents.map((file) => file.webkitRelativePath || file.name),
      });

      clearCart();
      setStatus(result);
    } catch (err) {
      setError(err.message);
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

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setDocuments(files);
  };

  if (status) {
    return (
      <div className="order-confirmation page-container">
        <h2 className="hero-title">Order Confirmed</h2>
        <p className="product-description">{status.message}</p>
        <p className="product-name">Order ID: {status.orderId}</p>
        <p className="product-description">Amount paid: ₹{status.amount}</p>
        <button onClick={() => window.print()} className="secondary-button">
          Print Receipt
        </button>
        <Link to="/products" className="button">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="hero-title">Checkout</h2>
      <p className="product-description">Pay before placing your order so your stationery is ready faster.</p>

      <div className="product-grid">
        <div className="product-card">
          <h3 className="product-name">Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <p className="product-name">{item.name}</p>
                <p className="product-description">Qty: {item.quantity}</p>
              </div>
              <p className="product-price">₹{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="cart-summary">
            <p className="product-name">Total: ₹{total}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="product-card">
          <h3 className="product-name">Payment Details</h3>
          <label>
            Name
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

          <label>
            Upload documents or folders for print service
            <input
              type="file"
              multiple
              webkitdirectory="true"
              directory="true"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
              onChange={handleDocumentUpload}
              className="form-input"
            />
            <span className="upload-note">Select files or folders. Folder upload works in Chrome and supported browsers.</span>
          </label>

          {documents.length > 0 && (
            <div className="upload-summary">
              <p className="product-name">Selected files ({documents.length})</p>
              <ul>
                {documents.slice(0, 10).map((file, index) => (
                  <li key={index}>{file.webkitRelativePath || file.name}</li>
                ))}
                {documents.length > 10 && <li>...and {documents.length - 10} more</li>}
              </ul>
            </div>
          )}

          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Pay by Card
            </label>
            <label>
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              Pay by UPI
            </label>
          </div>

          {paymentMethod === "card" ? (
            <>
              <label>
                Card Number
                <input
                  type="text"
                  pattern="[0-9]{12,19}"
                  value={payment.cardNumber}
                  onChange={(e) => updatePayment("cardNumber", e.target.value)}
                  className="form-input"
                  required
                />
              </label>
              <label>
                Expiry (MM/YY)
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={payment.expiry}
                  onChange={(e) => updatePayment("expiry", e.target.value)}
                  className="form-input"
                  required
                />
              </label>
              <label>
                CVV
                <input
                  type="text"
                  pattern="[0-9]{3,4}"
                  value={payment.cvv}
                  onChange={(e) => updatePayment("cvv", e.target.value)}
                  className="form-input"
                  required
                />
              </label>
            </>
          ) : (
            <label>
              UPI ID
              <input
                type="text"
                placeholder="example@bank"
                value={payment.upiId}
                onChange={(e) => updatePayment("upiId", e.target.value)}
                className="form-input"
                required
              />
            </label>
          )}

          {error && <p className="empty-state">{error}</p>}

          <button type="submit" className="checkout-button" disabled={submitting}>
            {submitting ? "Processing Payment..." : "Pay ₹" + total}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
