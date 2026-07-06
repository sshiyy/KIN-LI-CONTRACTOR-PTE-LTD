import "./PrintWorkers.css";

function isExpiringSoon(date, daysLimit) {
  if (!date || date === "-" || date === "No Expiry") return false;

  const expiryDate = new Date(date);
  if (isNaN(expiryDate)) return false;

  const today = new Date();
  const diffTime = expiryDate - today;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= daysLimit;
}

function PrintWorkers({ workers }) {
  return (
    <div className="print-page">
      <div className="print-actions">
        <button onClick={() => window.print()}>Print</button>
        <button onClick={() => window.close()}>Close</button>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>C/NO</th>
            <th>Name</th>
            <th>WP No</th>
            <th>WP Expiry</th>
            <th>SOC Expiry</th>
            <th>Passport Expiry</th>
            <th>FIN No</th>
            <th>CoreTrade Expiry</th>
          </tr>
        </thead>

        <tbody>
          {workers.map((worker, index) => (
            <tr key={worker.id}>
              <td>{index + 1}</td>
              <td>{worker.cNo || "-"}</td>
              <td>{worker.name || "-"}</td>
              <td>{worker.wpNo || "-"}</td>

              <td className={isExpiringSoon(worker.wpExpiry, 61) ? "expiry-danger" : ""}>
                {worker.wpExpiry || "-"}
              </td>

              <td className={isExpiringSoon(worker.socExpiry, 46) ? "expiry-danger" : ""}>
                {worker.socExpiry || "-"}
              </td>

              <td className={isExpiringSoon(worker.passportExpiry, 183) ? "expiry-danger" : ""}>
                {worker.passportExpiry || "-"}
              </td>

              <td>{worker.finNo || "-"}</td>

              <td className={isExpiringSoon(worker.coretradeExpiry, 92) ? "expiry-danger" : ""}>
                {worker.coretradeExpiry || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrintWorkers;