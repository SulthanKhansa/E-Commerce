document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation functionality for order page
  const mobileHamburger = document.getElementById("mobileHamburger");
  const mobileOrderMenu = document.getElementById("mobileOrderMenu");

  if (mobileHamburger && mobileOrderMenu) {
    mobileHamburger.addEventListener("click", function () {
      mobileHamburger.classList.toggle("active");
      mobileOrderMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        !mobileHamburger.contains(e.target) &&
        !mobileOrderMenu.contains(e.target)
      ) {
        mobileHamburger.classList.remove("active");
        mobileOrderMenu.classList.remove("active");
      }
    });
  }

  let cart = {};
  let totalAmount = 0;

  // Tab functionality
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all tabs and contents
      tabBtns.forEach((tab) => tab.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      this.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // Quantity controls
  const qtyBtns = document.querySelectorAll(".qty-btn");

  qtyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const menuItem = this.closest(".menu-item");
      const itemId = menuItem.getAttribute("data-id");
      const itemName = menuItem.getAttribute("data-name");
      const itemPrice = parseInt(menuItem.getAttribute("data-price"));
      const quantitySpan = menuItem.querySelector(".quantity");
      const isPlus = this.classList.contains("plus");
      const isMinus = this.classList.contains("minus");

      let currentQty = parseInt(quantitySpan.textContent);

      if (isPlus) {
        currentQty++;
      } else if (isMinus && currentQty > 0) {
        currentQty--;
      }

      quantitySpan.textContent = currentQty;

      // Update cart
      if (currentQty > 0) {
        cart[itemId] = {
          name: itemName,
          price: itemPrice,
          quantity: currentQty,
        };
      } else {
        delete cart[itemId];
      }

      updateCartAndAdjustHeight();
    });
  });

  function updateOrderSummary() {
    const orderItems = document.getElementById("orderItems");
    const orderTotal = document.getElementById("orderTotal");
    const subtotalAmount = document.getElementById("subtotalAmount");
    const totalAmountElement = document.getElementById("totalAmount");

    // Clear current order items
    orderItems.innerHTML = "";

    if (Object.keys(cart).length === 0) {
      orderItems.innerHTML = `
                <div class="empty-order">
                    <p>No items in your order yet</p>
                    <p>Start by selecting items from the menu</p>
                </div>
            `;
      orderTotal.style.display = "none";
      return;
    }

    // Calculate subtotal
    let subtotal = 0;

    // Display order items
    Object.keys(cart).forEach((itemId) => {
      const item = cart[itemId];
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const orderItem = document.createElement("div");
      orderItem.className = "order-item";
      orderItem.innerHTML = `
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">Rp ${item.price.toLocaleString()}</p>
                </div>
                <div class="order-item-controls">
                    <span class="order-item-qty">Qty: ${item.quantity}</span>
                    <span class="order-item-total">Rp ${itemTotal.toLocaleString()}</span>
                </div>
            `;
      orderItems.appendChild(orderItem);
    });

    // Update totals
    const deliveryFee = 5000;
    const finalTotal = subtotal + deliveryFee;

    subtotalAmount.textContent = `Rp ${subtotal.toLocaleString()}`;
    totalAmountElement.textContent = `Rp ${finalTotal.toLocaleString()}`;
    orderTotal.style.display = "block";

    // Adjust order summary height for tablet
    adjustOrderSummaryHeight();
  }

  // Function to adjust order summary height based on items count
  function adjustOrderSummaryHeight() {
    const orderSummary = document.querySelector(".order-summary");
    const orderItems = document.getElementById("orderItems");
    const itemCount = Object.keys(cart).length;
    const isTablet = window.innerWidth >= 769 && window.innerWidth <= 1024;
    const isMobile = window.innerWidth <= 768;

    if ((isTablet || isMobile) && orderSummary) {
      // Remove previous classes
      orderSummary.classList.remove("full-summary");
      orderItems.classList.remove("scrollable");

      if (itemCount === 0) {
        // Empty order - minimal height
        if (isMobile) {
          orderSummary.style.maxHeight = "20vh";
        } else {
          orderSummary.style.maxHeight = "18vh";
        }
      } else if (itemCount === 1) {
        // Single item - ensure it's visible immediately
        if (isMobile) {
          orderSummary.style.maxHeight = "40vh"; // Increased from 35vh for single item
        } else {
          orderSummary.style.maxHeight = "35vh"; // Increased from 32vh for single item
        }
      } else if (itemCount <= 3) {
        // Few items - moderate height
        if (isMobile) {
          orderSummary.style.maxHeight = "42vh";
        } else {
          orderSummary.style.maxHeight = "38vh";
        }
      } else if (itemCount <= 5) {
        // More items - larger height
        if (isMobile) {
          orderSummary.style.maxHeight = "45vh";
        } else {
          orderSummary.style.maxHeight = "42vh";
        }
      } else {
        // Many items - maximum reasonable height with indicators
        if (isMobile) {
          orderSummary.style.maxHeight = "48vh";
        } else {
          orderSummary.style.maxHeight = "45vh";
        }
        orderSummary.classList.add("full-summary");
        orderItems.classList.add("scrollable");
      }
    }
  }

  // Call this function whenever cart is updated
  function updateCartAndAdjustHeight() {
    updateOrderSummary();
    adjustOrderSummaryHeight();
  }

  // Checkout functionality
  document.getElementById("checkoutBtn").addEventListener("click", function () {
    if (Object.keys(cart).length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    sendToWhatsApp("order");
  });

  // Pre-Order functionality (new)
  document.getElementById("preOrderBtn").addEventListener("click", function () {
    if (Object.keys(cart).length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    sendToWhatsApp("preorder");
  });

  // Updated sendToWhatsApp function with correct phone number
  function sendToWhatsApp(orderType) {
    const phoneNumber = "6283820931296"; // Updated WhatsApp number: +62 838-2093-1296

    // Create order message based on type
    let message = "";
    if (orderType === "order") {
      message = "Pesanan Anda:\n\n";
    } else if (orderType === "preorder") {
      message = "Pre-Order:\n\n";
    }

    // Add order items
    for (const [itemId, item] of Object.entries(cart)) {
      message += `${item.name} x${item.quantity} - Rp ${(
        item.price * item.quantity
      ).toLocaleString("id-ID")}\n`;
    }

    // Add totals
    const subtotal = calculateSubtotal();
    const deliveryFee = 5000;
    const total = subtotal + deliveryFee;

    message += `\n`;
    message += `Subtotal: Rp ${subtotal.toLocaleString("id-ID")}\n`;
    message += `Ongkir: Rp ${deliveryFee.toLocaleString("id-ID")}\n`;
    message += `Total: Rp ${total.toLocaleString("id-ID")}\n\n`;

    if (orderType === "order") {
      message += "Terima kasih!";
    } else if (orderType === "preorder") {
      message += "Terima kasih!";
    }

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappURL, "_blank");
  }

  // Helper function to calculate subtotal
  function calculateSubtotal() {
    let subtotal = 0;
    for (const [itemId, item] of Object.entries(cart)) {
      subtotal += item.price * item.quantity;
    }
    return subtotal;
  }

  // Handle window resize for tablet optimization
  window.addEventListener("resize", function () {
    adjustOrderSummaryHeight();
  });

  // Handle orientation change for tablets
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      adjustOrderSummaryHeight();
    }, 100);
  });
});
