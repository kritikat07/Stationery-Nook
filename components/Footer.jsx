import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand Section */}
        <div className="footer-section brand-sec">
          <h3 className="footer-brand">Stationery Nook</h3>
          <p className="footer-desc">
            Your premium campus hub for study supplies, textbooks, and custom high-speed document printing.
          </p>
          <div className="footer-socials">
            <span className="social-icon">🔵</span>
            <span className="social-icon">📸</span>
            <span className="social-icon">🐦</span>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link-item">Home</Link></li>
            <li><Link to="/products" className="footer-link-item">Products</Link></li>
            <li><Link to="/upload" className="footer-link-item">Print Upload</Link></li>
            <li><Link to="/cart" className="footer-link-item">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Location & Operating Hours */}
        <div className="footer-section">
          <h4 className="footer-heading">Store Info</h4>
          <ul className="footer-links font-medium">
            <li>📍 Block A, Campus Center</li>
            <li>🕒 Mon - Sat: 9 AM - 7 PM</li>
            <li>✉️ support@stationerynook.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Stationery Nook. Designed with ❤️ for students. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
