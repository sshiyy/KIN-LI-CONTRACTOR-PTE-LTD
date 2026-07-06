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
  const [editingWorker, setEditingWorker] = useState(null);

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

function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 4) return digits;

  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}

function formatWpNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 9);

  if (digits.length <= 1) return digits;

  return `${digits.slice(0, 1)} ${digits.slice(1)}`;
}

function formatFinNumber(value) {
  return value
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 9);
}

function handleChange(event) {
  const { name, value } = event.target;

  let formattedValue = value;

  if (name === "name") {
  formattedValue = value.toUpperCase();
}

  if (name === "hpNo") {
    formattedValue = formatPhoneNumber(value);
  }

  if (name === "cNo") {
  formattedValue = value.toUpperCase();
}

  if (name === "wpNo") {
    formattedValue = formatWpNumber(value);
  }

  if (name === "finNo") {
    formattedValue = formatFinNumber(value);
  }

  setFormData((previousData) => ({
    ...previousData,
    [name]: formattedValue,
  }));
}

  async function handleSaveWorker(event) {
  event.preventDefault();

  const hpDigits = formData.hpNo.replace(/\D/g, "");
  const wpDigits = formData.wpNo.replace(/\D/g, "");
  const finValue = formData.finNo.replace(/[^a-zA-Z0-9]/g, "");

  if (hpDigits.length !== 8) {
    alert("HP No must be exactly 8 digits.");
    return;
  }

  if (wpDigits.length !== 9) {
    alert("WP No must be exactly 9 digits.");
    return;
  }

  if (finValue.length !== 9) {
    alert("FIN No must be exactly 9 characters.");
    return;
  }

  const savedWorker = {
    cNo: formData.cNo || "-",
    name: formData.name || "-",
    finNo: formData.finNo || "-",
    hpNo: formData.hpNo ? formatPhoneNumber(formData.hpNo) : "-",
    wpNo: formData.wpNo ? formatWpNumber(formData.wpNo) : "-",
    wpExpiry: formData.wpExpiry || "-",
    socExpiry: noSocExpiry ? "No Expiry" : formData.socExpiry || "-",
    passportExpiry: formData.passportExpiry || "-",
    coretradeExpiry: formData.coretradeExpiry || "-",
  };

  const workerDocId = editingWorker
    ? editingWorker.id
    : savedWorker.cNo !== "-"
      ? savedWorker.cNo
      : savedWorker.finNo;

  await setDoc(doc(db, "workers", workerDocId), savedWorker);

  if (editingWorker) {
    setWorkers((previousWorkers) =>
      previousWorkers.map((worker) =>
        worker.id === editingWorker.id
          ? { id: workerDocId, ...savedWorker }
          : worker
      )
    );
  } else {
    setWorkers((previousWorkers) => [
      ...previousWorkers,
      { id: workerDocId, ...savedWorker },
    ]);
  }

  closeDialog();
}

  function openAddDialog() {
  setEditingWorker(null);
  setFormData(emptyForm);
  setNoSocExpiry(false);
  setShowDialog(true);
}

function openEditDialog(worker) {
  setEditingWorker(worker);

  setFormData({
    cNo: worker.cNo === "-" ? "" : worker.cNo || "",
    name: worker.name === "-" ? "" : worker.name || "",
    hpNo: worker.hpNo === "-" ? "" : worker.hpNo || "",
    finNo: worker.finNo === "-" ? "" : worker.finNo || "",
    wpNo: worker.wpNo === "-" ? "" : worker.wpNo || "",
    wpExpiry: worker.wpExpiry === "-" ? "" : worker.wpExpiry || "",
    socExpiry:
      worker.socExpiry === "-" || worker.socExpiry === "No Expiry"
        ? ""
        : worker.socExpiry || "",
    passportExpiry:
      worker.passportExpiry === "-" ? "" : worker.passportExpiry || "",
    coretradeExpiry:
      worker.coretradeExpiry === "-" ? "" : worker.coretradeExpiry || "",
  });

  setNoSocExpiry(worker.socExpiry === "No Expiry");
  setShowDialog(true);
}

function closeDialog() {
  setShowDialog(false);
  setEditingWorker(null);
  setFormData(emptyForm);
  setNoSocExpiry(false);
}

  function openDatePicker(event) {
    event.target.showPicker?.();
  }

  const sortedWorkers = [...workers].sort((a, b) => {
  const regex = /^KL([A-Z])\((\d+)([A-Z]?)\)$/;

  const cNoA = (a.cNo || "").toUpperCase();
  const cNoB = (b.cNo || "").toUpperCase();

  const matchA = cNoA.match(regex);
  const matchB = cNoB.match(regex);

  // Both are valid KL company numbers
  if (matchA && matchB) {
    // Sort by company letter (C, I, M...)
    const companyCompare = matchA[1].localeCompare(matchB[1]);
    if (companyCompare !== 0) return companyCompare;

    // Sort by number
    const numberCompare = Number(matchA[2]) - Number(matchB[2]);
    if (numberCompare !== 0) return numberCompare;

    // Sort by suffix ("" < A < B < C...)
    return matchA[3].localeCompare(matchB[3]);
  }

  // KL company numbers always come first
  if (matchA && !matchB) return -1;
  if (!matchA && matchB) return 1;

  // Neither has KL company number -> sort by name
  return (a.name || "").localeCompare(b.name || "");
});

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

        <button className="add-worker-btn" onClick={openAddDialog}>
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
              {sortedWorkers.map((worker) => (
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
                    <button className="edit-btn" onClick={() => openEditDialog(worker)}>
  Edit
</button>
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
              <h2>{editingWorker ? "Edit Worker" : "Add New Worker"}</h2>

              <button
                className="close-dialog-btn"
                onClick={closeDialog}
              >
                <X size={22} />
              </button>
            </div>


            <form className="worker-form" onSubmit={handleSaveWorker}>
              <div className="form-section-title">Worker Information</div>

              <div className="form-group">
                <label>
                  C/NO
                </label>
                <input
                  name="cNo"
                  value={formData.cNo}
                  onChange={handleChange}
                  placeholder="e.g. KLC(3)"
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
                  onClick={closeDialog}
                >
                  Cancel
                </button>

                <button className="save-worker-btn" type="submit">
                  <Save size={18} />
                  {editingWorker ? "Update Worker" : "Save Worker"}
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