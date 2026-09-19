import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import { signOut } from "../lib/auth";

function Navbar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          CounselConnect
        </Link>

        <button
          className="navbar-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <div className={`navbar-links ${menuOpen ? "navbar-links-open" : ""}`}>
          <Link to="/counsellors" onClick={closeMenu}>
            Find a Counsellor
          </Link>

          <Link to="/about" onClick={closeMenu}>
            About
          </Link>

          {user ? (
            <button
              type="button"
              className="navbar-logout"
              onClick={async () => {
                await signOut();
                closeMenu();
              }}
            >
              Log Out
            </button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Log In
              </Link>

              <Link to="/register" className="navbar-cta" onClick={closeMenu}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
