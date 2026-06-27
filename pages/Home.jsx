import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <header className="home-hero-container">
        <div className="hero-content">
          <span className="hero-badge">Centralized College Store</span>
          <h1 className="hero-gradient-title">
            Elevate Your Study Setup with <span>Stationery Nook</span>
          </h1>
          <p className="hero-subtext">
            The modern stationery ordering and instant document print platform for college students. Browse real-time inventory, submit files, and pick up your order without the wait.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="button">
              Shop Stationery
            </Link>
            <Link to="/upload" className="hero-secondary-button">
              Print Documents
            </Link>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="/stationery_hero.png"
            alt="Aesthetic Modern Stationery Layout"
            className="hero-img"
          />
        </div>
      </header>

      {/* Services/Features Section */}
      <section>
        <h2 className="home-section-title">Designed for Fast-Paced College Life</h2>
        <p className="home-section-sub">
          Say goodbye to manual logbooks, long bookstore queues, and last-minute print rushes. Our automated platform provides essential student tools at your fingertips.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">📦</div>
            <h3>Real-time Inventory</h3>
            <p>
              Check stationery item stock levels instantly before ordering. Know what's available before you walk in.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">📁</div>
            <h3>Document Printing</h3>
            <p>
              Upload assignments, PDFs, or complete folders directly to queue them for printing at the store.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">💳</div>
            <h3>Razorpay Simulation</h3>
            <p>
              Experience secure student checkout with simulated card and UPI instant payment validation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">⚡</div>
            <h3>Skip-the-Queue Pickup</h3>
            <p>
              Get order receipts with secure unique order IDs for instant verification and lightning-fast pickup.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ background: "rgba(37, 99, 235, 0.03)", padding: "4rem 2rem", borderRadius: "2rem", marginBottom: "4rem" }}>
        <h2 className="home-section-title" style={{ marginTop: 0 }}>Three Simple Steps</h2>
        <p className="home-section-sub">
          How to get your study materials ready-to-go in minutes.
        </p>

        <div className="stepper-container">
          <div className="stepper-card">
            <div className="step-number">1</div>
            <h4>Add items or PDFs</h4>
            <p>Select notebooks, pens, highlighters or select document files to print.</p>
          </div>

          <div className="stepper-card">
            <div className="step-number">2</div>
            <h4>Pay Securely</h4>
            <p>Enter details and pay via simulated UPI or card to validate the request.</p>
          </div>

          <div className="stepper-card">
            <div className="step-number">3</div>
            <h4>Grab & Go!</h4>
            <p>Show your receipt at the nook counter and receive your package instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
