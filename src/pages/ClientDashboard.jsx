import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function ClientDashboard() {
  const { user, profile } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState("");

  async function cancelAppointment(appointmentId) {
    const { data, error } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
      })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) {
      console.error("Error cancelling appointment:", error);
      setAppointmentError(error.message);
      return;
    }

    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentId ? data : appointment,
      ),
    );
  }

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      (appointment.status === "pending" ||
        appointment.status === "confirmed") &&
      new Date(appointment.scheduled_at) > new Date(),
  );

  const appointmentHistory = appointments.filter(
    (appointment) =>
      appointment.status === "completed" ||
      appointment.status === "cancelled" ||
      new Date(appointment.scheduled_at) <= new Date(),
  );

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
          counsellor:profiles!appointments_counsellor_fk (
          full_name
          )
          `,
        )
        .eq("client_id", user.id)
        .order("scheduled_at", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
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

            <p>View and manage your counselling sessions.</p>

            <strong>{upcomingAppointments.length}</strong>
          </div>

          <div className="dashboard-card">
            <h2>My Profile</h2>

            <p>View and manage your CounselConnect profile information.</p>

            <span>Coming soon</span>
          </div>
        </section>

        <section className="dashboard-appointments">
          {/* Upcoming Appointments */}
          <div className="dashboard-section-heading">
            <h2>Upcoming Appointments</h2>
          </div>

          {loadingAppointments && <p>Loading appointments...</p>}

          {appointmentError && (
            <p className="dashboard-error">{appointmentError}</p>
          )}

          {!loadingAppointments &&
            !appointmentError &&
            upcomingAppointments.length === 0 && (
              <div className="dashboard-empty-state">
                <h3>No upcoming appointments</h3>
                <p>You don't have any upcoming counselling sessions.</p>

                <a href="/counsellors">Find a Counsellor</a>
              </div>
            )}

          {!loadingAppointments &&
            !appointmentError &&
            upcomingAppointments.length > 0 && (
              <div className="appointments-list">
                {upcomingAppointments.map((appointment) => (
                  <div className="appointment-card" key={appointment.id}>
                    <h3>
                      Session with{" "}
                      {appointment.counsellor?.full_name || "Counsellor"}
                    </h3>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.scheduled_at).toLocaleString()}
                    </p>

                    <p>
                      <strong>Status:</strong> {appointment.status}
                    </p>

                    <div className="appointment-actions">
                      <button
                        type="button"
                        onClick={() => cancelAppointment(appointment.id)}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Appointment History */}
          <div className="dashboard-section-heading">
            <h2>Appointment History</h2>
          </div>

          {!loadingAppointments &&
            !appointmentError &&
            appointmentHistory.length === 0 && (
              <div className="dashboard-empty-state">
                <h3>No appointment history</h3>
                <p>
                  Your completed and cancelled appointments will appear here.
                </p>
              </div>
            )}

          {!loadingAppointments &&
            !appointmentError &&
            appointmentHistory.length > 0 && (
              <div className="appointments-list">
                {appointmentHistory.map((appointment) => (
                  <div className="appointment-card" key={appointment.id}>
                    <h3>
                      Session with{" "}
                      {appointment.counsellor?.full_name || "Counsellor"}
                    </h3>

                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(appointment.scheduled_at).toLocaleString()}
                    </p>

                    <p>
                      <strong>Status:</strong> {appointment.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}

export default ClientDashboard;
