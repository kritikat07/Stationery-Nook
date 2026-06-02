import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import { UserContext } from "./UserContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const itemCount = cart.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <nav className="navbar">
      <h1>Stationery Nook</h1>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/products" className="navbar-link">Products</Link>
        <Link to="/upload" className="navbar-link">Upload</Link>
        <Link to="/cart" className="navbar-link">Cart{itemCount > 0 ? ` (${itemCount})` : ""}</Link>
        <Link to="/checkout" className="navbar-link">Checkout</Link>
        {user?.role === "owner" && (
          <Link to="/customers" className="navbar-link">Customers</Link>
        )}
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
