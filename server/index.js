import express from "express";
import cors from "cors";
import { getProducts, getCustomers, getCustomerByEmail, createCustomer, createOrder, createOrderItems } from "./db.js";

const app = express();
// During local development allow requests from any origin to avoid CORS issues
app.use(cors());
app.use(express.json());

app.get("/api/products", (req, res) => {
  res.json(getProducts());
});

// Return all customers (simple admin view)
app.get("/api/customers", (req, res) => {
  try {
    res.json(getCustomers());
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch customers." });
  }
});

app.post("/api/checkout", (req, res) => {
  const { cart, customer, payment } = req.body;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Your cart is empty. Add items before payment." });
  }

  if (!customer?.name || !customer?.email) {
    return res.status(400).json({ error: "Please provide your name and email." });
  }

  if (!payment?.method) {
    return res.status(400).json({ error: "Payment method is required." });
  }

  if (payment.method === "card") {
    const cardNumberString = String(payment?.cardNumber || "").replace(/\s+/g, "");
    if (!/^[0-9]{12,19}$/.test(cardNumberString)) {
      return res.status(400).json({ error: "Please enter a valid card number." });
    }

    if (!payment?.expiry || !payment?.cvv || !/^[0-9]{3,4}$/.test(payment.cvv)) {
      return res.status(400).json({ error: "Please enter valid card expiry and CVV." });
    }
  } else if (payment.method === "upi") {
    const upiId = String(payment?.upiId || "").trim();
    if (!upiId || !/^[^\s@]+@[A-Za-z0-9]+$/.test(upiId)) {
      return res.status(400).json({ error: "Please enter a valid UPI ID." });
    }
  } else {
    return res.status(400).json({ error: "Unsupported payment method." });
  }

  const amount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = `SN-${Date.now()}`;
  const savedCustomer = createCustomer({ name: customer.name, email: customer.email });

  createOrder({
    id: orderId,
    customer_id: savedCustomer.id,
    total: amount,
    payment_method: payment.method,
    payment_details: payment.method === "upi" ? { upiId: payment.upiId } : { cardNumber: payment.cardNumber.slice(-4) },
    status: "paid",
    created_at: new Date().toISOString(),
  });

  createOrderItems(orderId, cart.map((item) => ({
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  })));

  return res.json({ orderId, amount, message: "Payment successful. Your order is ready for pickup." });
});

// Register a customer (idempotent by email)
app.post("/api/register", (req, res) => {
  console.log("/api/register body:", req.body);
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: "Name and email are required." });

  try {
    const customer = createCustomer({ name, email });
    console.log("Created customer:", customer);
    return res.json({ customer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create customer." });
  }
});

// Login: return customer by email
app.post("/api/login", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    const customer = getCustomerByEmail(email);
    if (!customer) return res.status(404).json({ error: "User not found." });
    return res.json({ customer: { ...customer, role: customer.role || "customer" } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Login failed." });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Stationery Nook backend running on http://localhost:${PORT}`);
});
