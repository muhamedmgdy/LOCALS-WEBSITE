let cart = []; 

const cartSidebar = document.getElementById('cartSidebar');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const uiOverlay = document.getElementById('uiOverlay');
const cartCountBadge = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalSpan = document.getElementById('cartTotal');

const searchBtn = document.querySelector('.search-btn');
const searchBar = document.querySelector('.search-bar');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

const checkoutModal = document.getElementById('checkoutModal');
const openCheckoutBtn = document.getElementById('openCheckoutBtn');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
const governorateSelect = document.getElementById('governorate');

const summarySubtotal = document.getElementById('summarySubtotal');
const summaryShipping = document.getElementById('summaryShipping');
const summaryGrandTotal = document.getElementById('summaryGrandTotal');
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const orderIdText = document.getElementById('orderIdText');

// UI Toggles
cartToggleBtn.addEventListener('click', () => {
    cartSidebar.classList.add('show');
    uiOverlay.classList.add('show');
});

closeCartBtn.addEventListener('click', closeAllUI);
uiOverlay.addEventListener('click', closeAllUI);

searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
});

menuToggle.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    if(navMenu.style.display === 'flex') {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '70px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'white';
        navMenu.style.padding = '20px';
        navMenu.style.borderBottom = '1px solid #eee';
    }
});

openCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    cartSidebar.classList.remove('show');
    checkoutModal.classList.add('show');
    uiOverlay.classList.add('show');
    updateCheckoutSummary();
});

closeCheckoutBtn.addEventListener('click', closeAllUI);

function closeAllUI() {
    cartSidebar.classList.remove('show');
    checkoutModal.classList.remove('show');
    successModal.classList.remove('show');
    uiOverlay.classList.remove('show');
}

// Cart System
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price);
        const size = card.querySelector('.size-select').value;

        addToCartSystem(id, name, price, size);
    });
});

function addToCartSystem(id, name, price, size) {
    const existingItem = cart.find(item => item.id === id && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, size, quantity: 1 });
    }

    updateCartUI();
    cartSidebar.classList.add('show');
    uiOverlay.classList.add('show');
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Size: <strong>${item.size}</strong></p>
                    <p>${item.price} EGP</p>
                    <div class="cart-item-qty">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });

    cartTotalSpan.textContent = subtotal;
}

window.changeQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCartUI();
    if(checkoutModal.classList.contains('show')) updateCheckoutSummary();
};

window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
    if(checkoutModal.classList.contains('show')) updateCheckoutSummary();
};

// Shipping Calculation
governorateSelect.addEventListener('change', updateCheckoutSummary);

function updateCheckoutSummary() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedOption = governorateSelect.options[governorateSelect.selectedIndex];
    let shipping = (selectedOption && selectedOption.dataset.shipping) ? parseInt(selectedOption.dataset.shipping) : 0;

    summarySubtotal.textContent = subtotal;
    summaryShipping.textContent = shipping;
    summaryGrandTotal.textContent = subtotal + shipping;
}

// Order Confirmation
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const orderId = 'LOC-' + Math.floor(1000 + Math.random() * 9000);
    orderIdText.textContent = orderId;

    checkoutModal.classList.remove('show');
    successModal.classList.add('show');

    cart = [];
    updateCartUI();
    checkoutForm.reset();
});

closeSuccessBtn.addEventListener('click', closeAllUI);

// Live Search
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.products .card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(term) ? 'flex' : 'none';
    });
});
