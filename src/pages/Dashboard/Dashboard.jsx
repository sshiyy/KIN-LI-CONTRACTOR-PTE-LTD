import "./Dashboard.css";

function Dashboard({ user }) {
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

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>
            {getGreeting()}
            {user?.name ? `, ${user.name}` : ""} 👋
          </h1>

          <p className="dashboard-date">
            Today is {getTodayDate()}.
          </p>

          <p className="dashboard-subtitle">
            Have a productive day managing your workforce.
          </p>
        </div>
      </div>

      <div className="dashboard-divider"></div>

      {/* Summary cards go here */}
    </div>
  );
}

export default Dashboard;