export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  status: string;
  hireDate: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  reorderLevel: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  status: string;
}

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  orderDate: string;
}

export interface DashboardSummary {
  employeeCount: number;
  productCount: number;
  inventoryValue: number;
  customerCount: number;
  openOrders: number;
  monthlyExpenses: number;
  recentOrders: SalesOrder[];
}

export interface FieldDefinition {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "date" | "select" | "tel";
  options?: string[];
  required?: boolean;
}
