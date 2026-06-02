import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adapter = new JSONFile(path.join(__dirname, "data.json"));
const db = new Low(adapter);

await db.read();
if (!db.data) {
  db.data = {
    products: [],
    customers: [],
    orders: [],
    order_items: [],
  };
}

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

if (db.data.products.length === 0) {
  db.data.products.push(...defaultProducts);
  await db.write();
}

const adminEmails = ["owner@stationary.com", "admin@stationary.com"];

const getProducts = () => db.data.products;
const getCustomers = () => db.data.customers;
const getCustomerByEmail = (email) => db.data.customers.find((customer) => customer.email === email);

const createCustomer = (customer) => {
  const existing = getCustomerByEmail(customer.email);
  if (existing) return existing;
  const id = db.data.customers.length + 1;
  const role = adminEmails.includes(customer.email.toLowerCase()) ? "owner" : "customer";
  const newCustomer = { id, name: customer.name, email: customer.email, role };
  db.data.customers.push(newCustomer);
  db.write();
  return newCustomer;
};

const createOrder = (order) => {
  db.data.orders.push(order);
  db.write();
};

const createOrderItems = (orderId, items) => {
  const nextId = () => db.data.order_items.length + 1;
  for (const item of items) {
    db.data.order_items.push({ id: nextId(), order_id: orderId, ...item });
  }
  db.write();
};

export { getProducts, getCustomers, getCustomerByEmail, createCustomer, createOrder, createOrderItems };
