const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// all pproductc product 
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// add new product
router.post("/", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      stock: req.body.stock
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;