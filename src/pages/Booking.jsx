import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

import counsellors from "../data/counsellors";
import "./Booking.css";

const sessionTimes = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const counsellor = counsellors.find((item) => item.id === Number(id));

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedDate || !counsellor) {
        setAvailableTimes([]);
        return;
      }

      setLoadingAvailability(true);
      setSelectedTime("");

      const date = new Date(`${selectedDate}T00:00:00`);
      const dayOfWeek = date.getDay();

      const { data, error } = await supabase
        .from("availability")
        .select("start_time, end_time")
        .eq("counsellor_id", counsellor.profileId)
        .eq("day_of_week", dayOfWeek);

      if (error) {
        console.error("Error fetching availability:", error);
        setAvailableTimes([]);
        setLoadingAvailability(false);
        return;
      }

      if (!data || data.length === 0) {
        setAvailableTimes([]);
        setLoadingAvailability(false);
        return;
      }

      const startOfDay = `${selectedDate}T00:00:00.000Z`;
      const nextDay = new Date(`${selectedDate}T00:00:00.000Z`);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      const { data: bookedAppointments, error: appointmentsError } =
        await supabase
          .from("appointments")
          .select("scheduled_at")
          .eq("counsellor_id", counsellor.profileId)
          .in("status", ["pending", "confirmed"])
          .gte("scheduled_at", startOfDay)
          .lt("scheduled_at", nextDay.toISOString());

      if (appointmentsError) {
        console.error("Error fetching booked appointments:", appointmentsError);
        setAvailableTimes([]);
        setLoadingAvailability(false);
        return;
      }

      const timesWithinAvailability = sessionTimes.filter((time) => {
        const [timePart, period] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (period === "PM" && hours !== 12) {
          hours += 12;
        }

        if (period === "AM" && hours === 12) {
          hours = 0;
        }

        const slotMinutes = hours * 60 + minutes;

        return data.some((range) => {
          const [startHours, startMinutes] = range.start_time
            .slice(0, 5)
            .split(":")
            .map(Number);

          const [endHours, endMinutes] = range.end_time
            .slice(0, 5)
            .split(":")
            .map(Number);

          const startMinutesTotal = startHours * 60 + startMinutes;

          const endMinutesTotal = endHours * 60 + endMinutes;

          const withinAvailability = data.some((range) => {
            const [startHours, startMinutes] = range.start_time
              .slice(0, 5)
              .split(":")
              .map(Number);

            const [endHours, endMinutes] = range.end_time
              .slice(0, 5)
              .split(":")
              .map(Number);

            const startMinutesTotal = startHours * 60 + startMinutes;

            const endMinutesTotal = endHours * 60 + endMinutes;

            return (
              slotMinutes >= startMinutesTotal && slotMinutes < endMinutesTotal
            );
          });

          if (!withinAvailability) {
            return false;
          }

          const [year, month, day] = selectedDate.split("-").map(Number);

          const slotDateTime = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            0,
            0,
          );

          const isBooked = bookedAppointments?.some((appointment) => {
            const bookedDate = new Date(appointment.scheduled_at);

            return bookedDate.getTime() === slotDateTime.getTime();
          });

          return !isBooked;
        });
      });

      setAvailableTimes(timesWithinAvailability);
      setLoadingAvailability(false);
    }

    fetchAvailability();
  }, [selectedDate, counsellor]);

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
        profileId: counsellor.profileId,
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
                {loadingAvailability && <p>Loading available times...</p>}

                {!loadingAvailability &&
                  selectedDate &&
                  availableTimes.length === 0 && (
                    <p>No available times for this date.</p>
                  )}

                {!loadingAvailability && availableTimes.length > 0 && (
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
                )}
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
