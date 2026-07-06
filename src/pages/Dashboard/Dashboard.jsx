import "./Dashboard.css";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { X, Save } from "lucide-react";

import { db } from "../../firebase";
import { formatDate } from "../../utils/dateUtils";

function Dashboard({ user }) {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [noSocExpiry, setNoSocExpiry] = useState(false);

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const querySnapshot = await getDocs(collection(db, "workers"));

        const workersData = querySnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setWorkers(workersData);
      } catch (error) {
        console.error("Error fetching dashboard workers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }

  function getTodayDate() {
    return new Date().toLocaleDateString("en-SG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getDaysLeft(dateValue) {
    if (!dateValue || dateValue === "-" || dateValue === "No Expiry") return null;

    const expiryDate = new Date(dateValue);
    if (isNaN(expiryDate.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
  }

  function getStatusClass(daysLeft) {
    if (daysLeft <= 14) return "danger";
    if (daysLeft <= 30) return "warning";
    return "upcoming";
  }

  function getExpiringItems() {
    const items = [];

    workers.forEach((worker) => {
      const checks = [
        {
          document: "Work Permit",
          shortName: "WP",
          field: "wpExpiry",
          date: worker.wpExpiry,
          limit: 61,
        },
        {
          document: "SOC",
          shortName: "SOC",
          field: "socExpiry",
          date: worker.socExpiry,
          limit: 46,
        },
        {
          document: "Passport",
          shortName: "Passport",
          field: "passportExpiry",
          date: worker.passportExpiry,
          limit: 183,
        },
        {
          document: "CoreTrade",
          shortName: "CoreTrade",
          field: "coretradeExpiry",
          date: worker.coretradeExpiry,
          limit: 92,
        },
      ];

      checks.forEach((check) => {
        const daysLeft = getDaysLeft(check.date);

        if (daysLeft !== null && daysLeft <= check.limit) {
          items.push({
            worker,
            workerName: worker.name || "-",
            cNo: worker.cNo || "-",
            document: check.document,
            shortName: check.shortName,
            field: check.field,
            expiryDate: check.date,
            daysLeft,
          });
        }
      });
    });

    return items.sort((a, b) => a.daysLeft - b.daysLeft);
  }

  function openExpiryDialog(item) {
    setSelectedExpiry(item);
    setNewExpiryDate(item.expiryDate === "-" ? "" : item.expiryDate || "");
    setNoSocExpiry(item.expiryDate === "No Expiry");
  }

  function closeExpiryDialog() {
    setSelectedExpiry(null);
    setNewExpiryDate("");
    setNoSocExpiry(false);
  }

  async function handleSaveExpiry(event) {
    event.preventDefault();

    const updatedValue =
      selectedExpiry.field === "socExpiry" && noSocExpiry
        ? "No Expiry"
        : newExpiryDate || "-";

    const updatedWorker = {
      ...selectedExpiry.worker,
      [selectedExpiry.field]: updatedValue,
    };

    await setDoc(doc(db, "workers", selectedExpiry.worker.id), updatedWorker);

    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === selectedExpiry.worker.id
          ? { id: selectedExpiry.worker.id, ...updatedWorker }
          : worker
      )
    );

    closeExpiryDialog();
  }

  const expiringItems = getExpiringItems();

  const wpExpiring = expiringItems.filter((item) => item.document === "Work Permit").length;
  const socExpiring = expiringItems.filter((item) => item.document === "SOC").length;
  const passportExpiring = expiringItems.filter((item) => item.document === "Passport").length;
  const coretradeExpiring = expiringItems.filter((item) => item.document === "CoreTrade").length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>
            {getGreeting()}
            {user?.name ? `, ${user.name}` : ""} 👋
          </h1>

          <p className="dashboard-date">Today is {getTodayDate()}.</p>

          <p className="dashboard-subtitle">
            Have a productive day managing your workforce.
          </p>
        </div>
      </div>

      <div className="dashboard-divider"></div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span>👷</span>
          <h2>{workers.length}</h2>
          <p>Total Workers</p>
        </div>

        <div className="dashboard-card">
          <span>📄</span>
          <h2>{wpExpiring}</h2>
          <p>WP Expiring</p>
        </div>

        <div className="dashboard-card">
          <span>📋</span>
          <h2>{socExpiring}</h2>
          <p>SOC Expiring</p>
        </div>

        <div className="dashboard-card">
          <span>🛂</span>
          <h2>{passportExpiring}</h2>
          <p>Passport Expiring</p>
        </div>

        <div className="dashboard-card">
          <span>🏗️</span>
          <h2>{coretradeExpiring}</h2>
          <p>CoreTrade Expiring</p>
        </div>
      </div>

      <div className="upcoming-section">
        <div className="section-header">
          <h2>Upcoming Expiries</h2>
          <p>Documents that are reaching their renewal period.</p>
        </div>

        <div className="upcoming-card">
          {loading ? (
            <p className="empty-message">Loading dashboard...</p>
          ) : expiringItems.length === 0 ? (
            <p className="empty-message">No upcoming expiries.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Worker</th>
                  <th>C/NO</th>
                  <th>Document</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {expiringItems.map((item, index) => (
                  <tr key={index}>
                    <td className="worker-name">{item.workerName}</td>
                    <td>{item.cNo}</td>
                    <td>
                      <span className="document-pill">{item.shortName}</span>
                    </td>
                    <td>{formatDate(item.expiryDate)}</td>
                    <td>
                      <span className={`days-badge ${getStatusClass(item.daysLeft)}`}>
                        {item.daysLeft < 0 ? "Expired" : `${item.daysLeft} days`}
                      </span>
                    </td>
                    <td>
                      <button
                        className="update-expiry-btn"
                        onClick={() => openExpiryDialog(item)}
                      >
                        Update Expiry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedExpiry && (
        <div className="expiry-dialog-backdrop">
          <div className="expiry-dialog">
            <div className="expiry-dialog-header">
              <div>
                <h2>Update {selectedExpiry.document} Expiry</h2>
                <p>{selectedExpiry.workerName}</p>
              </div>

              <button onClick={closeExpiryDialog}>
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveExpiry} className="single-expiry-form">
              <div className="current-expiry-box">
                <span>Current Expiry</span>
                <strong>{formatDate(selectedExpiry.expiryDate)}</strong>
              </div>

              {selectedExpiry.field === "socExpiry" && (
                <label className="dashboard-checkbox-label">
                  <input
                    type="checkbox"
                    checked={noSocExpiry}
                    onChange={(event) => {
                      setNoSocExpiry(event.target.checked);
                      if (event.target.checked) {
                        setNewExpiryDate("");
                      }
                    }}
                  />
                  No expiry
                </label>
              )}

              <div className="single-expiry-group">
                <label>New Expiry Date</label>
                <input
                  type="date"
                  value={newExpiryDate}
                  onChange={(event) => setNewExpiryDate(event.target.value)}
                  disabled={selectedExpiry.field === "socExpiry" && noSocExpiry}
                />
              </div>

              <div className="expiry-dialog-actions">
                <button type="button" onClick={closeExpiryDialog}>
                  Cancel
                </button>

                <button type="submit">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;