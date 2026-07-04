import "./Sidebar.css";
import { LayoutDashboard, Users } from "lucide-react";

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏗️</div>

        <div>
          <h3>KIN LI</h3>
          <p>CONTRACTOR PTE LTD</p>
        </div>
      </div>

      <button
        className={`sidebar-item ${
          currentPage === "dashboard" ? "active" : ""
        }`}
        onClick={() => setCurrentPage("dashboard")}
      >
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </button>

      <button
        className={`sidebar-item ${
          currentPage === "workers" ? "active" : ""
        }`}
        onClick={() => setCurrentPage("workers")}
      >
        <Users size={20} />
        <span>Workers</span>
      </button>
    </aside>
  );
}

export default Sidebar;