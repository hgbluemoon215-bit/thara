import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCJlgMT-KEYXFvm0UHxtpPmXeN15tDONYc",
  authDomain: "nivora-stores.firebaseapp.com",
  projectId: "nivora-stores",
  storageBucket: "nivora-stores.firebasestorage.app",
  messagingSenderId: "806938190311",
  appId: "1:806938190311:web:8e7f5e938220e337671d42"
};


// ============================================================
// INIT
// ============================================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// ============================================================
// PRODUCTS
// ============================================================

const PRODUCTS = [

  {
    id: 1,
    name: 'Muslin Frock Button',
    cat: 'dresses',
    image: './images/frock1.png',
    price: 699,
    orig: 899,
    size: '0–6M',
    stars: 5,
    bg: 'p1',
    badge: 'sale'
  },

  {
    id: 2,
    name: 'Muslin Frock Knot',
    cat: 'dresses',
    image: './images/frock2.jpeg',
    price: 699,
    orig: 899,
    size: '0–6M',
    stars: 5,
    bg: 'p2',
    badge: 'sale'
  },

  {
    id: 3,
    name: 'Muslin Frock Zip',
    cat: 'dresses',
    image: './images/frock3.png',
    price: 699,
    orig: 899,
    size: '0–6M',
    stars: 5,
    bg: 'p3',
    badge: 'sale'
  },

  {
    id: 4,
    name: 'Co-ord Set Dress',
    cat: 'coord',
    image: './images/coord1.jpg',
    price: 799,
    size: '0-6M',
    stars: 4,
    bg: 'p4'
  },

  {
    id: 5,
    name: 'Gift Combo Set',
    cat: 'gift',
    image: './images/gift1.jpg',
    price: 999,
    size: '0–6M',
    stars: 5,
    bg: 'p5'
  },

  {
    id: 6,
    name: 'Muslin Nappy',
    cat: 'accessories',
    image: './images/nappy.png',
    price: 199,
    size: '0–3M',
    stars: 4,
    bg: 'p6'
  },

  {
    id: 7,
    name: 'Muslin Wipes',
    cat: 'accessories',
    image: './images/wipes.png',
    price: 149,
    size: '0–3M',
    stars: 4,
    bg: 'p7'
  },

  {
    id: 8,
    name: 'Muslin Bath Towel',
    cat: 'bath',
    image: './images/towel1.png',
    price: 299,
    size: 'All',
    stars: 4,
    bg: 'p1'
  },

  {
    id: 9,
    name: 'Hooded Towel',
    cat: 'bath',
    image: './images/towel2.jpg',
    price: 349,
    size: 'All',
    stars: 4,
    bg: 'p2'
  },

  {
    id: 10,
    name: 'Muslin Jabla Knot',
    cat: 'dresses',
    image: './images/jabla1.jpg',
    price: 499,
    orig: 699,
    size: '0–3M',
    stars: 5,
    bg: 'p3',
    badge: 'sale'
  },

  {
    id: 11,
    name: 'Muslin Jabla Button',
    cat: 'dresses',
    image: './images/jabla2.jpg',
    price: 499,
    orig: 699,
    size: '0–3M',
    stars: 5,
    bg: 'p4',
    badge: 'sale'
  }

];


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist =
  JSON.parse(localStorage.getItem("wishlist")) || [];
let isLoggedIn = false;
let isAdmin = false;
let discount = 0;

let adminProducts = [...PRODUCTS];


// ============================================================
// ADMIN LOGIN
// ============================================================

if(user.email === "admin@nivora.in"){
   isAdmin = true;
}
const ADMIN_PASS = "admin123";


// ============================================================
// AUTH STATE
// ============================================================

onAuthStateChanged(auth, (user) => {

  if (user) {

    isLoggedIn = true;

    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');

    if (nameEl) {
      nameEl.textContent = user.displayName || 'User';
    }

    if (emailEl) {
      emailEl.textContent = user.email;
    }

  } else {

    isLoggedIn = false;

  }

});


// ============================================================
// PAGE ROUTING
// ============================================================

function showPage(page) {

  document.querySelectorAll('.page').forEach((p) => {
    p.classList.remove('active');
  });

  const el = document.getElementById('page-' + page);

  if (el) {

    el.classList.add('active');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

  document.querySelectorAll('nav a[data-page]').forEach((a) => {

    a.classList.toggle(
      'active',
      a.dataset.page === page
    );

  });

  if (page === 'home') {
    renderHomeProducts();
    initReveal();
  }

  if (page === 'categories') {
    renderCategoryProducts();
    initReveal();
  }

  if (page === 'cart') {
    renderCart();
  }

  if (page === 'dashboard') {

    if (!isLoggedIn) {
      openModal('login-modal');
      return;
    }

    renderWishlistDash();
  }

  if (page === 'admin') {

    if (!isAdmin) {
      openModal('login-modal');
      showAdminLogin();
      return;
    }

    renderAdminProducts();
  }

}

window.showPage = showPage;


// ============================================================
// CATEGORY
// ============================================================

function goToCategory(category) {

  showPage('categories');

  setTimeout(() => {

    const section = document.getElementById(
      'cat-' + category + '-grid'
    );

    if (section) {

      section.scrollIntoView({
        behavior: 'smooth'
      });

    }

  }, 100);

}

window.goToCategory = goToCategory;


// ============================================================
// MODALS
// ============================================================

function openModal(id) {

  const el = document.getElementById(id);

  if (el) {
    el.classList.add('open');
  }

}

function closeModal(id) {

  const el = document.getElementById(id);

  if (el) {
    el.classList.remove('open');
  }

}

window.openModal = openModal;
window.closeModal = closeModal;


// ============================================================
// LOGIN SWITCH
// ============================================================

function switchToRegister() {

  document.getElementById('login-form-wrap').style.display = 'none';

  document.getElementById('register-form-wrap').style.display = 'block';

  document.getElementById('admin-form-wrap').style.display = 'none';

}

function switchToLogin() {

  document.getElementById('login-form-wrap').style.display = 'block';

  document.getElementById('register-form-wrap').style.display = 'none';

  document.getElementById('admin-form-wrap').style.display = 'none';

}

function showAdminLogin() {

  document.getElementById('login-form-wrap').style.display = 'none';

  document.getElementById('register-form-wrap').style.display = 'none';

  document.getElementById('admin-form-wrap').style.display = 'block';

}

window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;
window.showAdminLogin = showAdminLogin;


// ============================================================
// USER LOGIN
// ============================================================

function doLogin() {

  const email = document.getElementById('login-email').value.trim();

  const pass = document.getElementById('login-pass').value;

  if (!email || !pass) {

    showToast('Please fill all fields');
    return;

  }

  signInWithEmailAndPassword(auth, email, pass)

    .then((userCred) => {

      isLoggedIn = true;

      closeModal('login-modal');

      showToast('Login successful 🌸');

      showPage('dashboard');

    })

    .catch((err) => {

     showToast("Invalid email or password");

    });

}

window.doLogin = doLogin;


// ============================================================
// REGISTER
// ============================================================

function doRegister() {

  const email = document.getElementById('reg-email').value.trim();

  const pass = document.getElementById('reg-pass').value;

  const confirm = document.getElementById('reg-confirm').value;

  if (!email || !pass) {

    showToast('Please fill all fields');
    return;

  }

  if (pass !== confirm) {

    showToast("Passwords don't match");
    return;

  }

  createUserWithEmailAndPassword(auth, email, pass)

    .then(() => {

      showToast('Account created 🌸');

      switchToLogin();

    })

    .catch((err) => {

      showToast("Unable to create account");

    });

}

window.doRegister = doRegister;


// ============================================================
// ADMIN LOGIN
// ============================================================

function doAdminLogin() {

  const user = document.getElementById('admin-user').value.trim();

  const pass = document.getElementById('admin-pass').value;

  if (user === ADMIN_EMAIL && pass === ADMIN_PASS) {

    isAdmin = true;
    isLoggedIn = true;

    closeModal('login-modal');

    showToast('Admin login successful 🌸');

    showPage('admin');

  } else {

    showToast('Invalid admin credentials');

  }

}

window.doAdminLogin = doAdminLogin;


// ============================================================
// LOGOUT
// ============================================================

function logoutUser() {

  signOut(auth).then(() => {

    isLoggedIn = false;

    showToast('Logged out');

    showPage('home');

  });

}

window.logoutUser = logoutUser;


// ============================================================
// PRODUCT CARD
// ============================================================

function productCardHTML(p, showWishlist = true) {

  const inWish = wishlist.includes(p.id);

  const badge =
    p.badge === 'sale'
      ? `<span class="product-badge">Sale</span>`
      : '';

  const price = p.orig
    ? `<del>₹${p.orig}</del> ₹${p.price}`
    : `₹${p.price}`;

  const stars =
    '★'.repeat(p.stars || 5) +
    '☆'.repeat(5 - (p.stars || 5));

  const wishBtn = showWishlist
    ? `
      <button
        class="wishlist-btn"
        onclick="toggleWishlist(event,${p.id})"
        style="color:${inWish ? '#D4637A' : ''}">
        ${inWish ? '♥' : '♡'}
      </button>
    `
    : '';

  return `

  <div class="product-card" onclick="quickView(${p.id})">

    <div class="product-img">

      <div class="product-img-bg ${p.bg || 'p1'}">

        <img
          src="${p.image}"
          alt="${p.name}"
          style="
            width:100%;
            height:100%;
            object-fit:cover;
            border-radius:16px;
          "
        >

      </div>

      ${badge}

      ${wishBtn}

    </div>

    <div class="product-info">

      <div class="product-cat">
        ${p.cat} · ${p.size}
      </div>

      <div class="stars">
        ${stars}
      </div>

      <div class="product-name">
        ${p.name}
      </div>

      <div class="product-footer">

        <div class="product-price">
          ${price}
        </div>

        <button
          class="add-cart"
          onclick="event.stopPropagation();addToCart(${p.id})">
          +
        </button>

      </div>

    </div>

  </div>

  `;

}


// ============================================================
// RENDER HOME PRODUCTS
// ============================================================

function renderHomeProducts() {

  const grid = document.getElementById(
    'home-products-grid'
  );

  if (!grid) return;

  grid.innerHTML = adminProducts
    .map((p) => productCardHTML(p))
    .join('');

}


// ============================================================
// RENDER CATEGORY PRODUCTS
// ============================================================

function renderCategoryProducts() {

  const groups = {

    'cat-dresses-grid':
      adminProducts.filter((p) => p.cat === 'dresses'),

    'cat-coord-grid':
      adminProducts.filter((p) => p.cat === 'coord'),

    'cat-gift-grid':
      adminProducts.filter((p) => p.cat === 'gift'),

    'cat-accessories-grid':
      adminProducts.filter((p) => p.cat === 'accessories'),

    'cat-bath-grid':
      adminProducts.filter((p) => p.cat === 'bath')

  };

  Object.entries(groups).forEach(([id, products]) => {

    const el = document.getElementById(id);

    if (!el) return;

    el.innerHTML = products
      .map((p) => productCardHTML(p))
      .join('');

  });

}


// ============================================================
// ADD TO CART
// ============================================================

function addToCart(id) {

  const existing = cart.find((c) => c.id === id);

  if (existing) {

    existing.qty++;

  } else {

    cart.push({
      id,
      qty: 1
    });

  }

  updateCartBadge();

  showToast('Added to cart 🛒');

}

window.addToCart = addToCart;


// ============================================================
// CART BADGE
// ============================================================

function updateCartBadge() {

  const badge = document.getElementById('cart-count');

  if (!badge) return;

  const total = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  badge.textContent = total;
localStorage.setItem("cart", JSON.stringify(cart));

}


// ============================================================
// TOAST
// ============================================================

let toastTimer;

function showToast(msg) {

  const toast = document.getElementById('toast');

  if (!toast) return;

  toast.textContent = msg;

  toast.classList.add('show');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove('show');

  }, 3000);

}

window.showToast = showToast;


// ============================================================
// WISHLIST
// ============================================================

function toggleWishlist(e, id) {

  e.stopPropagation();

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter((x) => x !== id);

  } else {

    wishlist.push(id);

  }
localStorage.setItem(
  "wishlist",
  JSON.stringify(wishlist)
);

  renderHomeProducts();
  renderCategoryProducts();

}

window.toggleWishlist = toggleWishlist;


// ============================================================
// QUICK VIEW
// ============================================================

function quickView(id) {

  const p = adminProducts.find((x) => x.id === id);

  if (!p) return;

  document.getElementById(
    'product-modal-content'
  ).innerHTML = `

  <div style="
    display:grid;
    grid-template-columns:
    repeat(auto-fit,minmax(280px,1fr));
    
    gap:1.5rem;
    align-items:start;
  ">

    <div
      class="product-img-bg ${p.bg}"
      style="
        aspect-ratio:1;
        border-radius:16px;
        overflow:hidden;
      ">

      <img
        src="${p.image}"
        alt="${p.name}"
        style="
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

    </div>

    <div>

      <h2>${p.name}</h2>

      <div style="
        margin:.8rem 0;
        font-size:1.2rem;
        font-weight:700;
      ">
        ₹${p.price}
      </div>

      <button
        class="btn-rose"
        onclick="addToCart(${p.id})">
        Add To Cart 🛒
      </button>

    </div>

  </div>

  `;

  openModal('product-modal');

}

window.quickView = quickView;


// ============================================================
// ADMIN PRODUCTS
// ============================================================

function renderAdminProducts() {

  const tbody = document.getElementById(
    'admin-products-tbody'
  );

  if (!tbody) return;

  tbody.innerHTML = adminProducts.map((p) => `

    <tr>

      <td>${p.name}</td>

      <td>${p.cat}</td>

      <td>₹${p.price}</td>

      <td>

        <button onclick="deleteProduct(${p.id})">
          Delete
        </button>

      </td>

    </tr>

  `).join('');

}

window.renderAdminProducts = renderAdminProducts;


// ============================================================
// DELETE PRODUCT
// ============================================================

function deleteProduct(id) {

  adminProducts = adminProducts.filter(
    (p) => p.id !== id
  );

  renderAdminProducts();

  renderHomeProducts();

  renderCategoryProducts();

  showToast('Product deleted');

}

window.deleteProduct = deleteProduct;


// ============================================================
// SCROLL REVEAL
// ============================================================

function initReveal() {

  const io = new IntersectionObserver(

    (entries) => {

      entries.forEach((e) => {

        if (e.isIntersecting) {

          e.target.classList.add('visible');

          io.unobserve(e.target);

        }

      });

    },

    {
      threshold: 0.1
    }

  );

  document.querySelectorAll('.reveal').forEach((el) => {

    el.classList.remove('visible');

    io.observe(el);

  });

}


// ============================================================
// HERO SLIDER
// ============================================================

window.addEventListener("DOMContentLoaded", () => {

  let currentSlide = 0;

  const slides = document.querySelectorAll(".hero-image");

  if (!slides.length) return;

  slides[0].classList.add("active");

  function showNextSlide() {

    slides[currentSlide].classList.remove("active");

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add("active");

  }

  setInterval(showNextSlide, 3000);

});


// ============================================================
// ESC KEY
// ============================================================

document.addEventListener('keydown', function(e) {

  if (e.key === 'Escape') {

    document
      .querySelectorAll('.modal-overlay')
      .forEach((m) => m.classList.remove('open'));

  }

});


// ============================================================
// INIT
// ============================================================

window.addEventListener('load', () => {

  renderHomeProducts();

  renderCategoryProducts();

  updateCartBadge();

  initReveal();

});
