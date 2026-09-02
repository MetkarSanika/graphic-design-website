import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="simple-footer">

      <div className="footer-main">

        <Link to="/" className="footer-brand">
          <span className="footer-gd">SG</span>

          <h2><span className="footer-name">
            Sarang<span>Graphics</span>
          </span></h2>
        </Link>

        <p>
          Creative designs that make your brand stand out.
        </p>

        <div className="footer-nav">

          <Link to="/">Home</Link>

          <Link to="/services">Services</Link>

          <Link to="/portfolio">Portfolio</Link>

          <Link to="/contact">Contact</Link>

        </div>

      </div>


      <div className="footer-line"></div>


      <div className="footer-bottom">

        <span>
          © {new Date().getFullYear()} Sarang Graphics
        </span>

        <span>
          Designed with creativity ✦
        </span>

      </div>

    </footer>
  );
}

export default Footer;