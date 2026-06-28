import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import { UserContext } from "./UserContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const itemCount = cart.reduce((sum, product) => sum + product.quantity, 0);

  const [darkMode, setDarkMode] = useState(() => {
    // Default to dark mode since it was explicitly requested
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="navbar">
      <h1>Stationery Nook</h1>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/products" className="navbar-link">Products</Link>
        <Link to="/upload" className="navbar-link">Upload</Link>
        <Link to="/cart" className="navbar-link">Cart{itemCount > 0 ? ` (${itemCount})` : ""}</Link>
        <Link to="/checkout" className="navbar-link">Checkout</Link>
        {user && (
          <Link to="/orders" className="navbar-link">Orders</Link>
        )}
        {user?.role === "owner" && (
          <Link to="/customers" className="navbar-link">Customers</Link>
        )}
        
        {/* Dark/Light Mode Switcher */}
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "white",
            width: "2.3rem",
            height: "2.3rem",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifycontent: "center",
            fontSize: "1.1rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            margin: "0 0.5rem"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.18)";
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {user ? (
          <>
            <span className="navbar-link navbar-user">Hello, {user.name}</span>
            <button type="button" className="navbar-link navbar-logout" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
