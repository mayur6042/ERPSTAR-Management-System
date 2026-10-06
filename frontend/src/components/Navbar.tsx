import { Bell, ChevronDown, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPage = location.pathname === "/"
    ? "Overview"
    : location.pathname.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Overview";
  const initials = user?.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() ?? "U";
  return (
    <header className="topbar">
      <div className="breadcrumbs"><span>Workspace</span><span className="crumb-separator">/</span><strong>{currentPage}</strong></div>
      <div className="topbar-actions">
        <label className="search-box"><Search size={16} /><input aria-label="Search" placeholder="Search anything..." /><kbd>⌘ K</kbd></label>
        <button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button>
        <div className="profile">
          <div className="avatar">{initials}</div>
          <div className="profile-copy"><strong>{user?.name ?? "User"}</strong><span>{user?.role ?? "Member"}</span></div>
          <button className="profile-menu" aria-label="Sign out" onClick={logout}><ChevronDown size={16} /></button>
        </div>
      </div>
    </header>
  );
}
