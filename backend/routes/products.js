const express = require("express");
const router = express.Router();
const db = require("../db");
const { auth, adminOnly } = require("../middleware/auth");

// Get all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.log("Products Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log("Product Fetch Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// Admin: create product
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    const [result] = await db.query(
      "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)",
      [name, description, price, image]
    );

    res.json({ id: result.insertId, message: "Product created" });
  } catch (err) {
    console.log("Product Create Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// Admin: update product
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price, image } = req.body;

    await db.query(
      "UPDATE products SET name=?, description=?, price=?, image=? WHERE id=?",
      [name, description, price, image, id]
    );

    res.json({ message: "Product updated" });
  } catch (err) {
    console.log("Product Update Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// Admin: delete product
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = req.params.id;

    await db.query("DELETE FROM products WHERE id=?", [id]);

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.log("Product Delete Error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

module.exports = router;

