const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
console.log("Mongo URI:", process.env.MONGO_URI ? "FOUND" : "NOT FOUND");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error.message);
  });

app.get("/", (req, res) => {
  res.send("ThandaXpress Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
async function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const customerName = prompt("Enter your name:");
  const phone = prompt("Enter your phone number:");
  const address = prompt("Enter your delivery address:");

  if (!customerName || !phone || !address) {
    alert("Please fill all details!");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const orderData = {
    customerName,
    phone,
    address,
    items: cart,
    total
  };

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order placed successfully! 🎉");

      cart = [];
      updateCart();
      closeCart();

      console.log(data);
    } else {
      alert(data.message || "Order failed");
    }

  } catch (error) {
    console.log(error);
    alert("Server error!");
  }
}