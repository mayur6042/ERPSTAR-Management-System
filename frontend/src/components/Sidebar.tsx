import {
  Boxes,
  ChartNoAxesCombined,
  ClipboardList,
  ContactRound,
  LayoutDashboard,
  ShoppingCart,
  UsersRound,
  Wallet,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Overview", to: "/", icon: LayoutDashboard },
  { label: "Employees", to: "/employees", icon: UsersRound },
  { label: "Inventory", to: "/products", icon: Boxes },
  { label: "Customers", to: "/customers", icon: ContactRound },
  { label: "Suppliers", to: "/suppliers", icon: ClipboardList },
  { label: "Sales orders", to: "/sales-orders", icon: ShoppingCart },
  { label: "Expenses", to: "/expenses", icon: Wallet },
  { label: "Reports", to: "/reports", icon: ChartNoAxesCombined },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">E</span><span>ERPStar<span className="brand-sub">ERP PLATFORM</span></span></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav>
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
            {label === "Inventory" && <span className="nav-badge">2</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer"><span className="status-dot" /> All systems operational</div>
    </aside>
  );
}
