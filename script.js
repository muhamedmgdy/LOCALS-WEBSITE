// --- 1. إعلان المتغيرات الأساسية وعناصر واجهة المستخدم ---
let cart = []; // مصفوفة لتخزين المنتجات المضافة في السلة

// عناصر السلة والقوائم الجانبية
const cartSidebar = document.getElementById('cartSidebar');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const uiOverlay = document.getElementById('uiOverlay');
const cartCountBadge = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalSpan = document.getElementById('cartTotal');

// عناصر البحث والقائمة على الموبايل
const searchBtn = document.querySelector('.search-btn');
const searchBar = document.querySelector('.search-bar');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// عناصر نافذة الدفع (Checkout)
const checkoutModal = document.getElementById('checkoutModal');
const openCheckoutBtn = document.getElementById('openCheckoutBtn');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
const governorateSelect = document.getElementById('governorate');

// عناصر ملخص الطلب ورسالة النجاح
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryShipping = document.getElementById('summaryShipping');
const summaryGrandTotal = document.getElementById('summaryGrandTotal');
const successModal = document.getElementById('successModal');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const orderIdText = document.getElementById('orderIdText');

// --- 2. برمجية فتح وإغلاق النوافذ (UI Toggles) ---

// فتح وقفل السلة
cartToggleBtn.addEventListener('click', () => {
    cartSidebar.classList.add('show');
    uiOverlay.classList.add('show');
});

closeCartBtn.addEventListener('click', closeAllUI);
uiOverlay.addEventListener('click', closeAllUI);

// فتح وقفل شريط البحث
searchBtn.addEventListener('click', () => {
    searchBar.classList.toggle('active');
});

// قائمة الموبايل (Responsive Menu)
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

// فتح نافذة الدفع من السلة
openCheckoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert("عربتك فارغة! أضف بعض الملابس أولاً.");
        return;
    }
    cartSidebar.classList.remove('show');
    checkoutModal.classList.add('show');
    uiOverlay.classList.add('show');
    updateCheckoutSummary();
});

closeCheckoutBtn.addEventListener('click', closeAllUI);

// دالة إغلاق كل شيء (سلة، نوافذ، خلفية)
function closeAllUI() {
    cartSidebar.classList.remove('show');
    checkoutModal.classList.remove('show');
    successModal.classList.remove('show');
    uiOverlay.classList.remove('show');
}

// --- 3. سيستم عربة التسوق (Cart System) ---

// الاستماع لجميع أزرار "Add to Cart"
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

// دالة إضافة المنتج للمصفوفة
function addToCartSystem(id, name, price, size) {
    // التحقق إذا كان المنتج بنفس المقاس موجود مسبقاً لزيادة الكمية فقط
    const existingItem = cart.find(item => item.id === id && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            size: size,
            quantity: 1
        });
    }

    updateCartUI();
    // فتح السلة تلقائياً لتبين للعميل أن المنتج تمت إضافته
    cartSidebar.classList.add('show');
    uiOverlay.classList.add('show');
}

// تحديث واجهة السلة (العدد، المنتجات، الإجمالي)
function updateCartUI() {
    // 1. تحديث شارة العدد في الهيدر
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;

    // 2. تفريغ الحاوية وإعادة بناء المنتجات
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;

        const itemHTML = `
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
        cartItemsContainer.innerHTML += itemHTML;
    });

    // 3. تحديث الإجمالي في السلة
    cartTotalSpan.textContent = subtotal;
}

// دالة تغيير الكمية من داخل السلة
window.changeQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
    if(checkoutModal.classList.contains('show')) updateCheckoutSummary();
};

// دالة مسح منتج نهائياً
window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
    if(checkoutModal.classList.contains('show')) updateCheckoutSummary();
};

// --- 4. حساب مصاريف الشحن والملخص المالي ---

governorateSelect.addEventListener('change', updateCheckoutSummary);

function updateCheckoutSummary() {
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // جلب قيمة الشحن من الـ option المختار
    const selectedOption = governorateSelect.options[governorateSelect.selectedIndex];
    let shipping = 0;
    if (selectedOption && selectedOption.dataset.shipping) {
        shipping = parseInt(selectedOption.dataset.shipping);
    }

    let grandTotal = subtotal + shipping;

    // تحديث الأرقام في الفواتير داخل شاشة الدفع
    summarySubtotal.textContent = subtotal;
    summaryShipping.textContent = shipping;
    summaryGrandTotal.textContent = grandTotal;
}

// --- 5. إرسال وتأكيد الأوردر النهائي ---

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault(); // منع الصفحة من إعادة التحميل

    // جلب بيانات العميل المدخلة
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const governorate = governorateSelect.value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const finalTotal = summaryGrandTotal.textContent;

    // إنشاء رقم أوردر مميز وعشوائي للمتجر (مثال: LOC-4829)
    const orderId = 'LOC-' + Math.floor(1000 + Math.random() * 9000);

    // هان بنعرض رقم الأوردر في شاشة النجاح
    orderIdText.textContent = orderId;

    // إخفاء نافذة الدفع وإظهار نافذة النجاح
    checkoutModal.classList.remove('show');
    successModal.classList.add('show');

    // تفريغ السلة تماماً بعد نجاح العملية
    cart = [];
    updateCartUI();
    checkoutForm.reset();
});

// زر الاستمرار في التسوق بعد الأوردر
closeSuccessBtn.addEventListener('click', closeAllUI);

// ميزة البحث السريع (فلاتر المنتجات)
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.products .card').forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if(title.includes(term)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});
