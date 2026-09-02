import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const [portfolio, setPortfolio] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ==========================================
  // GET PORTFOLIO FROM BACKEND
  // ==========================================

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/portfolio"
        );

        const data = await response.json();

        if (response.ok) {
          setPortfolio(data);
        }
      } catch (error) {
        console.error(
          "Failed to load portfolio:",
          error
        );
      }
    };

    fetchPortfolio();
  }, []);

  // ==========================================
  // AUTOMATIC SLIDER
  // ==========================================

  useEffect(() => {
    if (portfolio.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((previous) => {
        return (previous + 1) % portfolio.length;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [portfolio.length]);

  // ==========================================
  // NEXT SLIDE
  // ==========================================

  const nextSlide = () => {
    if (portfolio.length === 0) {
      return;
    }

    setCurrentSlide((previous) => {
      return (previous + 1) % portfolio.length;
    });
  };

  // ==========================================
  // PREVIOUS SLIDE
  // ==========================================

  const previousSlide = () => {
    if (portfolio.length === 0) {
      return;
    }

    setCurrentSlide((previous) => {
      return (
        (previous - 1 + portfolio.length) %
        portfolio.length
      );
    });
  };

  return (
    <>
      {/* =================================================
          TOP PORTFOLIO SLIDER
      ================================================= */}
{/* =================================================
    PREMIUM CREATIVE SLIDER
================================================= */}

{portfolio.length > 0 && (
  <section className="creative-slider">

    <div className="creative-slider-wrapper">

      {/* IMAGE */}

      <img
        key={portfolio[currentSlide].id}
        src={portfolio[currentSlide].image_url}
        alt={portfolio[currentSlide].title}
        className="creative-slider-image"
      />

      {/* DARK GRADIENT */}

      <div className="creative-slider-gradient"></div>


      {/* TOP LABEL */}

      <div className="creative-slider-label">
        SARANG<span>GRAPHICS</span>
      </div>


      {/* PROJECT CONTENT */}

      <div className="creative-slider-content">

        <div className="creative-slider-category">
          {portfolio[currentSlide].category}
        </div>

        <h1>
          {portfolio[currentSlide].title}
        </h1>

        <p>
          Creative design crafted to give your
          brand a powerful visual identity.
        </p>

        <Link
          to="/portfolio"
          className="creative-slider-button"
        >
          Explore Project
          <span>↗</span>
        </Link>

      </div>


      {/* SLIDE NUMBER */}

      <div className="creative-slider-number">

        <strong>
          {String(currentSlide + 1).padStart(2, "0")}
        </strong>

        <span>
          /
        </span>

        {String(portfolio.length).padStart(2, "0")}

      </div>


      {/* ARROWS */}

      <div className="creative-slider-arrows">

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous project"
        >
          ←
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next project"
        >
          →
        </button>

      </div>


      {/* PROGRESS */}

      <div className="creative-slider-progress">

        <div
          className="creative-slider-progress-bar"
          style={{
            width: `${
              ((currentSlide + 1) /
                portfolio.length) *
              100
            }%`,
          }}
        ></div>

      </div>

    </div>


    {/* DOTS */}

    <div className="creative-slider-dots">

      {portfolio.map((item, index) => (

        <button
          key={item.id || index}
          type="button"
          className={
            index === currentSlide
              ? "active"
              : ""
          }
          onClick={() =>
            setCurrentSlide(index)
          }
          aria-label={`Go to project ${
            index + 1
          }`}
        ></button>

      ))}

    </div>

  </section>
)}
      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            ✦ Creative Graphic Design Studio
          </div>

          <h1>
            We Create Designs
            <br />
            That Make Brands{" "}
            <span>Stand Out.</span>
          </h1>

          <p>
            We help businesses, creators and brands
            build a strong visual identity through
            creative and professional design.
          </p>

          <div className="hero-buttons">

            <Link
              to="/contact"
              className="primary-button"
            >
              Start a Project →
            </Link>

            <Link
              to="/portfolio"
              className="secondary-button"
            >
              View Our Work
            </Link>

          </div>

        </div>


        {/* SAMPLE DESIGN */}

        <div className="hero-card">

          <div className="design-preview">

            <div className="preview-top">

              <span>
                SARANG
              </span>

              <span>
                GRAPHICS
              </span>

            </div>

            <div className="preview-center">

              <small>
                CREATIVE
              </small>

              <h2>
                DESIGN
              </h2>

              <div className="preview-line"></div>

              <p>
                Your Brand.
                <br />
                Your Story.
              </p>

            </div>

            <div className="preview-bottom">

              <span>
                LOGO
              </span>

              <span>
                BRANDING
              </span>

              <span>
                SOCIAL MEDIA
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          SERVICES
      ================================================= */}

      <section className="services-section">

        <div className="section-heading">

          <span>
            OUR SERVICES
          </span>

          <h2>
            Everything your brand
            <br />
            needs to look better.
          </h2>

        </div>


        <div className="service-grid">


          {/* SERVICE 1 */}

          <div className="service-card">

            <div
              style={{
                fontSize: "35px"
              }}
            >
              ◈
            </div>

            <h3>
              Brand Identity
            </h3>

            <p>
              Build a professional and memorable
              brand with logos, colors, typography
              and complete visual identity.
            </p>

            <Link to="/services">
              Explore Service →
            </Link>

          </div>


          {/* SERVICE 2 */}

          <div className="service-card">

            <div
              style={{
                fontSize: "35px"
              }}
            >
              ✦
            </div>

            <h3>
              Social Media Design
            </h3>

            <p>
              Create attractive social media posts,
              stories, advertisements and
              promotional graphics.
            </p>

            <Link to="/services">
              Explore Service →
            </Link>

          </div>


          {/* SERVICE 3 */}

          <div className="service-card">

            <div
              style={{
                fontSize: "35px"
              }}
            >
              ▣
            </div>

            <h3>
              Marketing Design
            </h3>

            <p>
              Professional posters, flyers, banners,
              brochures and promotional materials
              for your business.
            </p>

            <Link to="/services">
              Explore Service →
            </Link>

          </div>

        </div>

      </section>


      {/* =================================================
          FEATURED WORK
      ================================================= */}

      <section className="portfolio-section">

        <div className="section-heading">

          <span>
            FEATURED WORK
          </span>

          <h2>
            Designs that make
            <br />
            brands stand out.
          </h2>

        </div>


        <div className="portfolio-grid">


          {/* BRAND IDENTITY */}

          <Link
            to="/portfolio?category=Branding"
            className="portfolio-item"
          >

            <div className="portfolio-placeholder">
              Brand Identity
            </div>

          </Link>


          {/* SOCIAL MEDIA */}

          <Link
            to="/portfolio?category=Social Media Design"
            className="portfolio-item"
          >

            <div className="portfolio-placeholder">
              Social Media
            </div>

          </Link>


          {/* POSTER */}

          <Link
            to="/portfolio?category=Poster Design"
            className="portfolio-item"
          >

            <div className="portfolio-placeholder">
              Poster Design
            </div>

          </Link>


          {/* LOGO */}

          <Link
            to="/portfolio?category=Logo Design"
            className="portfolio-item"
          >

            <div className="portfolio-placeholder">
              Logo Design
            </div>

          </Link>

        </div>


        <div className="center-button">

          <Link
            to="/portfolio"
            className="primary-button"
          >
            View Full Portfolio →
          </Link>

        </div>

      </section>


      {/* =================================================
          WHY CHOOSE US
      ================================================= */}

      <section className="why-section">

        <div>

          <span>
            WHY CHOOSE US
          </span>

          <h2>
            Good design is more
            <br />
            than just looking good.
          </h2>

        </div>


        <div className="benefits">


          {/* BENEFIT 1 */}

          <div>

            <strong>
              01
            </strong>

            <h3>
              Creative & Original
            </h3>

            <p>
              Every project gets a unique visual
              direction designed specifically
              for your brand.
            </p>

          </div>


          {/* BENEFIT 2 */}

          <div>

            <strong>
              02
            </strong>

            <h3>
              Professional Quality
            </h3>

            <p>
              Clean, modern and high-quality
              designs that make your business
              look professional.
            </p>

          </div>


          {/* BENEFIT 3 */}

          <div>

            <strong>
              03
            </strong>

            <h3>
              Client Focused
            </h3>

            <p>
              We understand your requirements
              and work closely with you throughout
              the project.
            </p>

          </div>


          {/* BENEFIT 4 */}

          <div>

            <strong>
              04
            </strong>

            <h3>
              Fast & Reliable
            </h3>

            <p>
              We respect deadlines and deliver
              your designs within the agreed
              timeline.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          TESTIMONIAL
      ================================================= */}

      <section
        style={{
          padding: "100px 7%"
        }}
      >

        <div className="test-card">

          <h2>
            "Great design makes a great
            first impression."
          </h2>

          <p>
            We believe every business deserves
            a strong visual identity that people
            remember.
          </p>

          <strong>
            — SarangGraphics
          </strong>

        </div>

      </section>


      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="cta-section">

        <span>
          LET'S CREATE TOGETHER
        </span>

        <h2>
          Have a design idea?
        </h2>

        <p>
          Tell us about your project and let's
          turn your idea into something amazing.
        </p>

        <Link
          to="/contact"
          className="primary-button"
        >
          Start Your Project →
        </Link>

      </section>

    </>
  );
}

export default Home;