import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../components/UserContext";
import API from "../utils/api";

function Orders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setError("Please login to view orders.");
      setLoading(false);
      return;
    }

    const endpoint = user.role === "owner" ? "/orders" : "/orders/my";

    API.get(endpoint)
      .then((response) => {
        const sorted = (response.data || []).sort(
          (a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at)
        );
        setOrders(sorted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, [user]);

  const handlePrintReceipt = (order) => {
    const printWindow = window.open("", "PrintReceipt", "width=800,height=600");
    if (!printWindow) {
      alert("Print popup blocked. Please allow popups and try again.");
      return;
    }

    const itemsRows = (order.items || [])
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.name || "Product"}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Pickup Receipt - ${order.id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #333; line-height: 1.6; }
            .receipt-box { max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 25px; border-radius: 8px; }
            .receipt-header { text-align: center; border-bottom: 2px dashed #ddd; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #1e3a8a; }
            .meta-info { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #f8fafc; padding: 10px; text-align: left; font-size: 14px; border-bottom: 2px solid #ddd; }
            .total-row { font-size: 18px; font-weight: bold; text-align: right; margin-top: 15px; }
            .footer-note { text-align: center; font-size: 13px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="receipt-header">
              <div class="logo">STATIONERY NOOK</div>
              <p style="margin: 5px 0 0 0;">Queue-Free Campus Pickup</p>
            </div>
            <div class="meta-info">
              <div>
                <p style="margin: 3px 0;"><strong>Order ID:</strong> ${order.id}</p>
                <p style="margin: 3px 0;"><strong>Date:</strong> ${new Date(order.createdAt || order.created_at).toLocaleString()}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 3px 0;"><strong>Status:</strong> PAID</p>
                <p style="margin: 3px 0;"><strong>Gateway:</strong> ${order.paymentMethod?.toUpperCase()}</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
            <div class="total-row">Total Paid: ₹${order.total}</div>
            <div class="footer-note">
              <p>Show this receipt at the stationery counter to pick up your items.</p>
              <p>Thank you for choosing Stationery Nook!</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const getEmoji = (productId = "") => {
    if (productId.includes("notebook")) return "📓";
    if (productId.includes("pen")) return "🖊️";
    if (productId.includes("highlighter")) return "🖍️";
    if (productId.includes("sticky")) return "🗒️";
    return "📄";
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="spinner" style={{ border: "4px solid rgba(255,255,255,0.1)", borderTop: "4px solid #3b82f6", borderRadius: "50%", width: "50px", height: "50px", margin: "auto", animation: "spin 1s linear infinite" }}></div>
          <h2 style={{ marginTop: "1.5rem" }}>Loading Orders...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="auth-card" style={{ maxWidth: "500px", margin: "3rem auto", textAlign: "center" }}>
          <span style={{ fontSize: "3rem", display: "block" }}>⚠️</span>
          <h2 className="empty-state" style={{ color: "#ef4444", marginTop: "1rem" }}>Error Accessing Orders</h2>
          <p className="product-description">{error}</p>
          <Link to="/login" className="button" style={{ display: "inline-block", marginTop: "1.5rem" }}>
            Log In Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="hero-title" style={{ fontSize: "2.2rem" }}>
        {user?.role === "owner" ? "All Customer Orders" : "My Order History"}
      </h2>
      <p className="product-description" style={{ marginBottom: "2.5rem" }}>
        {user?.role === "owner"
          ? "Manage, print, and track all stationery items and print jobs requested by students."
          : "Show the generated pickup receipt at the counter to retrieve your supplies instantly."}
      </p>

      {orders.length === 0 ? (
        <div className="auth-card" style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
          <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>📦</span>
          <p className="empty-state" style={{ marginBottom: "1.5rem" }}>No orders placed yet.</p>
          <Link to="/products" className="button" style={{ display: "inline-block" }}>
            Order Stationery Now
          </Link>
        </div>
      ) : (
        <div className="orders-list" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {orders.map((order) => (
            <div key={order.id} className="order-card" style={{ padding: "2rem" }}>
              {/* Order Info Bar */}
              <div className="order-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1.25rem", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.25rem" }}>🆔</span>
                    <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Order ID: <span style={{ color: "#3b82f6", fontWeight: "700" }}>{order.id}</span></h3>
                  </div>
                  <span className="order-date" style={{ display: "block", marginTop: "0.35rem", fontSize: "0.85rem" }}>
                    📅 Placed on: {new Date(order.createdAt || order.created_at).toLocaleString()}
                  </span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div className="order-status-badge">
                    {order.status || "Paid"}
                  </div>
                  <div className="order-total" style={{ fontSize: "1.25rem", fontWeight: "800", color: "#3b82f6" }}>
                    Total Paid: ₹{order.total}
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePrintReceipt(order)}
                    className="secondary-button"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                  >
                    🖨️ Receipt
                  </button>
                </div>
              </div>

              {/* Customer Box for Admins */}
              {user?.role === "owner" && order.customer && (
                <div className="order-customer-info" style={{ background: "rgba(15, 23, 42, 0.3)", borderLeft: "4px solid #3b82f6", padding: "1.25rem", borderRadius: "0.5rem", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                  <p style={{ margin: "0.25rem 0" }}>👤 <strong>Customer:</strong> {order.customer.name}</p>
                  <p style={{ margin: "0.25rem 0" }}>✉️ <strong>Email:</strong> {order.customer.email}</p>
                  <p style={{ margin: "0.25rem 0" }}>💳 <strong>Method:</strong> {order.paymentMethod?.toUpperCase()} (Details: {order.paymentDetails})</p>
                </div>
              )}

              {/* Items Breakdown Table */}
              <div style={{ overflowX: "auto" }}>
                <table className="order-items-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Item Description</th>
                      <th style={{ textAlign: "center", padding: "0.75rem 1rem", width: "80px" }}>Qty</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", width: "120px" }}>Unit Price</th>
                      <th style={{ textAlign: "right", padding: "0.75rem 1rem", width: "120px" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items &&
                      order.items.map((item) => (
                        <tr key={item.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                          <td style={{ padding: "1rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <span style={{ fontSize: "1.3rem" }}>{getEmoji(item.product?.id)}</span>
                              <span>{item.product?.name || "Stationery Supply"}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "center", padding: "1rem" }}>{item.quantity}</td>
                          <td style={{ textAlign: "right", padding: "1rem" }}>₹{item.price}</td>
                          <td style={{ textAlign: "right", padding: "1rem", fontWeight: "700" }}>₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
