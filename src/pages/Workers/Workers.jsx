import "./Workers.css";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { formatDate } from "../../utils/dateUtils";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const querySnapshot = await getDocs(collection(db, "workers"));

        const workersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWorkers(workersData);
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  return (
    <div className="workers-page">
      <div className="workers-header">
  <div>
    <h1>Workers</h1>
    <p>Manage worker details, documents and renewals.</p>
  </div>
</div>

<div className="workers-summary">
  <div className="summary-card">
    <span>Total Workers</span>
    <h2>{workers.length}</h2>
  </div>
</div>

<div className="workers-toolbar">
  <input
    type="text"
    placeholder="Search by C/NO, Name, FIN or WP No..."
  />

  <button className="add-worker-btn">
    + Add Worker
  </button>
</div>

      <div className="workers-card">
        {loading ? (
          <p className="table-message">Loading workers...</p>
        ) : workers.length === 0 ? (
          <p className="table-message">No workers found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>C/NO</th>
                <th>Name</th>
                <th>WP No</th>
                <th>WP Expiry</th>
                <th>SOC Expiry</th>
                <th>Passport Expiry</th>
                <th>FIN No</th>
                <th>CoreTrade Expiry</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td className="cno">{worker.cNo || "-"}</td>
                  <td className="worker-name">{worker.name || "-"}</td>
                  <td>{worker.wpNo || "-"}</td>
                  <td>{formatDate(worker.wpExpiry)}</td>
                  <td>{formatDate(worker.socExpiry)}</td>
                  <td>{formatDate(worker.passportExpiry)}</td>
                  <td>{worker.finNo || "-"}</td>
                  <td>{formatDate(worker.coretradeExpiry)}</td>
                  <td>
                    <button className="view-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Workers;