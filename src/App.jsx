import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Workers from "./pages/Workers/Workers";

function App() {
  const [currentPage, setCurrentPage] = useState("workers");

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="main-content">
        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "workers" && <Workers />}
      </main>
    </div>
  );
}

export default App;