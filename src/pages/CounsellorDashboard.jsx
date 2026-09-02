import { useAuth } from "../context/AuthContext";

function CounsellorDashboard() {
  const { profile } = useAuth();

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        <span className="section-eyebrow">
          Counsellor Dashboard
        </span>

        <h1>
          Welcome, {profile?.full_name}
        </h1>

        <p>
          This is your CounselConnect counsellor dashboard.
        </p>

      </div>

    </main>
  );
}

export default CounsellorDashboard;