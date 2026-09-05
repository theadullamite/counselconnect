import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function CounsellorDashboard() {
  const { user, profile } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState("");
  const [availability, setAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [availabilityError, setAvailabilityError] = useState("");

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

  async function saveAvailability(dayOfWeek, startTime, endTime) {
    if (!user) return;

    if (!startTime || !endTime) {
      setAvailabilityError("Please select both a start time and an end time.");
      return;
    }

    if (startTime >= endTime) {
      setAvailabilityError("End time must be later than start time.");
      return;
    }

    const existingSlot = availability.find(
      (slot) => slot.day_of_week === dayOfWeek,
    );

    let data;
    let error;

    if (existingSlot) {
      ({ data, error } = await supabase
        .from("availability")
        .update({
          start_time: startTime,
          end_time: endTime,
        })
        .eq("id", existingSlot.id)
        .select()
        .single());
    } else {
      ({ data, error } = await supabase
        .from("availability")
        .insert({
          counsellor_id: user.id,
          day_of_week: dayOfWeek,
          start_time: startTime,
          end_time: endTime,
        })
        .select()
        .single());
    }

    if (error) {
      console.error("Error saving availability:", error);
      setAvailabilityError(error.message);
      return;
    }

    setAvailabilityError("");

    setAvailability((currentAvailability) => {
      const withoutCurrentDay = currentAvailability.filter(
        (slot) => slot.day_of_week !== dayOfWeek,
      );

      return [...withoutCurrentDay, data].sort(
        (a, b) => a.day_of_week - b.day_of_week,
      );
    });
  }

  async function deleteAvailability(dayOfWeek) {
    const existingSlot = availability.find(
      (slot) => slot.day_of_week === dayOfWeek,
    );

    if (!existingSlot) return;

    const { error } = await supabase
      .from("availability")
      .delete()
      .eq("id", existingSlot.id);

    if (error) {
      console.error("Error deleting availability:", error);
      setAvailabilityError(error.message);
      return;
    }

    setAvailability((currentAvailability) =>
      currentAvailability.filter((slot) => slot.day_of_week !== dayOfWeek),
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

  useEffect(() => {
    async function fetchAvailability() {
      if (!user) {
        setLoadingAvailability(false);
        return;
      }

      const { data, error } = await supabase
        .from("availability")
        .select("id, day_of_week, start_time, end_time")
        .eq("counsellor_id", user.id)
        .order("day_of_week", { ascending: true });

      if (error) {
        console.error("Error fetching availability:", error);
        setAvailabilityError(error.message);
        setLoadingAvailability(false);
        return;
      }

      setAvailability(data);
      setLoadingAvailability(false);
    }

    fetchAvailability();
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

            <strong>{upcomingAppointments.length}</strong>
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

        <section className="dashboard-availability">
          <div className="dashboard-section-heading">
            <h2>My Availability</h2>
            <p>
              Set the days and times when clients can book counselling sessions.
            </p>
          </div>

          {loadingAvailability && <p>Loading availability...</p>}

          {availabilityError && (
            <p className="dashboard-error">{availabilityError}</p>
          )}

          {!loadingAvailability && (
            <div className="availability-list">
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day, dayIndex) => {
                const existingSlot = availability.find(
                  (slot) => slot.day_of_week === dayIndex,
                );

                return (
                  <div className="availability-card" key={dayIndex}>
                    <div className="availability-day">
                      <h3>{day}</h3>

                      <span>{existingSlot ? "Available" : "Unavailable"}</span>
                    </div>

                    <div className="availability-times">
                      <label>
                        Start time
                        <input
                          type="time"
                          defaultValue={
                            existingSlot?.start_time?.slice(0, 5) || ""
                          }
                          id={`start-${dayIndex}`}
                        />
                      </label>

                      <label>
                        End time
                        <input
                          type="time"
                          defaultValue={
                            existingSlot?.end_time?.slice(0, 5) || ""
                          }
                          id={`end-${dayIndex}`}
                        />
                      </label>
                    </div>

                    <div className="availability-actions">
                      <button
                        type="button"
                        onClick={() => {
                          const startTime = document.getElementById(
                            `start-${dayIndex}`,
                          ).value;

                          const endTime = document.getElementById(
                            `end-${dayIndex}`,
                          ).value;

                          saveAvailability(dayIndex, startTime, endTime);
                        }}
                      >
                        Save
                      </button>

                      {existingSlot && (
                        <button
                          type="button"
                          onClick={() => deleteAvailability(dayIndex)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-appointments">
          {/* Upcoming Sessions */}
          <div className="dashboard-section-heading">
            <h2>Upcoming Sessions</h2>
          </div>

          {loadingAppointments && <p>Loading appointments...</p>}

          {appointmentError && (
            <p className="dashboard-error">{appointmentError}</p>
          )}

          {!loadingAppointments &&
            !appointmentError &&
            upcomingAppointments.length === 0 && (
              <div className="dashboard-empty-state">
                <h3>No upcoming sessions</h3>
                <p>You don't have any upcoming counselling sessions.</p>
              </div>
            )}

          {!loadingAppointments &&
            !appointmentError &&
            upcomingAppointments.length > 0 && (
              <div className="appointments-list">
                {upcomingAppointments.map((appointment) => (
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

          {/* Session History */}
          <div className="dashboard-section-heading">
            <h2>Session History</h2>
          </div>

          {!loadingAppointments &&
            !appointmentError &&
            appointmentHistory.length === 0 && (
              <div className="dashboard-empty-state">
                <h3>No session history</h3>
                <p>Your completed and cancelled sessions will appear here.</p>
              </div>
            )}

          {!loadingAppointments &&
            !appointmentError &&
            appointmentHistory.length > 0 && (
              <div className="appointments-list">
                {appointmentHistory.map((appointment) => (
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
