import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import counsellors from "../data/counsellors";
import "./Booking.css";

const availableTimes = [
  "9:00 AM",
  "10:30 AM",
  "12:00 PM",
  "2:00 PM",
  "4:00 PM",
];

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const counsellor = counsellors.find((item) => item.id === Number(id));

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (!counsellor) {
    return (
      <main className="booking-not-found">
        <div className="section-container">
          <h1>Counsellor not found</h1>

          <p>We couldn't find the counsellor you're trying to book with.</p>

          <Link to="/counsellors">Back to counsellors</Link>
        </div>
      </main>
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedDate || !selectedTime) {
      return;
    }

    navigate("/booking-confirmation", {
        state: {
            counsellorId: counsellor.id,
            counsellor: counsellor.name,
            date: selectedDate,
            time: selectedTime,
        },
    });
  }

  return (
    <main className="booking-page">
      <section className="booking-header">
        <div className="section-container">
          <Link
            to={`/counsellors/${counsellor.id}`}
            className="booking-back-link"
          >
            ← Back to profile
          </Link>

          <span className="section-eyebrow">Book a session</span>

          <h1>Schedule a session with {counsellor.name}</h1>

          <p>Choose a date and time that works for you.</p>
        </div>
      </section>

      <section className="booking-content">
        <div className="section-container">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="booking-step">
              <div className="booking-step-heading">
                <span>01</span>

                <div>
                  <h2>Choose a date</h2>

                  <p>
                    Select the day you'd like to have your counselling session.
                  </p>
                </div>
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="booking-step">
              <div className="booking-step-heading">
                <span>02</span>

                <div>
                  <h2>Choose a time</h2>

                  <p>Select one of the available session times.</p>
                </div>
              </div>

              <div className="time-options">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={
                      selectedTime === time
                        ? "time-option selected"
                        : "time-option"
                    }
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="booking-summary">
              <h2>Session summary</h2>

              <div className="summary-row">
                <span>Counsellor</span>
                <strong>{counsellor.name}</strong>
              </div>

              <div className="summary-row">
                <span>Date</span>
                <strong>{selectedDate || "Not selected"}</strong>
              </div>

              <div className="summary-row">
                <span>Time</span>
                <strong>{selectedTime || "Not selected"}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="booking-submit"
              disabled={!selectedDate || !selectedTime}
            >
              Continue to Confirmation
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Booking;
