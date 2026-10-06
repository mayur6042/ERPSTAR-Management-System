import { ArrowRight, Boxes, CircleDollarSign, UsersRound, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../components/Loading";
import { request } from "../services/api";
import type { DashboardSummary } from "../types";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const today = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date()).toUpperCase();

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    request<DashboardSummary>("/dashboard").then(setSummary).catch((caught: Error) => setError(caught.message));
  }, []);
  if (error) return <div className="notice notice-error">{error}</div>;
  if (!summary) return <Loading label="Loading your overview..." />;

  const metrics = [
    { label: "Team members", value: summary.employeeCount.toLocaleString(), change: "Active employees", icon: UsersRound, tone: "violet" },
    { label: "Inventory value", value: money.format(summary.inventoryValue), change: `${summary.productCount} products tracked`, icon: Boxes, tone: "blue" },
    { label: "Open orders", value: summary.openOrders.toLocaleString(), change: "Sales orders in progress", icon: CircleDollarSign, tone: "green" },
    { label: "Monthly expenses", value: money.format(summary.monthlyExpenses), change: "Current month", icon: Wallet, tone: "amber" },
  ];

  return (
    <div className="dashboard-page">
      <div className="page-intro"><div><span className="eyebrow">{today}</span><h1>Good morning, welcome back</h1><p>Here’s what’s happening across your business today.</p></div><Link className="button button-primary" to="/sales-orders">Create sales order <ArrowRight size={16} /></Link></div>
      <div className="metric-grid">{metrics.map((metric) => {
        const Icon = metric.icon;
        return <article className="metric-card" key={metric.label}><div className="metric-top"><span>{metric.label}</span><span className={`metric-icon ${metric.tone}`}><Icon size={18} /></span></div><div className="metric-value">{metric.value}</div><div className="metric-foot"><span>{metric.change}</span></div></article>;
      })}</div>
      <section className="dashboard-lower">
        <div className="panel recent-panel"><div className="panel-heading"><div><span className="eyebrow">LATEST ACTIVITY</span><h2>Recent sales orders</h2></div><Link to="/sales-orders" className="subtle-link">View all <ArrowRight size={14} /></Link></div>
          {summary.recentOrders.length ? <div className="recent-list">{summary.recentOrders.map((order) => <div className="recent-row" key={order.id}><div className="order-avatar">{order.customerName.slice(0, 1).toUpperCase()}</div><div className="order-copy"><strong>{order.customerName}</strong><span>{order.orderNumber} · {new Date(order.orderDate).toLocaleDateString()}</span></div><span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span><strong className="order-total">{money.format(Number(order.total))}</strong></div>)}</div> : <div className="empty-activity"><span className="empty-activity-icon"><CircleDollarSign size={20} /></span><strong>No orders yet</strong><span>Sales orders will show up here as your team creates them.</span><Link to="/sales-orders">Create your first order <ArrowRight size={14} /></Link></div>}
        </div>
        <div className="panel quick-panel"><div className="panel-heading"><div><span className="eyebrow">GET STARTED</span><h2>Quick actions</h2></div></div><div className="quick-actions"><Link to="/employees" className="quick-action"><span className="quick-icon quick-purple"><UsersRound size={17} /></span><span><strong>Add a team member</strong><small>Update your employee directory</small></span><ArrowRight size={15} /></Link><Link to="/products" className="quick-action"><span className="quick-icon quick-blue"><Boxes size={17} /></span><span><strong>Add an inventory item</strong><small>Keep stock levels up to date</small></span><ArrowRight size={15} /></Link><Link to="/expenses" className="quick-action"><span className="quick-icon quick-orange"><Wallet size={17} /></span><span><strong>Record an expense</strong><small>Track business spending</small></span><ArrowRight size={15} /></Link></div><div className="customers-note"><span className="status-dot" /><span><strong>{summary.customerCount}</strong> customers in your workspace</span><Link to="/customers">View</Link></div></div>
      </section>
    </div>
  );
}
