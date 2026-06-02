import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-intro page-container">
      <h1 className="hero-title">Welcome to Stationery Nook</h1>
      <p className="hero-text">Order your stationery online and skip the queue.</p>
      <Link to="/products" className="button">
        Shop Now
      </Link>
    </div>
  );
}

export default Home;
