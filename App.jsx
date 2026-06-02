import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customers from "./pages/Customers";
import { CartProvider } from "./components/CartContext";
import { UserProvider } from "./components/UserContext";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Navbar />

        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/customers" element={<Customers />} />
        </Routes>
      </CartProvider>
    </UserProvider>
  );
}

export default App;