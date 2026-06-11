let cart = []; 

// ربط العناصر بناءً على كود الـ HTML الأصلي بتاعك
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
const orderIdText = document.getElementById('orderIdText');
const modalShippingCost = document.getElementById('modalShippingCost');

// ربط زرار فتح الواتساب المتطابق تماماً بالحروف الصغيرة
const goToWhatsappBtn = document.getElementById('gotowhatsappbtn');

// متغير لحفظ رابط الواتساب والرسالة
let finalWhatsappURL = "";

// إظهار وإخفاء السلة والـ Overlay
cartToggleBtn.addEventListener('click', () => {
    cartSidebar.classList.add('show');
    uiOverlay.classList.add('show');
});

closeCartBtn.addEventListener('click', closeAllUI);
uiOverlay.addEventListener('click', closeAllUI);

// إظهار وإخفاء قائمة البحث
searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
});

// قائمة الموبايل التناغمية
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    if(navMenu.classList.contains('active')) {
        navMenu.style.display = 'flex';
    } else {
        navMenu.style.display = '';
    }
});

// فتح صفحة الشحن عند الضغط على Checkout
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

// =========================================================
// 👇 نظام إضافة المنتجات المحدث بالملي على الـ HTML بتاعك 👇
// =========================================================
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

// تحديث وعرض المنتجات داخل السلة بتصميم متناسق
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                <div class="cart-item-details">
                    <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #000;">${item.name}</h4>
                    <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">Size: <strong>${item.size}</strong></p>
                    <p style="margin: 0; font-size: 13px; font-weight: bold; color: #000;">${item.price} EGP</p>
                    <div class="cart-item-qty" style="margin-top: 5px; display: flex; align-items: center; gap: 8px;">
                        <button type="button" onclick="changeQty(${index}, -1)" style="padding: 2px 8px; cursor: pointer;">-</button>
                        <span style="color: #000;">${item.quantity}</span>
                        <button type="button" onclick="changeQty(${index}, 1)" style="padding: 2px 8px; cursor: pointer;">+</button>
                    </div>
                </div>
                <button type="button" class="remove-item-btn" onclick="removeItem(${index})" style="background: none; border: none; color: #ff3333; cursor: pointer; font-size: 16px;"><i class="fas fa-trash"></i></button>
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

// حساب مصاريف الشحن والمجموع الإجمالي تلقائياً
governorateSelect.addEventListener('change', updateCheckoutSummary);

function updateCheckoutSummary() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const selectedOption = governorateSelect.options[governorateSelect.selectedIndex];
    let shipping = (selectedOption && selectedOption.dataset.shipping) ? parseInt(selectedOption.dataset.shipping) : 0;

    summarySubtotal.textContent = subtotal;
    summaryShipping.textContent = shipping;
    summaryGrandTotal.textContent = subtotal + shipping;
}

// تسلسل تأكيد الأوردر وإظهار نافذة دفع الشحن المسبق
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const governorate = governorateSelect.value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value === 'cod' ? 'الدفع عند الاستلام (شحن مسبق)' : 'Vodafone Cash / InstaPay';
    
    const subtotal = summarySubtotal.textContent;
    const shipping = summaryShipping.textContent;
    const grandTotal = summaryGrandTotal.textContent;

    const orderId = 'LOC-' + Math.floor(1000 + Math.random() * 9000);
    orderIdText.textContent = orderId;
    modalShippingCost.textContent = shipping; 

    let productsText = '';
    cart.forEach(item => {
        productsText += - ${item.name} (Size: ${item.size}) x${item.quantity} -> ${item.price * item.quantity} EGP\n;
    });

    const whatsappMessage = 🚨 *أوردر جديد من موقع LOCALS* 🚨\n\n +
                            🆔 *رقم الأوردر:* ${orderId}\n +
                            👤 *اسم العميل:* ${fullName}\n +
                            📞 *رقم التليفون:* ${phone}\n +
                            📍 *المحافظة:* ${governorate}\n +
                            🏠 *العنوان بالتفصيل:* ${address}\n\n +
                            📦 *المنتجات:*\n${productsText}\n +
                            💵 *تفاصيل الحساب:*\n +
                            - المجموع: ${subtotal} EGP\n +
                            - الشحن (مطلوب تحويله أولاً): ${shipping} EGP\n +
                            💰 *الإجمالي النهائي:* ${grandTotal} EGP\n\n +
                            💳 *طريقة الدفع:* ${paymentMethod}\n\n +
                            ⚠️ *حالة الشحن:* العميل أكد المتابعة لتحويل الشحن وجارٍ إرسال صورة الإيصال لتأكيد الأوردر نهائياً.;

    const myWhatsAppNumber = "201061056741"; 
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    finalWhatsappURL = https://wa.me/${myWhatsAppNumber}?text=${encodedMessage};

    checkoutModal.classList.remove('show');
    successModal.classList.add('show');

    cart = [];
    updateCartUI();
    checkoutForm.reset();
});

// فتح تطبيق الواتساب فوراً عند ضغط العميل على الزرار الأخضر
goToWhatsappBtn.addEventListener('click', () => {
    if(finalWhatsappURL !== "") {
        window.open(finalWhatsappURL, '_self');
    }
    closeAllUI();
});

// نظام البحث المباشر عن المنتجات في الصفحة
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.products .card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(term) ? 'flex' : 'none';
    });
});
