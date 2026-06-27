import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import API from "../utils/api";

export default function Customers() {
  const { user } = useContext(UserContext);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "owner") {
      setError("Only the owner can view registered customers.");
      setLoading(false);
      return;
    }

    API.get("/customers")
      .then((response) => {
        setCustomers(response.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <div className="page-container">Loading customers...</div>;
  if (error) return <div className="page-container">Error: {error}</div>;

  return (
    <div className="page-container">
      <h2>Registered Customers</h2>
      {customers.length === 0 ? (
        <div>No customers registered yet.</div>
      ) : (
        <ul className="customers-list">
          {customers.map((c) => (
            <li key={c.id} className="customer-item">
              <strong>{c.name}</strong> — {c.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
