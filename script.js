// Search Bar Toggle
const searchBtn = document.querySelector('.search-btn');
const searchBar = document.querySelector('.search-bar');

searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
});

// Shopping Cart
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        cartCount++;
        cartCountElement.textContent = cartCount;
        button.textContent = 'ADDED!';
        setTimeout(() => {
            button.textContent = 'ADD TO CART';
        }, 1000);
    });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth Scrolling for Navigation Links
const navLinks = document.querySelectorAll('.nav-menu a, .hero-btn');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Newsletter Subscription
const newsletterButton = document.querySelector('.newsletter button');

if (newsletterButton) {
    newsletterButton.addEventListener('click', () => {
        const input = document.querySelector('.newsletter input');
        if (input.value) {
            alert('Thank you for subscribing!');
            input.value = '';
        } else {
            alert('Please enter your email');
        }
    });
}

// Search Functionality
const searchInput = document.querySelector('.search-bar input');
const searchSubmitBtn = document.querySelector('.search-bar button');

if (searchSubmitBtn) {
    searchSubmitBtn.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            alert(`Searching for: ${query}`);
            searchInput.value = '';
        }
    });
}
