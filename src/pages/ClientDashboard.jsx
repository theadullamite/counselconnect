import { useAuth } from "../context/AuthContext";

function ClientDashboard() {
  const { profile } = useAuth();

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <span className="section-eyebrow">Client Dashboard</span>

          <h1>Welcome, {profile?.full_name}</h1>

          <p>
            Manage your counselling journey, appointments, and connections with
            counsellors from one place.
          </p>
        </section>

        <section className="dashboard-cards">
          <div className="dashboard-card">
            <h2>Find a Counsellor</h2>
            <p>
              Explore qualified counsellors and find someone who matches your
              needs.
            </p>
            <a href="/counsellors">Find a Counsellor</a>
          </div>

          <div className="dashboard-card">
            <h2>My Appointments</h2>
            <p>View and manage your upcoming counselling sessions.</p>
            <span>Coming soon</span>
          </div>

          <div className="dashboard-card">
            <h2>My Profile</h2>
            <p>View and manage your CounselConnect profile information.</p>
            <span>Coming soon</span>
          </div>
        </section>

        <section className="dashboard-empty-state">
          <h2>No upcoming appointments</h2>
          <p>
            When you book a counselling session, your upcoming appointments will
            appear here.
          </p>

          <a href="/counsellors">Book a Session</a>
        </section>
      </div>
    </main>
  );
}

export default ClientDashboard;
