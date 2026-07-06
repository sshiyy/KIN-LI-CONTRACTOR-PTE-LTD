import { useEffect, useState } from "react";
import "./App.css";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";

import Login from "./pages/Login/Login";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Workers from "./pages/Workers/Workers";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
  return sessionStorage.getItem("currentPage") || "dashboard";
});
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error(error);
      }
    }

    setCheckingAuth(false);
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
  sessionStorage.setItem("currentPage", currentPage);
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
      <Sidebar
  currentPage={currentPage}
  setCurrentPage={setCurrentPage}
  handleLogout={handleLogout}
/>

      <main className="main-content">
        {currentPage === "dashboard" && <Dashboard user={userProfile} />}
        {currentPage === "workers" && <Workers />}
      </main>
    </div>
  );
}

export default App;