import { useContext, useEffect, useState } from "react";
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

  if (loading) {
    return (
      <div className="page-container">
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2 className="empty-state">Error</h2>
        <p className="empty-state">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="hero-title">
        {user?.role === "owner" ? "All Customer Orders" : "My Order History"}
      </h2>
      <p className="product-description">
        {user?.role === "owner"
          ? "Manage and track orders submitted by students."
          : "Track the status of your stationery and print order requests."}
      </p>

      {orders.length === 0 ? (
        <p className="empty-state">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id-group">
                  <h3>Order ID: {order.id}</h3>
                  <span className="order-date">
                    Placed on: {new Date(order.createdAt || order.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="order-meta-group">
                  <div className="order-status-badge">{order.status || "Paid"}</div>
                  <div className="order-total">Total: ₹{order.total}</div>
                </div>
              </div>

              {user?.role === "owner" && order.customer && (
                <div className="order-customer-info">
                  <p><strong>Customer Name:</strong> {order.customer.name}</p>
                  <p><strong>Customer Email:</strong> {order.customer.email}</p>
                  <p><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase()} (Details: {order.paymentDetails})</p>
                </div>
              )}

              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items &&
                    order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product?.name || "Product"}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
