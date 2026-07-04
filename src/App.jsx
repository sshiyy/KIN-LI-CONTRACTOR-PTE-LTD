import { useEffect, useState } from "react";
import "./App.css";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login/Login";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Workers from "./pages/Workers/Workers";

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
  return localStorage.getItem("currentPage") || "dashboard";
});
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
  localStorage.setItem("currentPage", currentPage);
}, [currentPage]);

  async function handleLogout() {
    await signOut(auth);
  }

  if (checkingAuth) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="main-content">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        {currentPage === "dashboard" && <Dashboard />}
        {currentPage === "workers" && <Workers />}
      </main>
    </div>
  );
}

export default App;