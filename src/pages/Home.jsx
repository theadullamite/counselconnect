import { Link } from "react-router-dom";
import "./Home.css";
import CounsellorCard from "../components/CounsellorCard";

const featuredCounsellors = [
  {
    id: 1,
    name: "Sarah Olaniyi",
    specialty: "Relationship Counselling",
    description:
      "Helping individuals and couples build relationships and communicate more effectively.",
    experience: 8,
  },
  {
    id: 2,
    name: "Micah Adeola",
    specialty: "Career Counselling",
    description:
      "Supporting individuals as they navigate career decisions, transitions, and professional growth.",
    experience: 6,
  },
  {
    id: 3,
    name: "Endurance Etim",
    specialty: "Personal Development",
    description:
      "Helping clients develop self-awareness, confidence, and practical strategies for personal growth.",
    experience: 10,
  },
];

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow">
              Professional counselling, made accessible.
            </span>

            <h1 className="hero-title">
              Find support.
              <br />
              Find your way forward.
            </h1>

            <p className="hero-description">
              Connect with a professional counsellor who can help you navigate
              life's challenges, build healthier relationships, and move forward
              with confidence.
            </p>

            <div className="hero-actions">
              <Link to="/counsellors" className="hero-primary-button">
                Find a Counsellor
              </Link>
              <Link to="/register" className="hero-secondary-button">
                I'm a Counsellor
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-visual-card">
              <p>You're not alone.</p>
              <p>Professional support is closer than you think.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">Simple by design</span>

            <h2 className="section-title">How CounselConnect works</h2>

            <p className="section-description">
              Getting the support you need should be simple.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="how-it-works-card">
              <span className="step-number">01</span>

              <h3>Find a counsellor</h3>

              <p>
                Browse professional counsellors and find someone whose expertise
                matches your needs.
              </p>
            </div>

            <div className="how-it-works-card">
              <span className="step-number">02</span>

              <h3>Book a session</h3>

              <p>
                Choose a convenient time and schedule your counselling session.
              </p>
            </div>

            <div className="how-it-works-card">
              <span className="step-number">03</span>

              <h3>Meet and talk</h3>

              <p>
                Meet your counsellor online and begin working towards meaningful
                change.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-counsellors">
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">Find your counsellor</span>

            <h2 className="section-title">
              The right support can make a difference.
            </h2>

            <p className="section-description">
              Explore counsellors with different areas of expertise and find
              someone who fits your needs.
            </p>
          </div>

          <div className="counsellors-grid">
            {featuredCounsellors.map((counsellor) => (
              <CounsellorCard key={counsellor.id} counsellor={counsellor} />
            ))}
          </div>

          <div className="section-action">
            <a href="/counsellors">View All Counsellors</a>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="section-container">
          <div className="section-heading">
            <span className="section-eyebrow">Why CounselConnect?</span>

            <h2 className="section-title">Support designed around you.</h2>

            <p className="section-description">
              We believe finding professional support should feel simple,
              respectful and convenient.
            </p>
          </div>

          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">01</div>

              <h3>Professional support</h3>

              <p>
                Connect with counsellors who offer support across different
                areas of personal and emotional wellbeing.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon">02</div>

              <h3>Privacy-conscious</h3>

              <p>
                Your counselling experience should be treated with respect,
                discretion and appropriate privacy.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon">03</div>

              <h3>Convenient access</h3>

              <p>
                Discover counsellors, book sessions and manage your appointments
                from one convenient platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta-container">
          <span className="section-eyebrow">Take the first step</span>

          <h2>You don't have to figure everything out alone.</h2>

          <p>Find a counsellor who can support you on your journey.</p>

          <Link to="/counsellors" className="final-cta-button">
            Find a Counsellor
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
