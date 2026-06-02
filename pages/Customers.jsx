import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";

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

    async function load() {
      setError("");
      try {
        const res = await fetch("http://localhost:8080/api/customers");
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data || []);
      } catch (err) {
        setError(err.message || "Error fetching customers");
      } finally {
        setLoading(false);
      }
    }
    load();
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
