const express = require("express");
const serverless = require("serverless-http");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const { getStore } = require("@netlify/blobs");

const app = express();

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());
app.use(express.json());

// ======================================
// MYSQL CONNECTION
// ======================================

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },

  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// ======================================
// NETLIFY BLOBS
// ======================================

const imageStore = getStore("saranggraphics-portfolio");

// ======================================
// MULTER - MEMORY STORAGE
// ======================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
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
  },
});

// ======================================
// TEST ROUTE
// ======================================

app.get("/", async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();

    res.json({
      success: true,
      message: "SarangGraphics Backend Running",
      database: "Connected",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Backend running but database connection failed.",
    });
  }
});

// ======================================
// CONTACT - ADD
// ======================================

app.post("/api/contact", async (req, res) => {
  try {
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

    const [result] = await db.execute(sql, [
      name.trim(),
      email.trim(),
      phone.trim(),
      service.trim(),
      message.trim(),
    ]);

    res.status(201).json({
      message: "Enquiry saved successfully.",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Contact insert error:", error);

    res.status(500).json({
      message: "Failed to save enquiry.",
    });
  }
});

// ======================================
// CONTACT - GET ALL
// ======================================

app.get("/api/contact", async (req, res) => {
  try {
    const sql = `
      SELECT *
      FROM contacts
      ORDER BY created_at DESC
    `;

    const [results] = await db.execute(sql);

    res.json(results);
  } catch (error) {
    console.error("Contact fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch enquiries.",
    });
  }
});

// ======================================
// CONTACT - UPDATE STATUS
// ======================================

app.put("/api/contact/:id/status", async (req, res) => {
  try {
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

    const [result] = await db.execute(sql, [
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Enquiry not found.",
      });
    }

    res.json({
      message: "Status updated successfully.",
    });
  } catch (error) {
    console.error("Status update error:", error);

    res.status(500).json({
      message: "Failed to update status.",
    });
  }
});

// ======================================
// CONTACT - DELETE
// ======================================

app.delete("/api/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      DELETE FROM contacts
      WHERE id = ?
    `;

    const [result] = await db.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Enquiry not found.",
      });
    }

    res.json({
      message: "Enquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Contact delete error:", error);

    res.status(500).json({
      message: "Failed to delete enquiry.",
    });
  }
});

// ======================================
// ADMIN LOGIN
// ======================================

app.post("/api/admin/login", (req, res) => {
  const {
    username,
    password,
  } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      message: "Login successful",
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
});

// ======================================
// PORTFOLIO - GET ALL
// ======================================

app.get("/api/portfolio", async (req, res) => {
  try {
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

    const [results] = await db.execute(sql);

    res.json(results);
  } catch (error) {
    console.error("Portfolio fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch portfolio.",
    });
  }
});

// ======================================
// PORTFOLIO IMAGE
// ======================================

app.get("/uploads/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    const image = await imageStore.get(filename, {
      type: "arrayBuffer",
    });

    if (!image) {
      return res.status(404).send("Image not found.");
    }

    const extension = filename
      .split(".")
      .pop()
      .toLowerCase();

    const contentTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };

    res.setHeader(
      "Content-Type",
      contentTypes[extension] || "application/octet-stream"
    );

    res.setHeader(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );

    res.send(Buffer.from(image));
  } catch (error) {
    console.error("Image fetch error:", error);

    res.status(500).send("Failed to load image.");
  }
});

// ======================================
// PORTFOLIO - ADD
// ======================================

app.post(
  "/api/portfolio",
  upload.single("image"),
  async (req, res) => {
    try {
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

      const extension =
        req.file.originalname
          .split(".")
          .pop()
          .toLowerCase();

      const filename =
        `${Date.now()}-${Math.round(
          Math.random() * 1000000000
        )}.${extension}`;

      // Save image to Netlify Blobs
      await imageStore.set(
        filename,
        req.file.buffer,
        {
          metadata: {
            contentType: req.file.mimetype,
          },
        }
      );

      const imageUrl =
        `/uploads/${filename}`;

      const sql = `
        INSERT INTO portfolio
        (title, category, image_url)
        VALUES (?, ?, ?)
      `;

      const [result] = await db.execute(sql, [
        title.trim(),
        category.trim(),
        imageUrl,
      ]);

      res.status(201).json({
        message:
          "Portfolio added successfully.",

        id: result.insertId,

        image_url: imageUrl,
      });
    } catch (error) {
      console.error(
        "Portfolio insert error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to add portfolio.",
      });
    }
  }
);

// ======================================
// PORTFOLIO - UPDATE
// ======================================

app.put(
  "/api/portfolio/:id",
  upload.single("image"),
  async (req, res) => {
    try {
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

      // Get existing item
      const [rows] = await db.execute(
        `SELECT image_url FROM portfolio WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message:
            "Portfolio item not found.",
        });
      }

      const oldImageUrl =
        rows[0].image_url;

      // ==================================
      // NEW IMAGE
      // ==================================

      if (req.file) {
        const extension =
          req.file.originalname
            .split(".")
            .pop()
            .toLowerCase();

        const filename =
          `${Date.now()}-${Math.round(
            Math.random() * 1000000000
          )}.${extension}`;

        await imageStore.set(
          filename,
          req.file.buffer,
          {
            metadata: {
              contentType: req.file.mimetype,
            },
          }
        );

        const newImageUrl =
          `/uploads/${filename}`;

        await db.execute(
          `
          UPDATE portfolio
          SET title = ?,
              category = ?,
              image_url = ?
          WHERE id = ?
          `,
          [
            title.trim(),
            category.trim(),
            newImageUrl,
            id,
          ]
        );

        // Delete old image from Blobs
        if (
          oldImageUrl &&
          oldImageUrl.startsWith("/uploads/")
        ) {
          const oldFilename =
            oldImageUrl.replace(
              "/uploads/",
              ""
            );

          try {
            await imageStore.delete(
              oldFilename
            );
          } catch (deleteError) {
            console.error(
              "Old image delete error:",
              deleteError
            );
          }
        }

        return res.json({
          message:
            "Portfolio updated successfully.",

          image_url: newImageUrl,
        });
      }

      // ==================================
      // NO NEW IMAGE
      // ==================================

      await db.execute(
        `
        UPDATE portfolio
        SET title = ?,
            category = ?
        WHERE id = ?
        `,
        [
          title.trim(),
          category.trim(),
          id,
        ]
      );

      res.json({
        message:
          "Portfolio updated successfully.",
      });
    } catch (error) {
      console.error(
        "Portfolio update error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update portfolio.",
      });
    }
  }
);

// ======================================
// PORTFOLIO - DELETE
// ======================================

app.delete(
  "/api/portfolio/:id",
  async (req, res) => {
    try {
      const { id } = req.params;

      const [rows] = await db.execute(
        `
        SELECT image_url
        FROM portfolio
        WHERE id = ?
        `,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          message:
            "Portfolio item not found.",
        });
      }

      const imageUrl =
        rows[0].image_url;

      await db.execute(
        `
        DELETE FROM portfolio
        WHERE id = ?
        `,
        [id]
      );

      // Delete image from Blobs
      if (
        imageUrl &&
        imageUrl.startsWith("/uploads/")
      ) {
        const filename =
          imageUrl.replace(
            "/uploads/",
            ""
          );

        try {
          await imageStore.delete(
            filename
          );
        } catch (deleteError) {
          console.error(
            "Image delete error:",
            deleteError
          );
        }
      }

      res.json({
        message:
          "Portfolio deleted successfully.",
      });
    } catch (error) {
      console.error(
        "Portfolio delete error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete portfolio.",
      });
    }
  }
);

// ======================================
// ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
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
});

// ======================================
// NETLIFY FUNCTION
// ======================================

module.exports.handler = serverless(app);