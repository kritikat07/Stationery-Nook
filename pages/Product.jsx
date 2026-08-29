import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../components/CartContext";
import API from "../utils/api";

function Products() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addedItems, setAddedItems] = useState({});
  const [toast, setToast] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    
    // Temporarily change button to "Added!" state
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    
    // Display floating toast alert
    setToast(`${product.name} added to cart!`);
    
    // Clear button state after 1.5 seconds
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);

    // Clear toast message after 2.5 seconds
    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  useEffect(() => {
    API.get("/products")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError("Failed to load products: Invalid response format from server.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(`Failed to load products: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      });
  }, []);

  const getProductIcon = (id) => {
    // Custom print jobs or dynamically generated print orders
    if (id && id.startsWith("print-order-")) {
      return (
        <svg viewBox="0 0 100 100" width="80" height="80">
          <defs>
            <linearGradient id="printGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <rect x="25" y="15" width="50" height="70" rx="4" fill="url(#printGrad)" />
          <line x1="35" y1="30" x2="65" y2="30" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <line x1="35" y1="40" x2="65" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <line x1="35" y1="50" x2="55" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <rect x="45" y="60" width="20" height="15" rx="1" fill="#ffffff" opacity="0.8" />
          <path d="M48 65 h14 M48 70 h10" stroke="#111827" strokeWidth="1.5" />
        </svg>
      );
    }

    switch (id) {
      case "notebook":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="notebookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <rect x="25" y="15" width="55" height="70" rx="4" fill="url(#notebookGrad)" />
            {[25, 35, 45, 55, 65, 75].map((y) => (
              <g key={y}>
                <circle cx="25" cy={y} r="2.5" fill="#ffffff" opacity="0.8" />
                <path d={`M20 ${y} h6`} stroke="#d1d5db" strokeWidth="2" />
              </g>
            ))}
            <rect x="38" y="30" width="30" height="15" rx="2" fill="white" opacity="0.25" />
            <line x1="43" y1="35" x2="63" y2="35" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <line x1="43" y1="40" x2="58" y2="40" stroke="white" strokeWidth="1.5" opacity="0.7" />
          </svg>
        );
      case "pen-set":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="penGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
            <rect x="42" y="15" width="16" height="65" rx="8" fill="#1e293b" opacity="0.2" />
            <rect x="35" y="28" width="6" height="52" rx="1" fill="url(#penGrad)" />
            <path d="M35 28 L38 12 L41 28 Z" fill="#3b82f6" />
            <line x1="38" y1="12" x2="38" y2="8" stroke="#1d4ed8" strokeWidth="1.5" />
            <rect x="52" y="22" width="6" height="52" rx="1" fill="#ec4899" />
            <path d="M52 22 L55 6 L58 22 Z" fill="#ec4899" />
            <line x1="55" y1="6" x2="55" y2="2" stroke="#be185d" strokeWidth="1.5" />
          </svg>
        );
      case "marker":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="markerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <rect x="35" y="30" width="30" height="50" rx="6" fill="url(#markerGrad)" />
            <rect x="40" y="18" width="20" height="12" rx="1" fill="#1e293b" />
            <path d="M42 18 L44 10 L56 10 L58 18 Z" fill="#f59e0b" opacity="0.9" />
            <rect x="42" y="42" width="16" height="15" rx="2" fill="#ffffff" opacity="0.3" />
            <line x1="47" y1="49" x2="53" y2="49" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "folder":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="folderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <path d="M20 25 C20 22 22 20 25 20 H45 L52 28 H75 C78 28 80 30 80 33 V75 C80 78 78 80 75 80 H25 C22 80 20 78 20 75 Z" fill="url(#folderGrad)" />
            <path d="M25 35 H75 V72 C75 75 73 77 70 77 H30 C27 77 25 75 25 72 Z" fill="#ffffff" opacity="0.15" />
            <rect x="35" y="48" width="30" height="4" rx="2" fill="#ffffff" opacity="0.7" />
            <rect x="35" y="58" width="20" height="4" rx="2" fill="#ffffff" opacity="0.7" />
          </svg>
        );
      case "pencil-case":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="caseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>
            <rect x="15" y="32" width="70" height="36" rx="10" fill="url(#caseGrad)" />
            <rect x="25" y="32" width="50" height="2" fill="#ffffff" opacity="0.3" />
            <circle cx="72" cy="33" r="3" fill="#e9d5ff" />
            <path d="M72 33 L78 30" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round" />
            <rect x="30" y="44" width="40" height="12" rx="3" fill="#ffffff" opacity="0.2" />
            <line x1="35" y1="50" x2="65" y2="50" stroke="#f3e8ff" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        );
      case "sticky-notes":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="stickyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            <path d="M25 22 H75 V65 C75 65 65 65 60 70 C55 75 55 78 55 78 H25 C22 78 20 76 20 73 V27 C20 24 22 22 25 22 Z" fill="#ca8a04" opacity="0.5" />
            <path d="M28 18 H78 V61 C78 61 68 61 63 66 C58 71 58 74 58 74 H28 C25 74 23 72 23 69 V23 C23 20 25 18 28 18 Z" fill="url(#stickyGrad)" />
            <path d="M78 61 L63 66 C65 63 67 61 78 61 Z" fill="#ca8a04" />
            <line x1="35" y1="32" x2="65" y2="32" stroke="#854d0e" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            <line x1="35" y1="42" x2="65" y2="42" stroke="#854d0e" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
            <line x1="35" y1="52" x2="55" y2="52" stroke="#854d0e" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
          </svg>
        );
      case "desk-organizer":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <rect x="20" y="45" width="60" height="35" rx="6" fill="#475569" />
            <rect x="25" y="25" width="12" height="20" rx="2" fill="#1e293b" />
            <path d="M28 25 L25 10 L34 10 L31 25 Z" fill="#ec4899" />
            <rect x="42" y="20" width="10" height="25" rx="2" fill="#334155" />
            <rect x="58" y="15" width="14" height="30" rx="2" fill="#0f172a" />
            <line x1="62" y1="15" x2="62" y2="5" stroke="#f59e0b" strokeWidth="3" />
            <line x1="68" y1="15" x2="68" y2="8" stroke="#10b981" strokeWidth="2" />
            <rect x="30" y="55" width="40" height="15" rx="2" fill="#1e293b" opacity="0.4" />
          </svg>
        );
      case "journal":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="journalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            <rect x="25" y="15" width="50" height="70" rx="6" fill="url(#journalGrad)" />
            <rect x="22" y="15" width="6" height="70" rx="1" fill="#065f46" />
            <path d="M48 45 C48 35 55 35 55 35 C55 35 55 45 48 45 Z" fill="#34d399" opacity="0.6" />
            <path d="M52 55 C52 48 46 48 46 48 C46 48 46 55 52 55 Z" fill="#34d399" opacity="0.6" />
            <rect x="71" y="38" width="4" height="24" rx="2" fill="#fbbf24" />
            <path d="M50 15 L50 85" stroke="#047857" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
        );
      case "pencil-pack":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <g transform="translate(10, 0)">
              {[20, 32, 44, 56].map((x) => (
                <g key={x}>
                  <rect x={x} y="25" width="8" height="55" rx="1" fill="#fb923c" />
                  <path d={`M${x} 25 L${x+4} 12 L${x+8} 25 Z`} fill="#fde047" />
                  <path d={`M${x+3} 12 L${x+4} 8 L${x+5} 12 Z`} fill="#1e293b" />
                  <rect x={x+2} y="70" width="4" height="10" fill="#f472b6" />
                </g>
              ))}
            </g>
          </svg>
        );
      case "ruler-set":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="rulerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>
            </defs>
            <rect x="20" y="30" width="60" height="16" rx="2" fill="url(#rulerGrad)" transform="rotate(15 50 50)" />
            {[26, 32, 38, 44, 50, 56, 62, 68, 74].map((x, i) => (
              <line key={x} x1={x} y1="36" x2={x} y2={i % 2 === 0 ? "42" : "39"} stroke="#ffffff" strokeWidth="1" transform="rotate(15 50 50)" />
            ))}
            <path d="M30 65 A 25 25 0 0 1 70 65 Z" fill="#0891b2" opacity="0.7" />
            <path d="M40 65 A 12 12 0 0 1 60 65 Z" fill="#0f172a" />
          </svg>
        );
      case "glue-stick":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <rect x="36" y="32" width="28" height="50" rx="3" fill="#ef4444" />
            <rect x="36" y="20" width="28" height="12" rx="1" fill="#ffffff" />
            <rect x="42" y="12" width="16" height="8" rx="1" fill="#ef4444" />
            <rect x="42" y="44" width="16" height="24" rx="2" fill="#ffffff" opacity="0.3" />
            <line x1="50" y1="20" x2="50" y2="82" stroke="#dc2626" strokeWidth="1.5" />
          </svg>
        );
      case "tab-notes":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            {[[20, "#ef4444"], [32, "#f59e0b"], [44, "#10b981"], [56, "#3b82f6"], [68, "#8b5cf6"]].map(([y, color]) => (
              <g key={y}>
                <rect x="25" y={y} width="50" height="10" rx="2" fill="#1e293b" opacity="0.2" />
                <rect x="25" y={y} width="45" height="10" rx="2" fill={color} />
                <rect x="60" y={y} width="10" height="10" rx="2" fill="#ffffff" opacity="0.4" />
              </g>
            ))}
          </svg>
        );
      case "desk-lamp":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="lampGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
            <path d="M50 40 L25 80 H75 Z" fill="#fef08a" opacity="0.3" />
            <rect x="35" y="78" width="30" height="6" rx="3" fill="#475569" />
            <path d="M50 78 V50 C50 45 42 45 42 40" stroke="#64748b" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M35 42 C35 32 49 32 49 42 Z" fill="#334155" transform="rotate(-15 42 40)" />
            <circle cx="42" cy="43" r="4" fill="#facc15" />
          </svg>
        );
      case "calculator":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>
            </defs>
            <rect x="28" y="15" width="44" height="70" rx="6" fill="url(#calcGrad)" />
            <rect x="34" y="22" width="32" height="14" rx="2" fill="#d1fae5" />
            <line x1="38" y1="29" x2="52" y2="29" stroke="#065f46" strokeWidth="3" strokeLinecap="round" />
            {[[43, "#ef4444"], [52, "#9ca3af"], [61, "#9ca3af"], [70, "#3b82f6"]].map(([y, color]) => (
              <g key={y}>
                <rect x="35" y={y} width="7" height="5" rx="1" fill={color} />
                <rect x="46" y={y} width="7" height="5" rx="1" fill="#9ca3af" />
                <rect x="58" y={y} width="7" height="5" rx="1" fill="#9ca3af" />
              </g>
            ))}
          </svg>
        );
      case "backpack":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="packGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#be185d" />
              </linearGradient>
            </defs>
            <path d="M30 35 C30 22 70 22 70 35 V75 C70 78 68 80 65 80 H35 C32 80 30 78 30 75 Z" fill="url(#packGrad)" />
            <path d="M36 54 H64 V74 C64 77 62 78 59 78 H41 C38 78 36 77 36 74 Z" fill="#9d174d" />
            <path d="M42 24 C42 18 58 18 58 24" stroke="#fbcfe8" strokeWidth="3" fill="none" />
            <path d="M30 42 H70" stroke="#fbcfe8" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M36 58 H64" stroke="#fbcfe8" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        );
      case "scissors":
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <path d="M50 50 L35 20 L40 18 L50 45 Z" fill="#cbd5e1" />
            <path d="M50 50 L65 20 L60 18 L50 45 Z" fill="#94a3b8" />
            <circle cx="50" cy="46" r="3" fill="#475569" />
            <circle cx="42" cy="65" r="12" fill="none" stroke="#2563eb" strokeWidth="5" />
            <path d="M46 52 L42 56" stroke="#2563eb" strokeWidth="5" />
            <circle cx="58" cy="65" r="12" fill="none" stroke="#2563eb" strokeWidth="5" />
            <path d="M54 52 L58 56" stroke="#2563eb" strokeWidth="5" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" width="80" height="80">
            <defs>
              <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#374151" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="35" fill="url(#defaultGrad)" />
            <path d="M38 50 L46 58 L62 42" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2 className="hero-title">Products</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2 className="hero-title">Products</h2>
        <p className="empty-state">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-actions">
        <button onClick={handlePrint} className="secondary-button">
          Print Catalog
        </button>
      </div>
      <h2 className="hero-title">Products</h2>

      <div className="product-grid">
        {Array.isArray(products) && products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              {getProductIcon(product.id)}
            </div>
            <div className="product-badge">Stationery</div>
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <p className="product-price">₹{product.price}</p>
            <button 
              onClick={() => handleAddToCart(product)} 
              className={`product-button ${addedItems[product.id] ? 'added' : ''}`}
              disabled={addedItems[product.id]}
            >
              {addedItems[product.id] ? "✓ Added!" : "Add To Cart"}
            </button>
          </div>
        ))}
      </div>

      {toast && (
        <div className="cart-toast-notification">
          <span>🛒 {toast}</span>
          <Link to="/cart" className="toast-cart-link">
            View Cart ➔
          </Link>
        </div>
      )}
    </div>
  );
}

export default Products;
