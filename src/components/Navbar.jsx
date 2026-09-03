import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      {/* LOGO */}
      <Link
        to="/"
        className="logo"
        onClick={closeMenu}
      >
        <Logo />
      </Link>

      {/* DESKTOP MENU */}
      <nav className="desktop-nav">

        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/services" onClick={closeMenu}>
          Services
        </Link>

        <Link to="/portfolio" onClick={closeMenu}>
          Portfolio
        </Link>

        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>

      </nav>

      {/* START PROJECT */}
      <Link
        to="/contact"
        className="nav-button"
        onClick={closeMenu}
      >
        Start a Project →
      </Link>

      {/* MOBILE BUTTON */}
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* MOBILE MENU */}
      {menuOpen && (
        <nav className="mobile-nav">

          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/services" onClick={closeMenu}>
            Services
          </Link>

          <Link to="/portfolio" onClick={closeMenu}>
            Portfolio
          </Link>

          <Link to="/contact" onClick={closeMenu}>
            Contact
          </Link>

          <Link
            to="/contact"
            className="mobile-project-button"
            onClick={closeMenu}
          >
            Start a Project →
          </Link>

        </nav>
      )}

    </header>
  );
}

export default Navbar;