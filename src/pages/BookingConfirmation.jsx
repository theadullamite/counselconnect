import { Link, useLocation } from "react-router-dom";
import "./BookingConfirmation.css";

function BookingConfirmation() {
  const location = useLocation();

  const booking = location.state;

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

            <div className="confirmation-actions">
              <Link
                to={`/counsellors/${booking.counsellorId}/book`}
                className="confirmation-back"
              >
                Change booking
              </Link>

              <button
                className="confirmation-submit"
                onClick={() => {
                  console.log("Booking confirmed:", booking);
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BookingConfirmation;
