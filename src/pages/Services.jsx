import { Link } from "react-router-dom";

function Services() {
  return (
    <>
      {/* ==========================================
          SERVICES PAGE HERO
      ========================================== */}

      <section className="page-hero services-page-hero">

        <div className="page-hero-content">

          <span className="page-hero-label">
            ✦ WHAT WE DO
          </span>

          <h1>
            Creative services
            <br />
            <span>made for your brand.</span>
          </h1>

          <p>
            From brand identity to social media and marketing
            design, we create visuals that help your business
            stand out.
          </p>

        </div>

        <div className="page-hero-shape">
          <span>SG</span>
        </div>

      </section>


      {/* ==========================================
          SERVICES
      ========================================== */}

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

            <div className="service-icon">
              ◈
            </div>

            <h3>
              Brand Identity
            </h3>

            <p>
              Build a professional and memorable brand with
              logos, colors, typography and complete visual
              identity.
            </p>

            <Link to="/portfolio?category=Branding">
              View Brand Work →
            </Link>

          </div>


          {/* SERVICE 2 */}

          <div className="service-card">

            <div className="service-icon">
              ✦
            </div>

            <h3>
              Social Media Design
            </h3>

            <p>
              Create attractive social media posts, stories,
              advertisements and promotional graphics.
            </p>

            <Link to="/portfolio?category=Social Media">
              View Social Media Work →
            </Link>

          </div>


          {/* SERVICE 3 */}

          <div className="service-card">

            <div className="service-icon">
              ▣
            </div>

            <h3>
              Poster Design
            </h3>

            <p>
              Professional posters, flyers, banners and
              promotional materials designed to attract
              attention.
            </p>

            <Link to="/portfolio?category=Poster Design">
              View Poster Work →
            </Link>

          </div>


          {/* SERVICE 4 */}

          <div className="service-card">

            <div className="service-icon">
              ◆
            </div>

            <h3>
              Logo Design
            </h3>

            <p>
              Unique and memorable logos that represent your
              business and create a strong first impression.
            </p>

            <Link to="/portfolio?category=Logo Design">
              View Logo Work →
            </Link>

          </div>


          {/* SERVICE 5 */}

          <div className="service-card">

            <div className="service-icon">
              ▤
            </div>

            <h3>
              Marketing Design
            </h3>

            <p>
              Creative marketing materials that help promote
              your products, services and business.
            </p>

            <Link to="/portfolio">
              View Marketing Work →
            </Link>

          </div>


          {/* SERVICE 6 */}

          <div className="service-card">

            <div className="service-icon">
              ✧
            </div>

            <h3>
              Custom Design
            </h3>

            <p>
              Have something different in mind? We create
              custom designs based on your requirements.
            </p>

            <Link to="/contact">
              Discuss Your Project →
            </Link>

          </div>

        </div>

      </section>


      {/* ==========================================
          PROCESS
      ========================================== */}

      <section className="why-section">

        <div>

          <span>
            OUR PROCESS
          </span>

          <h2>
            Simple process.
            <br />
            Great results.
          </h2>

        </div>


        <div className="benefits">

          <div>

            <strong>
              01
            </strong>

            <h3>
              Understand
            </h3>

            <p>
              We understand your business, requirements
              and design goals.
            </p>

          </div>


          <div>

            <strong>
              02
            </strong>

            <h3>
              Create
            </h3>

            <p>
              We develop creative concepts and visual
              directions for your project.
            </p>

          </div>


          <div>

            <strong>
              03
            </strong>

            <h3>
              Refine
            </h3>

            <p>
              We take your feedback and refine the design
              until everything feels right.
            </p>

          </div>


          <div>

            <strong>
              04
            </strong>

            <h3>
              Deliver
            </h3>

            <p>
              Your final high-quality design files are
              delivered ready to use.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          CTA
      ========================================== */}

      <section className="cta-section">

        <span>
          LET'S CREATE TOGETHER
        </span>

        <h2>
          Need a design?
        </h2>

        <p>
          Tell us what you need and let's create
          something amazing for your brand.
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

export default Services;