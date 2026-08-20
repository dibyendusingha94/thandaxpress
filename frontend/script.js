const API_URL = "https://thandaxpress.onrender.com";
let cart = [];

// ADD TO CART
function addToCart(name, price) {

  if (price === 0) {
    alert("Age verification is required for this category.");
    return;
  }

  const existingProduct = cart.find(item => item.name === name);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();

  alert(name + " added to cart! 🛒");
}


// UPDATE CART
function updateCart() {

  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  let totalItems = 0;
  let totalPrice = 0;

  cartItems.innerHTML = "";

  cart.forEach(item => {

    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <p>₹${item.price} × ${item.quantity}</p>
        </div>

        <button onclick="removeItem('${item.name}')">
          Remove
        </button>
      </div>
    `;
  });

  cartCount.innerText = totalItems;
  cartTotal.innerText = totalPrice;
}


// REMOVE ITEM
function removeItem(name) {

  cart = cart.filter(item => item.name !== name);

  updateCart();
}


// OPEN CART
function openCart() {
  document.getElementById("cartModal").style.display = "block";
}


// CLOSE CART
function closeCart() {
  document.getElementById("cartModal").style.display = "none";
}


// FILTER CATEGORY
function filterCategory(category) {

  const products = document.querySelectorAll(".product-card");

  document.getElementById("productTitle").innerText = category;

  products.forEach(product => {

    if (product.dataset.category === category) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }

  });

  scrollToProducts();
}


// SHOW ALL PRODUCTS
function showAllProducts() {

  const products = document.querySelectorAll(".product-card");

  document.getElementById("productTitle").innerText = "Popular Products";

  products.forEach(product => {
    product.style.display = "block";
  });

}


// SCROLL
function scrollToProducts() {

  document.getElementById("products").scrollIntoView({
    behavior: "smooth"
  });

}


// SEARCH
document
  .getElementById("searchInput")
  .addEventListener("keyup", function () {

    const searchValue = this.value.toLowerCase();

    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {

      const productName =
        product.querySelector("h3").innerText.toLowerCase();

      if (productName.includes(searchValue)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }

    });

  });
//loadproduct
 async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    const products = await response.json();

    const container = document.getElementById("products-container");

    container.innerHTML = "";

    products.forEach(product => {
      container.innerHTML += `
        <div class="product-card" data-category="${product.category}">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
          <p>Category: ${product.category}</p>
          <p>Stock: ${product.stock}</p>

          <button onclick="addToCart('${product.name}', ${product.price})">
            Add to Cart
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.log("Error loading products:", error);
  }
}

loadProducts();

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
    const response = await fetch(`${API_URL}/api/orders`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Order failed!");
      return;
    }

    alert("Order placed successfully! 🎉");

    cart = [];
    updateCart();
    closeCart();

  } catch (error) {
    console.error(error);
    alert("Could not connect to server!");
  }
}