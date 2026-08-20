const express = require("express");
const Order = require("../models/order");

const router = express.Router();

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

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;