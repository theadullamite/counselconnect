import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>CounselConnect</h2>

          <p>
            Connecting people with professional counsellors for meaningful
            support and personal growth.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>

          <Link to="/counsellors">Find a Counsellor</Link>

          <Link to="/about">About Us</Link>
        </div>

        <div className="footer-column">
          <h3>For Counsellors</h3>

          <Link to="/register">Join CounselConnect</Link>
        </div>

        <div className="footer-column">
          <h3>Support</h3>

          <a href="#">Help Centre</a>

          <a href="#">Contact Us</a>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 CounselConnect. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
