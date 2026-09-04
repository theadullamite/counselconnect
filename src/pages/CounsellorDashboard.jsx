import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function CounsellorDashboard() {
  const { user, profile } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState("");

  async function updateAppointmentStatus(appointmentId, newStatus) {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        status: newStatus,
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      setAppointmentError(error.message);
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentId ? data : appointment,
      ),
    );
  }

  useEffect(() => {
    async function fetchAppointments() {
      if (!user) {
        setLoadingAppointments(false);
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          client:profiles!appointments_client_fk (
          full_name
          )
          `,
        )
        .eq("counsellor_id", user.id)
        .order("scheduled_at", { ascending: true });

      if (error) {
        console.error("Error fetching counsellor appointments:", error);
        setAppointmentError(error.message);
        setLoadingAppointments(false);
        return;
      }

      setAppointments(data);
      setLoadingAppointments(false);
    }

    fetchAppointments();
  }, [user]);

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-header">
          <span className="section-eyebrow">Counsellor Dashboard</span>

          <h1>Welcome, {profile?.full_name}</h1>

          <p>
            Manage your counselling sessions, appointments, and client
            connections from one place.
          </p>
        </section>

        <section className="dashboard-cards">
          <div className="dashboard-card">
            <h2>My Appointments</h2>

            <p>View your upcoming counselling sessions.</p>

            <strong>{appointments.length}</strong>
          </div>

          <div className="dashboard-card">
            <h2>My Profile</h2>

            <p>View and manage your CounselConnect profile information.</p>

            <span>Coming soon</span>
          </div>

          <div className="dashboard-card">
            <h2>Availability</h2>

            <p>Manage the days and times when clients can book sessions.</p>

            <span>Coming soon</span>
          </div>
        </section>

        <section className="dashboard-appointments">
          <div className="dashboard-section-heading">
            <h2>My Appointments</h2>
          </div>

          {loadingAppointments && <p>Loading appointments...</p>}

          {appointmentError && (
            <p className="dashboard-error">{appointmentError}</p>
          )}

          {!loadingAppointments &&
            !appointmentError &&
            appointments.length === 0 && (
              <div className="dashboard-empty-state">
                <h3>No upcoming appointments</h3>

                <p>You don't have any counselling sessions booked yet.</p>
              </div>
            )}

          {!loadingAppointments &&
            !appointmentError &&
            appointments.length > 0 && (
              <div className="appointments-list">
                {appointments.map((appointment) => (
                  <div className="appointment-card" key={appointment.id}>
                    <h3>
                      Session with {appointment.client?.full_name || "Client"}
                    </h3>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.scheduled_at).toLocaleString()}
                    </p>

                    <p>
                      <strong>Status:</strong> {appointment.status}
                    </p>

                    {appointment.status === "pending" && (
                      <div className="appointment-actions">
                        <button
                          type="button"
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "confirmed")
                          }
                        >
                          Confirm
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "cancelled")
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    {appointment.status === "confirmed" && (
                      <div className="appointment-actions">
                        <button
                          type="button"
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, "completed")
                          }
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default CounsellorDashboard;
