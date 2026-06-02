import productsData from "../server/data.json";

const STORAGE_CUSTOMERS = "stationaryNookCustomers";
const STORAGE_ORDERS = "stationaryNookOrders";
const OWNER_EMAILS = ["owner@stationary.com", "admin@stationary.com"];

const readStorage = (key, defaultValue) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Ignore storage errors.
  }
};

export const getProducts = () => {
  return productsData.products || [];
};

export const getCustomers = () => {
  return readStorage(STORAGE_CUSTOMERS, productsData.customers || []);
};

export const getCustomerByEmail = (email) => {
  if (!email) return null;
  const normalized = email.trim().toLowerCase();
  return getCustomers().find((customer) => customer.email.toLowerCase() === normalized) || null;
};

export const createCustomer = ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = getCustomerByEmail(normalizedEmail);
  if (existing) return existing;

  const customers = getCustomers();
  const nextId = customers.length > 0 ? Math.max(...customers.map((customer) => customer.id || 0)) + 1 : 1;
  const role = OWNER_EMAILS.includes(normalizedEmail) ? "owner" : "customer";
  const newCustomer = {
    id: nextId,
    name: name.trim(),
    email: normalizedEmail,
    password: password || "",
    role,
  };
  customers.push(newCustomer);
  writeStorage(STORAGE_CUSTOMERS, customers);
  return newCustomer;
};

export const getCustomerByCredentials = (email, password) => {
  const customer = getCustomerByEmail(email);
  if (!customer) return null;
  if (!customer.password) return customer;
  return customer.password === password ? customer : null;
};

export const createOrder = ({ cart, customer, payment, documents }) => {
  if (!Array.isArray(cart) || cart.length === 0) {
    throw new Error("Your cart is empty. Add items before payment.");
  }
  if (!customer?.name || !customer?.email) {
    throw new Error("Please provide your name and email.");
  }
  if (!payment?.method) {
    throw new Error("Payment method is required.");
  }

  const amount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderId = `SN-${Date.now()}`;
  const orders = readStorage(STORAGE_ORDERS, []);
  const newOrder = {
    id: orderId,
    customer,
    amount,
    payment,
    documents: documents || [],
    created_at: new Date().toISOString(),
  };

  orders.push(newOrder);
  writeStorage(STORAGE_ORDERS, orders);

  return {
    orderId,
    amount,
    message: "Payment successful. Your order is ready for pickup.",
  };
};
