const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authmiddleware");

// ------------------------
// PLACE ORDER
// ------------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const cart = req.body.cart;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // FIX: calculate total as a proper number
    let total = 0;
    cart.forEach(item => {
      total += Number(item.price);
    });

    // Insert into orders table
    const [orderResult] = await db.query(
      "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      [user_id, total]
    );

    const order_id = orderResult.insertId;

    // Insert each cart item into order_items correctly
    for (const item of cart) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [
          order_id,
          item.id,               // product_id (matches your DB)
          item.quantity || 1,    // default quantity = 1
          Number(item.price)
        ]
      );
    }

    res.json({ message: "Order placed successfully!", order_id });

  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------
// GET ORDERS FOR USER
// ------------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;

    // Get all orders for this user
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [user_id]
    );

    // For each order, fetch its items
    for (const order of orders) {
      const [items] = await db.query(
        "SELECT * FROM order_items WHERE order_id = ?",
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);

  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;


