import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const booking = location.state;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!booking) {
    return (
      <main className="confirmation-not-found">
        <div className="section-container">
          <h1>No booking information found</h1>

          <p>
            Please return to the counsellor directory and start the booking
            process again.
          </p>

          <Link to="/counsellors">Find a Counsellor</Link>
        </div>
      </main>
    );
  }

  async function handleConfirmBooking() {
    if (!user) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");

    // const scheduledDate = new Date(`${booking.date} ${booking.time}`);

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          client_id: user.id,
          counsellor_id: booking.profileId,
          // scheduled_date: scheduledDate.toISOString(),
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      console.error("Error message:", error.message);
      console.error("Error details:", error.details);
      console.error("Error hint:", error.hint);
      console.error("Error code:", error.code);
      setError(error.message);
      setSaving(false);
      return;
    }

    console.log("Appointment created:", data);

    setSaving(false);

    navigate("/client-dashboard");
  }

  return (
    <main className="confirmation-page">
      <section className="confirmation-header">
        <div className="section-container">
          <span className="section-eyebrow">Review your booking</span>

          <h1>Almost there.</h1>

          <p>Please review your session details before continuing.</p>
        </div>
      </section>

      <section className="confirmation-content">
        <div className="section-container">
          <div className="confirmation-card">
            <div className="confirmation-card-heading">
              <h2>Session details</h2>

              <p>Make sure everything looks correct.</p>
            </div>

            <div className="confirmation-details">
              <div className="confirmation-detail">
                <span>Counsellor</span>
                <strong>{booking.counsellor}</strong>
              </div>

              <div className="confirmation-detail">
                <span>Date</span>
                <strong>{booking.date}</strong>
              </div>

              <div className="confirmation-detail">
                <span>Time</span>
                <strong>{booking.time}</strong>
              </div>

              <div className="confirmation-detail">
                <span>Session</span>
                <strong>Online counselling</strong>
              </div>
            </div>

            {error && <p className="confirmation-error">{error}</p>}

            <div className="confirmation-actions">
              <Link
                to={`/counsellors/${booking.counsellorId}/book`}
                className="confirmation-back"
              >
                Change booking
              </Link>

              <button
                className="confirmation-submit"
                onClick={handleConfirmBooking}
                disabled={saving}
              >
                {saving ? "Confirming..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BookingConfirmation;
