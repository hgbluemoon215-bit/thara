// ============================================================
// FIREBASE IMPORTS
// ============================================================
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
// STATE MANAGEMENT
// ============================================================
const STATE = {
  cart: JSON.parse(localStorage.getItem('cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
  isLoggedIn: false,
  isAdmin: false,
  discount: 0,
  products: []
};

function saveState() {
  localStorage.setItem('cart', JSON.stringify(STATE.cart));
  localStorage.setItem('wishlist', JSON.stringify(STATE.wishlist));
}

// ============================================================
// PRODUCTS
// ============================================================
STATE.products = [
  {id:1,name:'Muslin Frock Button',cat:'dresses',image:'./images/frock1.png',price:699,orig:899,size:'0–6M',stars:5,bg:'p1',badge:'sale'},
  {id:2,name:'Muslin Frock Knot',cat:'dresses',image:'./images/frock2.jpeg',price:699,orig:899,size:'0–6M',stars:5,bg:'p1',badge:'sale'},
  {id:3,name:'Muslin Frock Zip',cat:'dresses',image:'./images/frock3.png',price:699,orig:899,size:'0–6M',stars:5,bg:'p1',badge:'sale'},
  {id:4,name:'Co-ord Set Dress',cat:'coord',image:'./images/coord1.jpg',price:799,size:'0-6M',stars:4,bg:'p2'},
  {id:5,name:'Gift Combo Set',cat:'gift',image:'./images/gift1.jpg',price:999,size:'0–6M',stars:5,bg:'p3'},
  {id:6,name:'Muslin Nappy',cat:'accessories',image:'./images/nappy.png',price:199,size:'0–3M',stars:4,bg:'p4'},
  {id:7,name:'Muslin Wipes',cat:'accessories',image:'./images/wipes.png',price:149,size:'0–3M',stars:4,bg:'p5'},
  {id:8,name:'Muslin Bath Towel',cat:'bath',image:'./images/towel1.png',price:299,size:'All',stars:4,bg:'p6'},
  {id:9,name:'Hooded Towel',cat:'bath',image:'./images/towel2.jpg',price:349,size:'All',stars:4,bg:'p7'},
  {id:10,name:'Muslin Jabla Knot',cat:'dresses',image:'./images/jabla1.jpg',price:499,orig:699,size:'0–3M',stars:5,badge:'sale'},
  {id:11,name:'Muslin Jabla Button',cat:'dresses',image:'./images/jabla2.jpg',price:499,orig:699,size:'0–3M',stars:5,bg:'p1',badge:'sale'}
];

// ============================================================
// AUTH
// ============================================================
onAuthStateChanged(auth, (user) => {
  STATE.isLoggedIn = !!user;

  if (user) {
    document.getElementById('user-name').textContent = user.displayName || "User";
    document.getElementById('user-email').textContent = user.email;
  }
});

// ============================================================
// LOGIN
// ============================================================
window.doLogin = function () {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;

  signInWithEmailAndPassword(auth, email, pass)
    .then(() => {
      showToast("Login successful 🌸");
      closeModal('login-modal');
      showPage('dashboard');
    })
    .catch(err => showToast(err.message));
};

window.doRegister = function () {
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pass').value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => showToast("Account created 🌸"))
    .catch(err => showToast(err.message));
};

window.logoutUser = function () {
  signOut(auth);
  STATE.isLoggedIn = false;
  showPage('home');
};

// ============================================================
// CART
// ============================================================
window.addToCart = function (id) {
  const item = STATE.cart.find(c => c.id === id);

  if (item) item.qty++;
  else STATE.cart.push({ id, qty: 1 });

  saveState();
  updateCartBadge();
  showToast("Added to cart 🛒");
};

function updateCartBadge() {
  const el = document.getElementById('cart-count');
  if (!el) return;

  const total = STATE.cart.reduce((s, c) => s + c.qty, 0);
  el.textContent = total;
}

window.changeQty = function (id, delta) {
  const item = STATE.cart.find(c => c.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    STATE.cart = STATE.cart.filter(c => c.id !== id);
  }

  saveState();
  renderCart();
  updateCartBadge();
};

window.removeFromCart = function (id) {
  STATE.cart = STATE.cart.filter(c => c.id !== id);
  saveState();
  renderCart();
  updateCartBadge();
};

// ============================================================
// WISHLIST
// ============================================================
window.toggleWishlist = function (e, id) {
  e.stopPropagation();

  if (STATE.wishlist.includes(id)) {
    STATE.wishlist = STATE.wishlist.filter(x => x !== id);
  } else {
    STATE.wishlist.push(id);
  }

  saveState();
  renderHomeProducts();
};

// ============================================================
// RENDER PRODUCTS
// ============================================================
function productCardHTML(p) {
  return `
  <div class="product-card" onclick="quickView(${p.id})">
    <div class="product-img">
      <img src="${p.image}" loading="lazy"/>
    </div>
    <div class="product-info">
      <div>${p.name}</div>
      <div>₹${p.price}</div>
      <button onclick="event.stopPropagation();addToCart(${p.id})">+</button>
    </div>
  </div>`;
}

function renderHomeProducts() {
  const grid = document.getElementById('home-products-grid');
  if (!grid) return;

  grid.innerHTML = STATE.products.map(productCardHTML).join('');
}

// ============================================================
// CART RENDER
// ============================================================
function renderCart() {
  const el = document.getElementById('cart-items-list');
  if (!el) return;

  if (STATE.cart.length === 0) {
    el.innerHTML = "<p>Cart empty</p>";
    return;
  }

  el.innerHTML = STATE.cart.map(c => {
    const p = STATE.products.find(x => x.id === c.id);
    return `<div>${p.name} x ${c.qty}</div>`;
  }).join('');
}

// ============================================================
// UI HELPERS
// ============================================================
window.showToast = function (msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
};

window.openModal = id => document.getElementById(id)?.classList.add('open');
window.closeModal = id => document.getElementById(id)?.classList.remove('open');

// ============================================================
// PAGE ROUTING
// ============================================================
window.showPage = function (page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');

  if (page === 'cart') renderCart();
};

// ============================================================
// INIT
// ============================================================
window.addEventListener('load', () => {
  renderHomeProducts();
  renderCart();
  updateCartBadge();
});