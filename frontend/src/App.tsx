import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Chatbot } from "./components/Chatbot";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import { useAuth } from "./context/AuthContext";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { ResourcePage } from "./pages/ResourcePage";
import type { Customer, Employee, Expense, Product, SalesOrder, Supplier } from "./types";
import type { Column } from "./components/DataTable";
import type { FieldDefinition } from "./types";

const statusColumn = (value: string) => (
  <span className={`status-pill ${value.toLowerCase()}`}>{value}</span>
);
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const date = (value: string) => value ? new Date(value).toLocaleDateString() : "—";

const employeeFields: FieldDefinition[] = [
  { name: "employeeCode", label: "Employee ID", required: true },
  { name: "firstName", label: "First name", required: true },
  { name: "lastName", label: "Last name", required: true },
  { name: "email", label: "Work email", type: "email", required: true },
  { name: "department", label: "Department", required: true },
  { name: "jobTitle", label: "Job title", required: true },
  { name: "hireDate", label: "Hire date", type: "date", required: true },
  { name: "status", label: "Status", type: "select", options: ["ACTIVE", "ON_LEAVE", "INACTIVE"], required: true },
];
const employeeColumns: Column<Employee>[] = [
  { key: "employeeCode", label: "Employee ID" },
  { key: "firstName", label: "Name", render: (_, row) => <><strong>{row.firstName} {row.lastName}</strong><span className="cell-secondary">{row.email}</span></> },
  { key: "jobTitle", label: "Role", render: (value, row) => <><span>{String(value)}</span><span className="cell-secondary">{row.department}</span></> },
  { key: "hireDate", label: "Start date", render: (value) => date(String(value)) },
  { key: "status", label: "Status", render: (value) => statusColumn(String(value)) },
];

const productFields: FieldDefinition[] = [
  { name: "sku", label: "SKU", required: true },
  { name: "name", label: "Product name", required: true },
  { name: "category", label: "Category", required: true },
  { name: "unitPrice", label: "Unit price", type: "number", required: true },
  { name: "quantity", label: "Quantity in stock", type: "number", required: true },
  { name: "reorderLevel", label: "Reorder level", type: "number", required: true },
];
const productColumns: Column<Product>[] = [
  { key: "sku", label: "SKU" },
  { key: "name", label: "Product", render: (value, row) => <><strong>{String(value)}</strong><span className="cell-secondary">{row.category}</span></> },
  { key: "unitPrice", label: "Unit price", render: (value) => money(Number(value)) },
  { key: "quantity", label: "In stock", render: (value, row) => <span className={Number(value) <= row.reorderLevel ? "stock-low" : ""}>{String(value)} units{Number(value) <= row.reorderLevel ? " · Reorder" : ""}</span> },
  { key: "reorderLevel", label: "Reorder at" },
];

const contactFields = [
  { name: "name", label: "Contact name", required: true },
  { name: "company", label: "Company" },
  { name: "email", label: "Email", type: "email" as const },
  { name: "phone", label: "Phone", type: "tel" as const },
];
const contactColumns = <T extends Customer | Supplier>(): Column<T>[] => [
  { key: "name", label: "Contact", render: (value, row) => <><strong>{String(value)}</strong><span className="cell-secondary">{row.email || "No email added"}</span></> },
  { key: "company", label: "Company" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
];

const expenseFields: FieldDefinition[] = [
  { name: "description", label: "Description", required: true },
  { name: "category", label: "Category", type: "select", options: ["Travel", "Supplies", "Software", "Facilities", "Payroll", "Other"], required: true },
  { name: "amount", label: "Amount", type: "number", required: true },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "status", label: "Status", type: "select", options: ["PENDING", "PAID"], required: true },
];
const expenseColumns: Column<Expense>[] = [
  { key: "description", label: "Expense", render: (value, row) => <><strong>{String(value)}</strong><span className="cell-secondary">{row.category}</span></> },
  { key: "date", label: "Date", render: (value) => date(String(value)) },
  { key: "amount", label: "Amount", render: (value) => money(Number(value)) },
  { key: "status", label: "Status", render: (value) => statusColumn(String(value)) },
];

const orderFields: FieldDefinition[] = [
  { name: "orderNumber", label: "Order number", required: true },
  { name: "customerName", label: "Customer name", required: true },
  { name: "total", label: "Order total", type: "number", required: true },
  { name: "orderDate", label: "Order date", type: "date", required: true },
  { name: "status", label: "Status", type: "select", options: ["DRAFT", "CONFIRMED", "PROCESSING", "SHIPPED", "CANCELLED"], required: true },
];
const orderColumns: Column<SalesOrder>[] = [
  { key: "orderNumber", label: "Order", render: (value, row) => <><strong>{String(value)}</strong><span className="cell-secondary">{row.customerName}</span></> },
  { key: "orderDate", label: "Date", render: (value) => date(String(value)) },
  { key: "total", label: "Total", render: (value) => money(Number(value)) },
  { key: "status", label: "Status", render: (value) => statusColumn(String(value)) },
];

function Workspace() {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-shell"><Navbar /><main className="content-area"><Routes>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<ResourcePage<Employee> config={{ endpoint: "employees", title: "Employees", singular: "employee", description: "Manage your team and keep employee information up to date.", fields: employeeFields, columns: employeeColumns }} />} />
        <Route path="products" element={<ResourcePage<Product> config={{ endpoint: "products", title: "Inventory", singular: "product", description: "Track stock, pricing, and reorder levels across your catalog.", fields: productFields, columns: productColumns }} />} />
        <Route path="customers" element={<ResourcePage<Customer> config={{ endpoint: "customers", title: "Customers", singular: "customer", description: "Keep your customer contacts and company details in one place.", fields: contactFields, columns: contactColumns<Customer>() }} />} />
        <Route path="suppliers" element={<ResourcePage<Supplier> config={{ endpoint: "suppliers", title: "Suppliers", singular: "supplier", description: "Manage supplier contacts and purchasing relationships.", fields: contactFields, columns: contactColumns<Supplier>() }} />} />
        <Route path="sales-orders" element={<ResourcePage<SalesOrder> config={{ endpoint: "sales-orders", title: "Sales orders", singular: "sales order", description: "Create orders and follow their progress from confirmation to delivery.", fields: orderFields, columns: orderColumns }} />} />
        <Route path="expenses" element={<ResourcePage<Expense> config={{ endpoint: "expenses", title: "Expenses", singular: "expense", description: "Record and review business expenses in one place.", fields: expenseFields, columns: expenseColumns }} />} />
        <Route path="reports" element={<div className="panel reports-placeholder"><span className="eyebrow">REPORTING</span><h1>Business reports</h1><p>Live summaries are available on the overview dashboard. Detailed reports and exports are coming next.</p></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes><footer className="app-footer"><span>ERPStar <span>·</span> Workspace</span><span>Signed in as {user?.email}</span></footer></main><Chatbot /></div>
    </div>
  );
}

export default function App() {
  return <Routes><Route path="/login" element={<Login />} /><Route element={<ProtectedRoute />}><Route path="/*" element={<Workspace />} /></Route></Routes>;
}
