import "./Sidebar.css";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import logo from "../../assets/LOGO-small.svg";

function Sidebar({ currentPage, setCurrentPage, handleLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="KIN LI Logo" className="logo-icon" />
        <div>
          <h3>KIN LI</h3>
          <p>CONTRACTOR PTE LTD</p>
        </div>
      </div>

      <div className="sidebar-menu">
        <button
          className={`sidebar-item ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => setCurrentPage("dashboard")}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button
          className={`sidebar-item ${currentPage === "workers" ? "active" : ""}`}
          onClick={() => setCurrentPage("workers")}
        >
          <Users size={20} />
          <span>Workers</span>
        </button>
      </div>

      <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;