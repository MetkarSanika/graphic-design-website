import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000";

  // =====================================
  // FETCH PORTFOLIO FROM BACKEND
  // =====================================

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API}/api/portfolio`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load portfolio."
        );
      }

      setProjects(data);
    } catch (error) {
      console.error(
        "Portfolio loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD PORTFOLIO
  // =====================================

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // =====================================
  // FILTERS
  // =====================================

  const categories = [
    "All",
    "Logo Design",
    "Social Media",
    "Poster Design",
    "Banner Design",
    "Branding",
    "Business Card Design",
    "Flyer & Brochure Design",
    "Other",
  ];

  // =====================================
  // FILTER PROJECTS
  // =====================================

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter(
          (project) =>
            project.category === activeFilter
        );

  return (
    <div className="portfolio-page">

      {/* =====================================
          HEADER
      ===================================== */}
{/* =====================================
    NEW PORTFOLIO HERO
===================================== */}

<section className="portfolio-page-hero">

  <div className="portfolio-hero-content">

    <span className="portfolio-hero-label">
      ✦ OUR WORK
    </span>

    <h1>
      Designs that
      <br />
      <span>make an impression.</span>
    </h1>

    <p>
      Explore our collection of creative designs,
      crafted to help brands look professional,
      memorable and unique.
    </p>

  </div>


  {/* DECORATIVE DESIGN */}

  <div className="portfolio-hero-art">

    <div className="portfolio-art-circle"></div>

    <div className="portfolio-art-box">
      <span>SG</span>
    </div>

    <div className="portfolio-art-text">
      CREATIVE
      <br />
      STUDIO
    </div>

  </div>

</section>


      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="portfolio-content">

        {/* =====================================
            FILTERS
        ===================================== */}

        <div className="portfolio-filters">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter ${
                activeFilter === category
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(category)
              }
            >
              {category}
            </button>
          ))}

        </div>


        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (
          <div className="portfolio-message">
            Loading portfolio...
          </div>
        )}


        {/* =====================================
            EMPTY
        ===================================== */}

        {!loading &&
          filteredProjects.length === 0 && (
            <div className="portfolio-message">
              <h3>
                No designs available
              </h3>

              <p>
                Portfolio designs will appear
                here after they are added from
                the Admin Panel.
              </p>
            </div>
          )}


        {/* =====================================
            GALLERY
        ===================================== */}

        {!loading &&
          filteredProjects.length > 0 && (

            <div className="portfolio-gallery">

              {filteredProjects.map(
                (project) => (

                  <div
                    className="portfolio-card"
                    key={project.id}
                  >

                    {/* IMAGE */}

                    <div className="portfolio-image">

                      <img
                        src={project.image_url}
                        alt={project.title}
                      />

                      <div
                        className="portfolio-overlay"
                        onClick={() =>
                          setSelectedProject(
                            project
                          )
                        }
                      >
                       <button className="view-project">
  <span className="view-project-icon">↗</span>
  <span>View Project</span>
</button>
                      </div>

                    </div>


                    {/* INFO */}

                    <div className="portfolio-info">

                      <div>

                        <span>
                          {project.category}
                        </span>

                        <h3>
                          {project.title}
                        </h3>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>


      {/* =====================================
          CTA
      ===================================== */}

      <div className="portfolio-cta">

        <h2>
          Have a project in mind?
        </h2>

        <p>
          Let's create something amazing
          together.
        </p>

        <Link to="/contact">
          Start a Project →
        </Link>

      </div>


      {/* =====================================
          PROJECT POPUP
      ===================================== */}

      {selectedProject && (

        <div
          className="project-modal"
          onClick={() =>
            setSelectedProject(null)
          }
        >

          <div
            className="project-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE BUTTON */}

            <button
              className="project-close"
              onClick={() =>
                setSelectedProject(null)
              }
              aria-label="Close project"
            >
              ✕
            </button>


            {/* PROJECT IMAGE */}

            <img
              src={
                selectedProject.image_url
              }
              alt={
                selectedProject.title
              }
            />


            {/* PROJECT INFORMATION */}

            <div className="project-modal-info">

              <span>
                {selectedProject.category}
              </span>

              <h2>
                {selectedProject.title}
              </h2>

              <p>
                {selectedProject.description ||
                  `A professional ${selectedProject.category.toLowerCase()} design created by SarangGraphics.`}
              </p>

              <Link
                to={`/contact?service=${encodeURIComponent(
                  selectedProject.category
                )}`}
                onClick={() =>
                  setSelectedProject(null)
                }
              >
                Start a Project →
              </Link>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Portfolio;