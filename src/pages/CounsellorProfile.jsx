import { Link, useParams } from "react-router-dom";
import counsellors from "../data/counsellors";
import "./CounsellorProfile.css";

function CounsellorProfile() {
  const { id } = useParams(); //gets the ID from the URL

  const counsellor = counsellors.find((item) => item.id === Number(id));

  if (!counsellor) {
    return (
      <main className="profile-not-found">
        <div className="section-container">
          <h1>Counsellor not found</h1>

          <p>We couldn't find the counsellor you're looking for.</p>

          <Link to="/counsellors">Back to counsellors</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="counsellor-profile">
      <section className="profile-header">
        <div className="section-container">
          <div className="profile-header-content">
            <div className="profile-image">
              <span>{counsellor.name.charAt(0)}</span>
            </div>

            <div className="profile-intro">
              <span className="section-eyebrow">{counsellor.specialty}</span>

              <h1>{counsellor.name}</h1>

              <p>{counsellor.experience} years of experience</p>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-content">
        <div className="section-container">
          <div className="profile-layout">
            <div className="profile-main">
              <div className="profile-section">
                <h2>About</h2>

                <p>{counsellor.description}</p>

                <p>
                  My approach is centred around creating a respectful
                  environment where clients can explore their concerns, develop
                  greater self-awareness, and work towards meaningful change.
                </p>
              </div>

              <div className="profile-section">
                <h2>Areas of support</h2>

                <div className="profile-tags">
                  <span>{counsellor.specialty}</span>
                  <span>Personal Growth</span>
                  <span>Emotional Wellbeing</span>
                </div>
              </div>
            </div>

            <aside className="profile-booking-card">
              <h2>Ready to talk?</h2>

              <p>
                Book a session with {counsellor.name.split(" ")[0]}
                and take the next step.
              </p>

              <Link
                to={`/counsellors/${counsellor.id}/book`}
                className="profile-book-button"
              >
                Book a Session
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CounsellorProfile;
