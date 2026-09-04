const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// ======================================
// PORT & BASE URL
// ======================================

const PORT = process.env.PORT || 5000;

const BASE_URL =
  process.env.BASE_URL || `http://localhost:${PORT}`;

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());
app.use(express.json());

// ======================================
// UPLOADS FOLDER
// ======================================

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ======================================
// SERVE UPLOADED IMAGES
// ======================================

app.use("/uploads", express.static(uploadDir));

// ======================================
// MYSQL CONNECTION - AIVEN
// ======================================

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },
});

// ======================================
// DATABASE CONNECTION
// ======================================

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
    return;
  }

  console.log("MySQL connected successfully");
});

// ======================================
// MULTER UPLOAD CONFIGURATION
// ======================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1000000000) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// ======================================
// IMAGE FILTER
// ======================================

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WebP images are allowed."
      )
    );
  }
};

// ======================================
// MULTER
// ======================================

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {
  res.send("SarangGraphics Backend Running");
});

// ======================================
// CONTACT - ADD
// ======================================

app.post("/api/contact", (req, res) => {
  const {
    name,
    email,
    phone,
    service,
    message,
  } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !service ||
    !message
  ) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  const sql = `
    INSERT INTO contacts
    (name, email, phone, service, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      email,
      phone,
      service,
      message,
    ],
    (err, result) => {
      if (err) {
        console.error(
          "Contact insert error:",
          err
        );

        return res.status(500).json({
          message: "Failed to save enquiry.",
        });
      }

      res.status(201).json({
        message: "Enquiry saved successfully.",
        id: result.insertId,
      });
    }
  );
});

// ======================================
// CONTACT - GET ALL
// ======================================

app.get("/api/contact", (req, res) => {
  const sql = `
    SELECT *
    FROM contacts
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(
        "Contact fetch error:",
        err
      );

      return res.status(500).json({
        message: "Failed to fetch enquiries.",
      });
    }

    res.json(results);
  });
});

// ======================================
// CONTACT - UPDATE STATUS
// ======================================

app.put(
  "/api/contact/:id/status",
  (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "In Progress",
      "Completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }

    const sql = `
      UPDATE contacts
      SET status = ?
      WHERE id = ?
    `;

    db.query(
      sql,
      [status, id],
      (err, result) => {
        if (err) {
          console.error(
            "Status update error:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to update status.",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message:
              "Enquiry not found.",
          });
        }

        res.json({
          message:
            "Status updated successfully.",
        });
      }
    );
  }
);

// ======================================
// CONTACT - DELETE
// ======================================

app.delete(
  "/api/contact/:id",
  (req, res) => {
    const { id } = req.params;

    const sql = `
      DELETE FROM contacts
      WHERE id = ?
    `;

    db.query(
      sql,
      [id],
      (err, result) => {
        if (err) {
          console.error(
            "Contact delete error:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to delete enquiry.",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message:
              "Enquiry not found.",
          });
        }

        res.json({
          message:
            "Enquiry deleted successfully.",
        });
      }
    );
  }
);

// ======================================
// ADMIN LOGIN
// ======================================

app.post(
  "/api/admin/login",
  (req, res) => {
    const {
      username,
      password,
    } = req.body;

    if (
      username ===
        process.env.ADMIN_USERNAME &&
      password ===
        process.env.ADMIN_PASSWORD
    ) {
      return res.json({
        success: true,
        message: "Login successful",
      });
    }

    res.status(401).json({
      success: false,
      message:
        "Invalid username or password",
    });
  }
);

// ======================================
// PORTFOLIO - GET ALL
// ======================================

app.get(
  "/api/portfolio",
  (req, res) => {
    const sql = `
      SELECT
        id,
        title,
        category,
        image_url,
        created_at
      FROM portfolio
      ORDER BY created_at DESC
    `;

    db.query(
      sql,
      (err, results) => {
        if (err) {
          console.error(
            "Portfolio fetch error:",
            err
          );

          return res.status(500).json({
            message:
              "Failed to fetch portfolio.",
          });
        }

        const portfolio =
          results.map((item) => {
            let imageUrl =
              item.image_url;

            if (
              imageUrl &&
              !imageUrl.startsWith("http")
            ) {
              imageUrl =
                `${BASE_URL}${imageUrl}`;
            }

            return {
              ...item,
              image_url: imageUrl,
            };
          });

        res.json(portfolio);
      }
    );
  }
);

// ======================================
// PORTFOLIO - ADD
// ======================================

app.post(
  "/api/portfolio",
  upload.single("image"),
  (req, res) => {
    const {
      title,
      category,
    } = req.body;

    if (
      !title ||
      !category ||
      !req.file
    ) {
      return res.status(400).json({
        message:
          "Title, category and image are required.",
      });
    }

    const imageUrl =
      `/uploads/${req.file.filename}`;

    const sql = `
      INSERT INTO portfolio
      (title, category, image_url)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [
        title.trim(),
        category.trim(),
        imageUrl,
      ],
      (err, result) => {
        if (err) {
          console.error(
            "Portfolio insert error:",
            err
          );

          try {
            fs.unlinkSync(
              path.join(
                uploadDir,
                req.file.filename
              )
            );
          } catch (deleteError) {
            console.error(
              deleteError
            );
          }

          return res.status(500).json({
            message:
              "Failed to add portfolio.",
          });
        }

        res.status(201).json({
          message:
            "Portfolio added successfully.",

          id: result.insertId,

          image_url:
            `${BASE_URL}${imageUrl}`,
        });
      }
    );
  }
);

// ======================================
// PORTFOLIO - UPDATE
// ======================================

app.put(
  "/api/portfolio/:id",
  upload.single("image"),
  (req, res) => {
    const { id } = req.params;

    const {
      title,
      category,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        message:
          "Title and category are required.",
      });
    }

    // ==================================
    // NEW IMAGE
    // ==================================

    if (req.file) {
      const newImageUrl =
        `/uploads/${req.file.filename}`;

      const selectSql = `
        SELECT image_url
        FROM portfolio
        WHERE id = ?
      `;

      db.query(
        selectSql,
        [id],
        (selectErr, rows) => {
          if (selectErr) {
            console.error(
              selectErr
            );

            return res.status(500).json({
              message:
                "Failed to update portfolio.",
            });
          }

          if (rows.length === 0) {
            return res.status(404).json({
              message:
                "Portfolio item not found.",
            });
          }

          const oldImage =
            rows[0].image_url;

          const updateSql = `
            UPDATE portfolio
            SET title = ?,
                category = ?,
                image_url = ?
            WHERE id = ?
          `;

          db.query(
            updateSql,
            [
              title.trim(),
              category.trim(),
              newImageUrl,
              id,
            ],
            (err, result) => {
              if (err) {
                console.error(
                  err
                );

                return res.status(500).json({
                  message:
                    "Failed to update portfolio.",
                });
              }

              // Delete old local image
              if (
                oldImage &&
                oldImage.startsWith(
                  "/uploads/"
                )
              ) {
                const oldFile =
                  path.join(
                    __dirname,
                    oldImage
                  );

                if (
                  fs.existsSync(oldFile)
                ) {
                  try {
                    fs.unlinkSync(
                      oldFile
                    );
                  } catch (
                    deleteError
                  ) {
                    console.error(
                      deleteError
                    );
                  }
                }
              }

              res.json({
                message:
                  "Portfolio updated successfully.",

                image_url:
                  `${BASE_URL}${newImageUrl}`,
              });
            }
          );
        }
      );
    }

    // ==================================
    // NO NEW IMAGE
    // ==================================

    else {
      const sql = `
        UPDATE portfolio
        SET title = ?,
            category = ?
        WHERE id = ?
      `;

      db.query(
        sql,
        [
          title.trim(),
          category.trim(),
          id,
        ],
        (err, result) => {
          if (err) {
            console.error(
              "Portfolio update error:",
              err
            );

            return res.status(500).json({
              message:
                "Failed to update portfolio.",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              message:
                "Portfolio item not found.",
            });
          }

          res.json({
            message:
              "Portfolio updated successfully.",
          });
        }
      );
    }
  }
);

// ======================================
// PORTFOLIO - DELETE
// ======================================

app.delete(
  "/api/portfolio/:id",
  (req, res) => {
    const { id } = req.params;

    const selectSql = `
      SELECT image_url
      FROM portfolio
      WHERE id = ?
    `;

    db.query(
      selectSql,
      [id],
      (selectErr, rows) => {
        if (selectErr) {
          console.error(
            selectErr
          );

          return res.status(500).json({
            message:
              "Failed to delete portfolio.",
          });
        }

        if (rows.length === 0) {
          return res.status(404).json({
            message:
              "Portfolio item not found.",
          });
        }

        const imageUrl =
          rows[0].image_url;

        const deleteSql = `
          DELETE FROM portfolio
          WHERE id = ?
        `;

        db.query(
          deleteSql,
          [id],
          (err, result) => {
            if (err) {
              console.error(
                "Portfolio delete error:",
                err
              );

              return res.status(500).json({
                message:
                  "Failed to delete portfolio.",
              });
            }

            // Delete local image
            if (
              imageUrl &&
              imageUrl.startsWith(
                "/uploads/"
              )
            ) {
              const imagePath =
                path.join(
                  __dirname,
                  imageUrl
                );

              if (
                fs.existsSync(
                  imagePath
                )
              ) {
                try {
                  fs.unlinkSync(
                    imagePath
                  );
                } catch (
                  deleteError
                ) {
                  console.error(
                    deleteError
                  );
                }
              }
            }

            res.json({
              message:
                "Portfolio deleted successfully.",
            });
          }
        );
      }
    );
  }
);

// ======================================
// ERROR HANDLER
// ======================================

app.use(
  (err, req, res, next) => {
    console.error(err);

    if (
      err instanceof multer.MulterError
    ) {
      return res.status(400).json({
        message:
          "Image upload error: " +
          err.message,
      });
    }

    if (err.message) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message:
        "Something went wrong.",
    });
  }
);

// ======================================
// START SERVER
// ======================================

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on ${BASE_URL}`
    );
  }
);