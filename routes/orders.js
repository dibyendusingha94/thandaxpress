const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");

const router = express.Router();

function verifySeller(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mysecretkey"
    );

    if (decoded.role !== "seller") {
      return res.status(403).json({
        message: "Seller access required"
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
}


// PLACE ORDER
router.post("/", async (req, res) => {
  try {
    const order = new Order({
      customerName: req.body.customerName,
      phone: req.body.phone,
      address: req.body.address,
      items: req.body.items,
      total: req.body.total
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


// GET ORDERS FOR LOGGED-IN SELLER
router.get("/seller", verifySeller, async (req, res) => {
  try {
    const orders = await Order.find({
      "items.seller": req.user.id
    }).sort({
      createdAt: -1
    });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1
    });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


module.exports = router;
