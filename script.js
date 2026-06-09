let cart = [];

const cartCount = document.querySelector(".cart-count");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartBtn = document.querySelector(".cart-btn");
const cartSidebar = document.querySelector(".cart-sidebar");

cartBtn.addEventListener("click", () => {
    cartSidebar.classList.toggle("show");
});

document.querySelectorAll(".add-to-cart").forEach(button => {

    button.addEventListener("click", () => {

        const card = button.parentElement;

        const name = card.querySelector("h3").textContent;

        const price = parseInt(
            card.querySelector("p").textContent
        );

        cart.push({
            name,
            price
        });

        updateCart();

        button.textContent = "ADDED ✓";

        setTimeout(() => {
            button.textContent = "ADD TO CART";
        }, 1000);

    });

});

function updateCart() {

    cartCount.textContent = cart.length;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price;

        cartItems.innerHTML += `
        <div class="cart-item">
            <p>${item.name}</p>
            <p>${item.price} EGP</p>
            <button onclick="removeItem(${index})">✖️</button>
        </div>
        `;

    });

    cartTotal.textContent = total;

}

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}
