const STORAGE_CUSTOMERS = "stationaryNookCustomers";
const STORAGE_ORDERS = "stationaryNookOrders";
const OWNER_EMAILS = ["owner@stationary.com", "admin@stationary.com"];

const defaultProducts = [
  { id: "notebook", name: "Spiral Notebook", description: "200 pages of smooth paper for school notes.", price: 120 },
  { id: "pen-set", name: "Gel Pen Pack", description: "Set of 10 pens with bright ink colors.", price: 220 },
  { id: "marker", name: "Highlighter Set", description: "Four neon highlighters for easy studying.", price: 160 },
  { id: "folder", name: "Document Folder", description: "Keep your handouts neat and ready for class.", price: 80 },
  { id: "pencil-case", name: "Pencil Case", description: "A durable pouch for pens, pencils and erasers.", price: 140 },
  { id: "sticky-notes", name: "Sticky Notes", description: "Perfect for quick reminders and bookmarks.", price: 60 },
  { id: "desk-organizer", name: "Desk Organizer", description: "Keep your study table tidy with compartments for every tool.", price: 360 },
  { id: "journal", name: "Eco Journal", description: "Plant-based paper journal for notes, sketches, and study planning.", price: 180 },
  { id: "pencil-pack", name: "Graphite Pencil Pack", description: "Set of 12 smooth writing pencils for everyday notes.", price: 110 },
  { id: "ruler-set", name: "Ruler + Protractor Set", description: "Essential geometry tools for classes and projects.", price: 85 },
  { id: "glue-stick", name: "Washable Glue Stick", description: "Clean and easy adhesive for school crafts and homework.", price: 70 },
  { id: "tab-notes", name: "Sticky Tab Notes", description: "Colorful tabs for marking pages, reminders and study sections.", price: 90 },
];

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
  return defaultProducts;
};

export const getCustomers = () => {
  return readStorage(STORAGE_CUSTOMERS, []);
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
