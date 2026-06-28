import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "How does the document print queue work?",
      a: "Simply upload your PDFs, assignments, or slides in the 'Upload' tab, and add them to your cart. Once paid, the files enter the print queue instantly, and the nook owner prepares the prints for you."
    },
    {
      q: "When will my counter pickup be ready?",
      a: "Stationery packages are prepared in under 15 minutes. Document prints are queued and completed immediately, so you can pick them up on your way to class without standing in line."
    },
    {
      q: "Is this payment simulation secure?",
      a: "Yes! The checkout uses a secure client-side sandbox validation pattern to verify card digit structures or UPI format handles, simulating a successful transaction without charging real money."
    }
  ];

  return (
    <div className="page-container" style={{ position: "relative" }}>
      {/* Premium Decorative Glow Blobs */}
      <div className="ambient-glow glow-blue"></div>
      <div className="ambient-glow glow-violet"></div>

      {/* Hero Section */}
      <header className="home-hero-container">
        <div className="hero-content">
          <span className="hero-badge">⚡ Centralized Campus Store</span>
          <h1 className="hero-gradient-title">
            Elevate Your Study Setup with <span>Stationery Nook</span>
          </h1>
          <p className="hero-subtext">
            The modern stationery ordering and instant document print platform for college students. Browse real-time inventory, submit files, and pick up your order without the wait.
          </p>
          <div className="hero-cta-group">
            <Link to="/products" className="button hero-btn-shadow">
              Shop Stationery
            </Link>
            <Link to="/upload" className="hero-secondary-button">
              Print Documents
            </Link>
          </div>

          {/* Quick Info Points */}
          <div className="hero-info-row">
            <div className="info-tag">
              <span className="info-icon">📦</span>
              <span>15-Min Ready</span>
            </div>
            <div className="info-tag">
              <span className="info-icon">💳</span>
              <span>Cashless UPI</span>
            </div>
            <div className="info-tag">
              <span className="info-icon">📄</span>
              <span>Zero-Queue Print</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-visual-frame">
            <img
              src="/stationery_hero.png"
              alt="Aesthetic Modern Stationery Layout"
              className="hero-img light-only"
            />
            <img
              src="/stationery_hero_dark.png"
              alt="Aesthetic Modern Stationery Layout"
              className="hero-img dark-only"
            />
            {/* Floating Info Overlay Badges */}
            <div className="overlay-badge badge-left">
              <span className="badge-icon-overlay">🎒</span>
              <div>
                <p className="badge-title-overlay">100+ items</p>
                <p className="badge-sub-overlay">Real-time stock</p>
              </div>
            </div>
            <div className="overlay-badge badge-right">
              <span className="badge-icon-overlay">⚡</span>
              <div>
                <p className="badge-title-overlay">No Queue</p>
                <p className="badge-sub-overlay">Instant counter collection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Statistics Row */}
      <section className="stats-row-container">
        <div className="stat-card-item">
          <h3>12+</h3>
          <p>Verified supplies items</p>
        </div>
        <div className="stat-card-item">
          <h3>&lt; 15 min</h3>
          <p>Average counter package time</p>
        </div>
        <div className="stat-card-item">
          <h3>24/7</h3>
          <p>Online document print queue</p>
        </div>
      </section>

      {/* Services/Features Section */}
      <section className="home-section-wrapper">
        <h2 className="home-section-title">Designed for Fast-Paced College Life</h2>
        <p className="home-section-sub">
          Say goodbye to manual logbooks, long bookstore queues, and last-minute print rushes. Our automated platform provides essential student tools at your fingertips.
        </p>

        <div className="features-grid">
          <div className="feature-card glass-premium">
            <div className="feature-icon-wrapper">📦</div>
            <h3>Real-time Inventory</h3>
            <p>
              Check stationery item stock levels instantly before ordering. Know what's available before you walk in.
            </p>
          </div>

          <div className="feature-card glass-premium">
            <div className="feature-icon-wrapper">📁</div>
            <h3>Document Printing</h3>
            <p>
              Upload assignments, PDFs, or complete folders directly to queue them for printing at the store.
            </p>
          </div>

          <div className="feature-card glass-premium">
            <div className="feature-icon-wrapper">💳</div>
            <h3>Razorpay Simulation</h3>
            <p>
              Experience secure student checkout with simulated card and UPI instant payment validation.
            </p>
          </div>

          <div className="feature-card glass-premium">
            <div className="feature-icon-wrapper">⚡</div>
            <h3>Skip-the-Queue Pickup</h3>
            <p>
              Get order receipts with secure unique order IDs for instant verification and lightning-fast pickup.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="stepper-section-wrapper">
        <h2 className="home-section-title" style={{ marginTop: 0 }}>Three Simple Steps</h2>
        <p className="home-section-sub">
          How to get your study materials ready-to-go in minutes.
        </p>

        <div className="stepper-container">
          <div className="stepper-card glass-premium">
            <div className="step-number">1</div>
            <h4>Add items or PDFs</h4>
            <p>Select notebooks, pens, highlighters or select document files to print.</p>
          </div>

          <div className="stepper-card glass-premium">
            <div className="step-number">2</div>
            <h4>Pay Securely</h4>
            <p>Enter details and pay via simulated UPI or card to validate the request.</p>
          </div>

          <div className="stepper-card glass-premium">
            <div className="step-number">3</div>
            <h4>Grab & Go!</h4>
            <p>Show your receipt at the nook counter and receive your package instantly.</p>
          </div>
        </div>
      </section>

      {/* Dynamic FAQs Section */}
      <section className="faq-section-wrapper">
        <h2 className="home-section-title">Frequently Asked Questions</h2>
        <p className="home-section-sub">Everything you need to know about student pickups and queues.</p>
        
        <div className="faq-grid-box">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className={`faq-card-box glass-premium ${isOpen ? "faq-open-style" : ""}`}
                onClick={() => setActiveFaq(isOpen ? null : idx)}
              >
                <div className="faq-question-box">
                  <h4>{faq.q}</h4>
                  <span className="faq-arrow-box">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="faq-answer-box">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
