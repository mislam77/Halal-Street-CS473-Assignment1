document.addEventListener('DOMContentLoaded', function() {
    // Initialize the cart from localStorage
    let cart = JSON.parse(localStorage.getItem('halalStreetCart')) || [];
    
    // Setup the cart icon and sidebar
    setupCartUI();
    
    // Update the cart count and display
    updateCartDisplay();
    
    // Add click handlers to all "Add to Cart" buttons
    setupAddToCartButtons();
    
    // Create and add the cart icon to the page
    function setupCartUI() {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      document.body.appendChild(overlay);
      
      // Create cart icon
      const cartIcon = document.createElement('div');
      cartIcon.className = 'cart__icon';
      cartIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="feather feather-shopping-cart">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span class="cart__count">0</span>
      `;
      document.body.appendChild(cartIcon);
      
      // Create cart sidebar
      const cartSidebar = document.createElement('div');
      cartSidebar.className = 'cart__sidebar';
      cartSidebar.innerHTML = `
        <div class="cart__header">
          <h2 class="cart__title">Your Cart</h2>
          <div class="cart__close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
        <div class="cart__items">
          <!-- Cart items will be added here dynamically -->
        </div>
        <div class="cart__summary">
          <div class="cart__summary__total">
            <span>Total:</span>
            <span class="cart__total">$0.00</span>
          </div>
          <button class="cart__checkout">Checkout</button>
          <div class="cart__actions">
            <button class="cart__clear">Clear Cart</button>
          </div>
        </div>
      `;
      document.body.appendChild(cartSidebar);
      
      // Add event listeners for cart interactions
      cartIcon.addEventListener('click', openCart);
      document.querySelector('.cart__close').addEventListener('click', closeCart);
      overlay.addEventListener('click', closeCart);
      document.querySelector('.cart__clear').addEventListener('click', clearCart);
      document.querySelector('.cart__checkout').addEventListener('click', checkout);
    }
    
    // Open the cart sidebar
    function openCart() {
      document.querySelector('.cart__sidebar').classList.add('active');
      document.querySelector('.overlay').classList.add('active');
    }
    
    // Close the cart sidebar
    function closeCart() {
      document.querySelector('.cart__sidebar').classList.remove('active');
      document.querySelector('.overlay').classList.remove('active');
    }
    
    // Add "Add to Cart" buttons to menu items
    function setupAddToCartButtons() {
      // For each dish grid item
      const dishGridItems = document.querySelectorAll('.dishGrid__item');
      
      dishGridItems.forEach(item => {
        // Get product info
        const title = item.querySelector('.dishGrid__item__title').textContent.trim();
        const priceText = item.querySelector('.dishGrid__item__price').textContent.trim();
        const price = parseFloat(priceText.replace('$', ''));
        const imgSrc = item.querySelector('.dishGrid__item__img img').src;
        
        // Create and add the button if it doesn't already exist
        if (!item.querySelector('.add-to-cart-btn')) {
          const addButton = document.createElement('button');
          addButton.className = 'add-to-cart-btn';
          addButton.textContent = 'Add to Cart';
          addButton.dataset.title = title;
          addButton.dataset.price = price;
          addButton.dataset.img = imgSrc;
          
          // Add click event
          addButton.addEventListener('click', function(e) {
            addToCart({
              title: e.target.dataset.title,
              price: parseFloat(e.target.dataset.price),
              img: e.target.dataset.img,
              quantity: 1
            });
          });
          
          // Add button to the dish item
          item.querySelector('.dishGrid__item__info').appendChild(addButton);
        }
      });
      
      // For the special items as well
      const specialItems = document.querySelectorAll('.ourSpecials__item');
      
      specialItems.forEach(item => {
        // If there's no add to cart button yet
        if (!item.querySelector('.add-to-cart-btn')) {
          // Get product info
          const title = item.querySelector('.ourSpecials__item__title').textContent.trim();
          const priceText = item.querySelector('.ourSpecials__item__price').textContent.trim();
          const price = parseFloat(priceText.replace('$', ''));
          const imgSrc = item.querySelector('.ourSpecials__item__img img').src;
          
          // Create and add the button
          const addButton = document.createElement('button');
          addButton.className = 'add-to-cart-btn';
          addButton.textContent = 'Add to Cart';
          addButton.dataset.title = title;
          addButton.dataset.price = price;
          addButton.dataset.img = imgSrc;
          
          // Add click event
          addButton.addEventListener('click', function(e) {
            addToCart({
              title: e.target.dataset.title,
              price: parseFloat(e.target.dataset.price),
              img: e.target.dataset.img,
              quantity: 1
            });
          });
          
          // Add to the item
          if (item.querySelector('.ourSpecials__item__stars')) {
            item.querySelector('.ourSpecials__item__stars').insertAdjacentElement('afterend', addButton);
          } else {
            item.appendChild(addButton);
          }
        }
      });
    }
    
    // Add item to cart
    function addToCart(product) {
      // Check if the product is already in the cart
      const existingProductIndex = cart.findIndex(item => item.title === product.title);
      
      if (existingProductIndex !== -1) {
        // Increase quantity if it's already in the cart
        cart[existingProductIndex].quantity += 1;
      } else {
        // Add new item to the cart
        cart.push(product);
      }
      
      // Update cart in localStorage
      localStorage.setItem('halalStreetCart', JSON.stringify(cart));
      
      // Update the UI
      updateCartDisplay();
      
      // Show a visual feedback (optional)
      showAddedToCartFeedback();
    }
    
    // Visual feedback when an item is added to cart
    function showAddedToCartFeedback() {
      // Create a temporary element for feedback
      const feedback = document.createElement('div');
      feedback.style.position = 'fixed';
      feedback.style.bottom = '20px';
      feedback.style.left = '50%';
      feedback.style.transform = 'translateX(-50%)';
      feedback.style.backgroundColor = 'var(--green-1)';
      feedback.style.color = 'white';
      feedback.style.padding = '10px 20px';
      feedback.style.borderRadius = '5px';
      feedback.style.zIndex = '1000';
      feedback.textContent = 'Item added to cart!';
      
      // Add to body
      document.body.appendChild(feedback);
      
      // Remove after 2 seconds
      setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.5s ease';
        
        // Remove from DOM after fade out
        setTimeout(() => {
          document.body.removeChild(feedback);
        }, 500);
      }, 1500);
    }
    
    // Remove item from cart
    function removeFromCart(index) {
      // Remove the item from the cart array
      cart.splice(index, 1);
      
      // Update cart in localStorage
      localStorage.setItem('halalStreetCart', JSON.stringify(cart));
      
      // Update the UI
      updateCartDisplay();
    }
    
    // Update quantity of an item
    function updateQuantity(index, newQuantity) {
      // Make sure quantity is at least 1
      if (newQuantity < 1) newQuantity = 1;
      
      // Update the quantity
      cart[index].quantity = newQuantity;
      
      // Update cart in localStorage
      localStorage.setItem('halalStreetCart', JSON.stringify(cart));
      
      // Update the UI
      updateCartDisplay();
    }
    
    // Clear the entire cart
    function clearCart() {
      // Empty the cart array
      cart = [];
      
      // Update cart in localStorage
      localStorage.setItem('halalStreetCart', JSON.stringify(cart));
      
      // Update the UI
      updateCartDisplay();
    }
    
    // Go to checkout
    function checkout() {
      // You could redirect to a checkout page
      alert('Thank you for your order! In a real implementation, you would be redirected to a checkout page.');
      
      // Clear the cart after "checkout"
      clearCart();
      
      // Close the cart sidebar
      closeCart();
    }
    
    // Update the cart display in the UI
    function updateCartDisplay() {
      // Update cart count
      const cartCount = document.querySelector('.cart__count');
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems;
      
      // Update cart items
      const cartItemsContainer = document.querySelector('.cart__items');
      cartItemsContainer.innerHTML = '';
      
      if (cart.length === 0) {
        // Show empty cart message
        cartItemsContainer.innerHTML = `
          <div class="cart__empty">
            <div class="cart__empty__icon">🛒</div>
            <p class="cart__empty__text">Your cart is empty</p>
          </div>
        `;
      } else {
        // Create HTML for each cart item
        cart.forEach((item, index) => {
          const cartItem = document.createElement('div');
          cartItem.className = 'cart__item';
          cartItem.innerHTML = `
            <div class="cart__item__img">
              <img src="${item.img}" alt="${item.title}">
            </div>
            <div class="cart__item__info">
              <h3 class="cart__item__title">${item.title}</h3>
              <p class="cart__item__price">$${(item.price * item.quantity).toFixed(2)}</p>
              <div class="cart__item__quantity">
                <button class="cart__quantity__btn minus" data-index="${index}">-</button>
                <span class="cart__quantity__number">${item.quantity}</span>
                <button class="cart__quantity__btn plus" data-index="${index}">+</button>
                <button class="cart__item__remove" data-index="${index}">Remove</button>
              </div>
            </div>
          `;
          
          cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.cart__quantity__btn.minus').forEach(btn => {
          btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            updateQuantity(index, cart[index].quantity - 1);
          });
        });
        
        document.querySelectorAll('.cart__quantity__btn.plus').forEach(btn => {
          btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            updateQuantity(index, cart[index].quantity + 1);
          });
        });
        
        document.querySelectorAll('.cart__item__remove').forEach(btn => {
          btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            removeFromCart(index);
          });
        });
      }
      
      // Update total
      const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      document.querySelector('.cart__total').textContent = `$${totalPrice.toFixed(2)}`;
    }
  });