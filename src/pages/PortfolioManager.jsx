import { useEffect, useState } from "react";

function PortfolioManager() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Logo Design");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // =====================================
  // BACKEND API
  // =====================================

  const API = "";

  // =====================================
  // CATEGORIES
  // =====================================

  const categories = [
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
  // FETCH PORTFOLIO
  // =====================================

  const fetchPortfolio = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/portfolio`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load portfolio."
        );
      }

      setPortfolio(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Portfolio fetch error:", error);

      alert(
        error.message ||
          "Unable to connect to backend."
      );

      setPortfolio([]);
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
  // IMAGE SELECT
  // =====================================

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert(
        "Please select a JPG, PNG or WebP image."
      );

      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert(
        "Image size must be less than 5 MB."
      );

      e.target.value = "";
      return;
    }

    setImage(selectedFile);

    const imageUrl =
      URL.createObjectURL(selectedFile);

    setPreview(imageUrl);
  };

  // =====================================
  // RESET FORM
  // =====================================

  const resetForm = () => {
    setTitle("");
    setCategory("Logo Design");
    setImage(null);
    setPreview("");
    setEditingId(null);

    const fileInput =
      document.getElementById(
        "portfolio-image"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================
  // ADD / UPDATE PORTFOLIO
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a design title.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!editingId && !image) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();

    formData.append(
      "title",
      title.trim()
    );

    formData.append(
      "category",
      category
    );

    // IMPORTANT:
    // Backend expects the field name "image"
    if (image) {
      formData.append(
        "image",
        image
      );
    }

    try {
      const url = editingId
        ? `${API}/api/portfolio/${editingId}`
        : `${API}/api/portfolio`;

      const response = await fetch(url, {
        method: editingId
          ? "PUT"
          : "POST",
        body: formData,
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Portfolio operation failed."
        );
      }

      alert(
        editingId
          ? "Portfolio updated successfully."
          : "Portfolio added successfully."
      );

      resetForm();

      await fetchPortfolio();
    } catch (error) {
      console.error(
        "Portfolio submit error:",
        error
      );

      alert(
        error.message ||
          "Unable to connect to backend."
      );
    }
  };

  // =====================================
  // EDIT
  // =====================================

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setImage(null);
    setPreview(item.image_url);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================
  // DELETE
  // =====================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this design?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/portfolio/${id}`,
        {
          method: "DELETE",
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete design."
        );
      }

      setPortfolio((previous) =>
        previous.filter(
          (item) =>
            item.id !== id
        )
      );

      alert(
        "Portfolio design deleted successfully."
      );
    } catch (error) {
      console.error(
        "Portfolio delete error:",
        error
      );

      alert(
        error.message ||
          "Unable to connect to backend."
      );
    }
  };

  // =====================================
  // SEARCH + FILTER
  // =====================================

  const filteredPortfolio =
    portfolio.filter((item) => {
      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        item.title
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        filterCategory === "All" ||
        item.category ===
          filterCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // =====================================
  // UI
  // =====================================

  return (
    <div className="portfolio-manager">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="portfolio-manager-header">

        <div>
          <span>ADMIN</span>

          <h1>
            Portfolio Manager
          </h1>

          <p>
            Add and manage your
            portfolio designs.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={fetchPortfolio}
        >
          ↻ Refresh
        </button>

      </div>

      {/* ================================= */}
      {/* ADD / EDIT FORM */}
      {/* ================================= */}

      <div className="portfolio-manager-form">

        <div className="portfolio-form-heading">

          <span>
            {editingId
              ? "EDIT DESIGN"
              : "ADD NEW DESIGN"}
          </span>

          <h2>
            {editingId
              ? "Update Portfolio"
              : "Add Portfolio Design"}
          </h2>

        </div>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}

          <div className="portfolio-form-group">

            <label>
              Design Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Example: Modern Logo"
              required
            />

          </div>

          {/* CATEGORY */}

          <div className="portfolio-form-group">

            <label>
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              required
            >
              {categories.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

          </div>

          {/* IMAGE */}

          <div className="portfolio-form-group">

            <label>
              {editingId
                ? "Change Image (Optional)"
                : "Choose Design Image"}
            </label>

            <input
              id="portfolio-image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={
                handleImageChange
              }
            />

            <small>
              JPG, PNG or WebP —
              maximum 5 MB.
            </small>

          </div>

          {/* PREVIEW */}

          {preview && (
            <div className="portfolio-upload-preview">

              <img
                src={preview}
                alt="Design preview"
              />

            </div>
          )}

          {/* BUTTONS */}

          <div className="portfolio-form-buttons">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId
                ? "Update Design →"
                : "Add Design →"}
            </button>

            {editingId && (
              <button
                type="button"
                className="admin-reset-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* ================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================= */}

      <div className="portfolio-manager-toolbar">

        <input
          type="text"
          placeholder="Search designs..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(
              e.target.value
            )
          }
        >
          <option value="All">
            All Categories
          </option>

          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}
        </select>

      </div>

      {/* ================================= */}
      {/* COUNT */}
      {/* ================================= */}

      <div className="portfolio-manager-count">

        <span>
          PORTFOLIO DESIGNS
        </span>

        <strong>
          {filteredPortfolio.length}
        </strong>

      </div>

      {/* ================================= */}
      {/* LOADING */}
      {/* ================================= */}

      {loading && (
        <div className="admin-message">
          Loading portfolio...
        </div>
      )}

      {/* ================================= */}
      {/* EMPTY */}
      {/* ================================= */}

      {!loading &&
        filteredPortfolio.length === 0 && (
          <div className="admin-message">

            {portfolio.length === 0
              ? "No portfolio designs added yet."
              : "No designs match your search."}

          </div>
        )}

      {/* ================================= */}
      {/* PORTFOLIO GRID */}
      {/* ================================= */}

      {!loading &&
        filteredPortfolio.length > 0 && (
          <div className="portfolio-manager-grid">

            {filteredPortfolio.map(
              (item) => (
                <div
                  className="portfolio-manager-card"
                  key={item.id}
                >

                  {/* IMAGE */}

                  <div className="portfolio-manager-image">

                    <img
                      src={item.image_url}
                      alt={item.title}
                    />

                  </div>

                  {/* CONTENT */}

                  <div className="portfolio-manager-card-content">

                    <span>
                      {item.category}
                    </span>

                    <h3>
                      {item.title}
                    </h3>

                    <small>
                      {item.created_at
                        ? new Date(
                            item.created_at
                          ).toLocaleDateString()
                        : ""}
                    </small>

                    {/* ACTIONS */}

                    <div className="portfolio-manager-actions">

                      <button
                        type="button"
                        className="view-button"
                        onClick={() =>
                          window.open(
                            item.image_url,
                            "_blank"
                          )
                        }
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          handleEdit(
                            item
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}

export default PortfolioManager;