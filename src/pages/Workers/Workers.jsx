import "./Workers.css";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { X, Save } from "lucide-react";

import { db } from "../../firebase";
import { formatDate } from "../../utils/dateUtils";

const emptyForm = {
  cNo: "",
  name: "",
  hpNo: "",
  finNo: "",
  wpNo: "",
  wpExpiry: "",
  socExpiry: "",
  passportExpiry: "",
  coretradeExpiry: "",
};

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [noSocExpiry, setNoSocExpiry] = useState(false);

  async function fetchWorkers() {
    try {
      const querySnapshot = await getDocs(collection(db, "workers"));
      const workersData = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      setWorkers(workersData);
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorkers();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleAddWorker(event) {
    event.preventDefault();

    const newWorker = {
      cNo: formData.cNo || "-",
      name: formData.name || "-",
      hpNo: formData.hpNo || "-",
      finNo: formData.finNo || "-",
      wpNo: formData.wpNo || "-",
      wpExpiry: formData.wpExpiry || "-",
      socExpiry: noSocExpiry ? "No Expiry" : formData.socExpiry || "-",
      passportExpiry: formData.passportExpiry || "-",
      coretradeExpiry: formData.coretradeExpiry || "-",
    };

    await setDoc(doc(db, "workers", newWorker.cNo), newWorker);

    setWorkers((previousWorkers) => [
      ...previousWorkers,
      { id: newWorker.cNo, ...newWorker },
    ]);

    setFormData(emptyForm);
    setNoSocExpiry(false);
    setShowDialog(false);
  }

  function openDatePicker(event) {
    event.target.showPicker?.();
  }

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

        <button className="add-worker-btn" onClick={() => setShowDialog(true)}>
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
                <th>HP No</th>
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
                  <td>{worker.hpNo || "-"}</td>
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

      {showDialog && (
        <div className="dialog-backdrop">
          <div className="worker-dialog">
            <div className="dialog-header">
              <h2>Add New Worker</h2>

              <button
                className="close-dialog-btn"
                onClick={() => setShowDialog(false)}
              >
                <X size={22} />
              </button>
            </div>

            <form className="worker-form" onSubmit={handleAddWorker}>
              <div className="form-section-title">Worker Information</div>

              <div className="form-group">
                <label>
                  C/NO<span className="required">*</span>
                </label>
                <input
                  name="cNo"
                  value={formData.cNo}
                  onChange={handleChange}
                  placeholder="e.g. KLC(3)"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Name<span className="required">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. GAO WEICHUAN"
                  required
                />
              </div>

              <div className="form-group">
                <label>HP No<span className="required">*</span></label>
                <input
                  name="hpNo"
                  value={formData.hpNo}
                  onChange={handleChange}
                  placeholder="e.g. 8372 6203"
                  required
                />
              </div>

              <div className="form-group">
                <label>FIN No<span className="required">*</span></label>
                <input
                  name="finNo"
                  value={formData.finNo}
                  onChange={handleChange}
                  placeholder="e.g. G6549638R"
                  required
                />
              </div>

              <div className="form-group">
                <label>WP No<span className="required">*</span></label>
                <input
                  name="wpNo"
                  value={formData.wpNo}
                  onChange={handleChange}
                  placeholder="e.g. 0 73392225"
                  required
                />
              </div>

              <div className="form-divider"></div>

              <div className="form-section-title">Expiry Information</div>

              <div className="form-group">
                <label>WP Expiry</label>
                <input
                  type="date"
                  name="wpExpiry"
                  value={formData.wpExpiry}
                  onChange={handleChange}
                  onClick={openDatePicker}
                />
              </div>

              <div className="form-group">
                <label>SOC Expiry</label>
                <input
                  type="date"
                  name="socExpiry"
                  value={formData.socExpiry}
                  onChange={handleChange}
                  onClick={openDatePicker}
                  disabled={noSocExpiry}
                />

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={noSocExpiry}
                    onChange={(event) => {
                      setNoSocExpiry(event.target.checked);

                      if (event.target.checked) {
                        setFormData((previousData) => ({
                          ...previousData,
                          socExpiry: "",
                        }));
                      }
                    }}
                  />
                  No expiry
                </label>
              </div>

              <div className="form-group">
                <label>Passport Expiry</label>
                <input
                  type="date"
                  name="passportExpiry"
                  value={formData.passportExpiry}
                  onChange={handleChange}
                  onClick={openDatePicker}
                />
              </div>

              <div className="form-group">
                <label>CoreTrade Expiry</label>
                <input
                  type="date"
                  name="coretradeExpiry"
                  value={formData.coretradeExpiry}
                  onChange={handleChange}
                  onClick={openDatePicker}
                />
              </div>

              <div className="form-note">
                Fields left blank will be displayed as <strong>"-"</strong>.
              </div>

              <div className="dialog-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>

                <button className="save-worker-btn" type="submit">
                  <Save size={18} />
                  Save Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workers;