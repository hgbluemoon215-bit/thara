
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
// DATA
// ============================================================
const PRODUCTS = [
  {id:1, name:'Muslin Frock Button', cat:'dresses', image:'images/frock1.jpg'},
  {id:2, name:'Muslin Frock Knot', cat:'dresses', image:'images/frock2.jpg'},
  {id:3, name:'Muslin Frock Zip', cat:'dresses', image:'images/frock3.jpg'},

  {id:4, name:'Co-ord Set Dress', cat:'coord', image:'images/coord1.jpg'},

  {id:5, name:'Gift Combo Set', cat:'gift', image:'images/gift1.jpg'},

  {id:6, name:'Muslin Nappy', cat:'accessories', image:'images/nappy.jpg'},
  {id:7, name:'Muslin Wipes', cat:'accessories', image:'images/wipes.jpg'},

  {id:8, name:'Muslin Bath Towel', cat:'bath', image:'images/towel1.jpg'},
  {id:9, name:'Hooded Towel', cat:'bath', image:'images/towel2.jpg'}
];
  
// ================= CATEGORY FUNCTION =================
function goToCategory(category){
  const filtered = PRODUCTS.filter(p => p.cat === category);
  renderProducts(filtered);   // already in your code
  showPage('shop');           // your shop/products page
}
let cart = [{id:1,qty:1},{id:3,qty:1}];
let wishlist = [2,5,6,8];
let isLoggedIn = false;
let isAdmin = false;
let discount = 0;
let adminProducts = [...PRODUCTS];

// ============================================================
// ADMIN CREDENTIALS
// ============================================================
const ADMIN_EMAIL = "admin@nivora.in";   // ← change to your admin email
const ADMIN_PASS  = "admin123";          // ← change to your admin password

// ============================================================
// AUTH STATE LISTENER
// ============================================================
onAuthStateChanged(auth, (user) => {
  if (user) {
    isLoggedIn = true;
    const nameEl  = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    if (nameEl)  nameEl.textContent  = user.displayName || 'User';
    if (emailEl) emailEl.textContent = user.email;
  } else {
    isLoggedIn = false;
  }
});

// ============================================================
// PAGE ROUTING
// ============================================================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) { el.classList.add('active'); window.scrollTo({top:0, behavior:'smooth'}); }

  document.querySelectorAll('nav a[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  if (page === 'home')       { renderHomeProducts(); initReveal(); }
  if (page === 'categories') { renderCategoryProducts(); initReveal(); }
  if (page === 'cart')       { renderCart(); }
  if (page === 'checkout')   { renderCheckoutSummary(); resetCheckoutSteps(); }
  if (page === 'dashboard') {
    if (!isLoggedIn) { openModal('login-modal'); return; }
    renderWishlistDash();
  }
  if (page === 'admin') {
    if (!isAdmin) { openModal('login-modal'); showAdminLogin(); return; }
    renderAdminProducts();
  }
}

window.showPage = showPage;

function scrollToSection(id) {
  showPage('home');
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior:'smooth'});
  }, 100);
}
window.scrollToSection = scrollToSection;

function goToCategory(cat) { showPage('categories'); }
window.goToCategory = goToCategory;

// ============================================================
// MODAL HELPERS
// ============================================================
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
window.openModal  = openModal;
window.closeModal = closeModal;

function switchToRegister() {
  document.getElementById('login-form-wrap').style.display    = 'none';
  document.getElementById('register-form-wrap').style.display = 'block';
  document.getElementById('admin-form-wrap').style.display    = 'none';
}
function switchToLogin() {
  document.getElementById('login-form-wrap').style.display    = 'block';
  document.getElementById('register-form-wrap').style.display = 'none';
  document.getElementById('admin-form-wrap').style.display    = 'none';
}
function showAdminLogin() {
  document.getElementById('login-form-wrap').style.display    = 'none';
  document.getElementById('register-form-wrap').style.display = 'none';
  document.getElementById('admin-form-wrap').style.display    = 'block';
}
window.switchToRegister = switchToRegister;
window.switchToLogin    = switchToLogin;
window.showAdminLogin   = showAdminLogin;

// ============================================================
// AUTH FUNCTIONS
// ============================================================
function handleUserIcon() {
  if (isLoggedIn) showPage('dashboard');
  else openModal('login-modal');
}
window.handleUserIcon = handleUserIcon;

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;

  if (!email || !pass) { showToast('Please fill all fields'); return; }

  signInWithEmailAndPassword(auth, email, pass)
    .then((userCred) => {
      isLoggedIn = true;
      closeModal('login-modal');
      showToast('Login successful 🌸');
      const nameEl  = document.getElementById('user-name');
      const emailEl = document.getElementById('user-email');
      if (nameEl)  nameEl.textContent  = userCred.user.displayName || 'User';
      if (emailEl) emailEl.textContent = userCred.user.email;
      showPage('dashboard');
    })
    .catch(err => showToast(err.message));
}
window.doLogin = doLogin;

function doRegister() {
  const email   = document.getElementById('reg-email').value.trim();
  const pass    = document.getElementById('reg-pass').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (!email || !pass)    { showToast('Please fill all fields'); return; }
  if (pass !== confirm)   { showToast("Passwords don't match");  return; }

  createUserWithEmailAndPassword(auth, email, pass)
    .then(() => {
      showToast('Account created 🌸');
      switchToLogin();
    })
    .catch(err => showToast(err.message));
}
window.doRegister = doRegister;

function doAdminLogin() {
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value;

  if (user === ADMIN_EMAIL && pass === ADMIN_PASS) {
    isAdmin    = true;
    isLoggedIn = true;
    closeModal('login-modal');
    showToast('Admin login successful 🌸');
    showPage('admin');
  } else {
    showToast('Invalid admin credentials');
  }
}
window.doAdminLogin = doAdminLogin;

function logoutUser() {
  signOut(auth).then(() => {
    isLoggedIn = false;
    showToast('Logged out');
    showPage('home');
  });
}
window.logoutUser = logoutUser;

function logoutAdmin() {
  isAdmin    = false;
  isLoggedIn = false;
  showToast('Logged out');
  showPage('home');
}
window.logoutAdmin = logoutAdmin;

// ============================================================
// RENDER PRODUCTS
// ============================================================
function productCardHTML(p, showWishlist = true) {
  const inWish  = wishlist.includes(p.id);
  const badge   = p.badge === 'sale' ? `<span class="product-badge">Sale</span>`
                : p.badge === 'new'  ? `<span class="product-badge new">New</span>` : '';
  const price   = p.orig ? `<del>₹${p.orig}</del> ₹${p.price}` : `₹${p.price}`;
  const stars   = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
  const wishBtn = showWishlist
    ? `<button class="wishlist-btn" onclick="toggleWishlist(event,${p.id})" style="color:${inWish ? '#D4637A' : ''}">${inWish ? '♥' : '♡'}</button>`
    : '';
  return `<div class="product-card" onclick="quickView(${p.id})">
    <div class="product-img"><div class="product-img-bg ${p.bg}">${p.emoji}</div>${badge}${wishBtn}</div>
    <div class="product-info">
      <div class="product-cat">${p.cat} · ${p.size}</div>
      <div class="stars">${stars}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-footer">
        <div class="product-price">${price}</div>
        <button class="add-cart" onclick="event.stopPropagation();addToCart(${p.id})">+</button>
      </div>
    </div>
  </div>`;
}

function renderHomeProducts() {
  const grid = document.getElementById('home-products-grid');
  if (grid) grid.innerHTML = adminProducts.map(p => productCardHTML(p)).join('');
}

function renderCategoryProducts() {
  const groups = {
    'cat-dresses-grid': adminProducts.filter(p => p.cat === 'Dresses'),
    'cat-rompers-grid': adminProducts.filter(p => p.cat === 'Rompers'),
    'cat-sleep-grid':   adminProducts.filter(p => p.cat === 'Sleep Suits'),
    'cat-gifts-grid':   adminProducts.filter(p => p.cat === 'Gift Sets'),
  };
  Object.entries(groups).forEach(([id, prods]) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = prods.map(p => productCardHTML(p)).join('')
      || '<p style="color:var(--muted);padding:1rem">No products in this category yet.</p>';
  });
}

function renderAdminProducts() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;
  tbody.innerHTML = adminProducts.map(p => `
    <tr>
      <td><div class="inline-flex"><div class="product-thumb ${p.bg}">${p.emoji}</div>${p.name}</div></td>
      <td>${p.cat}</td>
      <td>${p.orig ? `<del style="color:var(--muted);font-size:.8rem">₹${p.orig}</del> ` : ''}<strong>₹${p.price}</strong></td>
      <td>${Math.floor(Math.random() * 80) + 10}</td>
      <td>${p.badge ? `<span class="product-badge ${p.badge === 'new' ? 'new' : ''}">${p.badge}</span>` : '-'}</td>
      <td><div class="action-btns">
        <button class="action-btn btn-edit" onclick="showToast('Edit: ${p.name}')">✏️</button>
        <button class="action-btn btn-del"  onclick="deleteProduct(${p.id})">🗑</button>
      </div></td>
    </tr>`).join('');
}
window.renderAdminProducts = renderAdminProducts;

// ============================================================
// CART
// ============================================================
function addToCart(id) {
  const existing = cart.find(c => c.id === id);
  if (existing) existing.qty++;
  else cart.push({id, qty:1});
  updateCartBadge();
  const p = adminProducts.find(x => x.id === id);
  showToast(`${p.name} added to cart! 🛒`);
}
window.addToCart = addToCart;

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const badge = document.getElementById('cart-count');
  if (!badge) return;
  badge.textContent = total;
  badge.style.transform = 'scale(1.5)';
  setTimeout(() => badge.style.transform = '', 250);
}

function renderCart() {
  const list = document.getElementById('cart-items-list');
  if (!list) return;
  if (cart.length === 0) {
    list.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">🛒</div>
      <h3>Your cart is empty</h3>
      <p>Add some beautiful pieces for your little one!</p>
      <button class="btn-rose" onclick="showPage('categories')">Shop Now 🌸</button>
    </div>`;
    updateCartTotals(); return;
  }
  list.innerHTML = cart.map(c => {
    const p = adminProducts.find(x => x.id === c.id);
    if (!p) return '';
    return `<div class="cart-item">
      <div class="cart-item-img ${p.bg}">${p.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-meta">${p.cat} · ${p.size}</div>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
          <span class="qty-val">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${p.id},1)">+</button>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:.5rem">
        <div class="cart-item-price">₹${p.price * c.qty}</div>
        <button class="cart-item-del" onclick="removeFromCart(${p.id})">🗑</button>
      </div>
    </div>`;
  }).join('');
  updateCartTotals();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart(); updateCartBadge();
}
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart(); updateCartBadge();
}
function clearCart() {
  cart = []; renderCart(); updateCartBadge();
}
function updateCartTotals() {
  const subtotal = cart.reduce((s, c) => {
    const p = adminProducts.find(x => x.id === c.id);
    return s + (p ? p.price * c.qty : 0);
  }, 0);
  const dis   = Math.round(subtotal * discount);
  const total = subtotal - dis;
  const sub  = document.getElementById('cart-subtotal');
  const disc = document.getElementById('cart-discount');
  const tot  = document.getElementById('cart-total');
  const ship = document.getElementById('cart-shipping');
  if (sub)  sub.textContent  = '₹' + subtotal;
  if (disc) disc.textContent = '-₹' + dis;
  if (tot)  tot.textContent  = '₹' + total;
  if (ship) ship.textContent = subtotal > 999 ? 'FREE' : '₹49';
}
function applyCoupon() {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  if (code === 'NIVORA15') { discount = 0.15; showToast('Coupon applied! 15% off 🎉'); renderCart(); }
  else showToast('Invalid coupon code');
}
window.changeQty    = changeQty;
window.removeFromCart = removeFromCart;
window.clearCart    = clearCart;
window.applyCoupon  = applyCoupon;

// ============================================================
// CHECKOUT
// ============================================================
function renderCheckoutSummary() {
  const list = document.getElementById('checkout-items-list');
  if (!list) return;
  list.innerHTML = cart.map(c => {
    const p = adminProducts.find(x => x.id === c.id);
    if (!p) return '';
    return `<div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.8rem;padding-bottom:.8rem;border-bottom:1px solid rgba(212,99,122,.06)">
      <div style="width:44px;height:44px;border-radius:10px;display:grid;place-items:center;font-size:1.3rem;flex-shrink:0" class="${p.bg}">${p.emoji}</div>
      <div style="flex:1;font-size:.88rem">${p.name}<br/><span style="color:var(--muted);font-size:.75rem">Qty: ${c.qty}</span></div>
      <div style="font-weight:600;font-size:.9rem">₹${p.price * c.qty}</div>
    </div>`;
  }).join('');
  const subtotal = cart.reduce((s, c) => {
    const p = adminProducts.find(x => x.id === c.id);
    return s + (p ? p.price * c.qty : 0);
  }, 0);
  const el1 = document.getElementById('co-subtotal');
  const el2 = document.getElementById('co-total');
  if (el1) el1.textContent = '₹' + subtotal;
  if (el2) el2.textContent = '₹' + subtotal;
}
function resetCheckoutSteps() {
  document.getElementById('checkout-step-2').style.display = 'block';
  document.getElementById('checkout-step-3').style.display = 'none';
  document.getElementById('checkout-step-4').style.display = 'none';
  document.getElementById('step2').classList.add('active');
  document.getElementById('step3').classList.remove('active','done');
  document.getElementById('step4').classList.remove('active','done');
}
function goToPayment() {
  document.getElementById('checkout-step-2').style.display = 'none';
  document.getElementById('checkout-step-3').style.display = 'block';
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step2').classList.add('done');
  document.getElementById('step3').classList.add('active');
}
function backToAddress() {
  document.getElementById('checkout-step-3').style.display = 'none';
  document.getElementById('checkout-step-2').style.display = 'block';
  document.getElementById('step3').classList.remove('active');
  document.getElementById('step2').classList.remove('done');
  document.getElementById('step2').classList.add('active');
}
function placeOrder() {
  document.getElementById('checkout-step-3').style.display = 'none';
  document.getElementById('checkout-step-4').style.display = 'block';
  document.getElementById('step3').classList.remove('active');
  document.getElementById('step3').classList.add('done');
  document.getElementById('step4').classList.add('active','done');
  document.getElementById('order-id').textContent = '#NVR' + Date.now().toString().slice(-6);
  cart = []; updateCartBadge();
}
function selectPayMethod(el) {
  document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
}
function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}
window.goToPayment      = goToPayment;
window.backToAddress    = backToAddress;
window.placeOrder       = placeOrder;
window.selectPayMethod  = selectPayMethod;
window.formatCard       = formatCard;

// ============================================================
// WISHLIST
// ============================================================
function toggleWishlist(e, id) {
  e.stopPropagation();
  if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  const p = adminProducts.find(x => x.id === id);
  showToast(wishlist.includes(id) ? `Added to wishlist ♥` : p.name + ' removed from wishlist');
  renderHomeProducts();
  renderCategoryProducts();
}
function renderWishlistDash() {
  const grid  = document.getElementById('wishlist-grid');
  if (!grid) return;
  const items = adminProducts.filter(p => wishlist.includes(p.id));
  grid.innerHTML = items.length ? items.map(p => `
    <div class="product-card">
      <div class="product-img"><div class="product-img-bg ${p.bg}">${p.emoji}</div>
      <button class="wishlist-btn" onclick="toggleWishlistDash(${p.id})" style="color:#D4637A">♥</button></div>
      <div class="product-info">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price">₹${p.price}</div>
          <button class="add-cart" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>`).join('')
    : '<p style="color:var(--muted);padding:1rem">Your wishlist is empty. Start adding your favourites! 🌸</p>';
}
function toggleWishlistDash(id) {
  wishlist = wishlist.filter(x => x !== id);
  renderWishlistDash();
}
window.toggleWishlist     = toggleWishlist;
window.toggleWishlistDash = toggleWishlistDash;

// ============================================================
// QUICK VIEW
// ============================================================
function quickView(id) {
  const p = adminProducts.find(x => x.id === id);
  if (!p) return;
  const price = p.orig
    ? `<del style="color:var(--muted)">₹${p.orig}</del> <strong style="color:var(--rose);font-size:1.3rem">₹${p.price}</strong>`
    : `<strong style="font-size:1.3rem">₹${p.price}</strong>`;
  const stars = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
  document.getElementById('product-modal-content').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start">
      <div class="product-img-bg ${p.bg}" style="aspect-ratio:1;border-radius:16px;font-size:5rem">${p.emoji}</div>
      <div>
        <div style="font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:.4rem">${p.cat}</div>
        <h2 style="font-family:var(--ff-head);font-size:1.5rem;margin-bottom:.5rem">${p.name}</h2>
        <div style="font-size:.85rem;color:var(--rose);margin-bottom:.8rem">${stars}</div>
        <div style="margin-bottom:1rem">${price}</div>
        <div style="background:var(--warm);border-radius:10px;padding:.8rem 1rem;font-size:.83rem;color:var(--muted);margin-bottom:1rem">
          📦 Size: ${p.size} &nbsp;·&nbsp; 🌿 100% Organic Muslin
        </div>
        <div style="display:flex;gap:.8rem">
          <button class="btn-rose" style="flex:1" onclick="addToCart(${p.id});closeModal('product-modal')">Add to Cart 🛒</button>
          <button class="btn-ghost" onclick="toggleWishlist(event,${p.id});closeModal('product-modal')">♡</button>
        </div>
      </div>
    </div>`;
  openModal('product-modal');
}
window.quickView = quickView;

// ============================================================
// DASHBOARD NAV
// ============================================================
function showDashSection(name) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.remove('active'));
  const sec = document.getElementById('dash-' + name);
  if (sec) sec.classList.add('active');
  if (event && event.currentTarget) event.currentTarget.classList.add('active');
  if (name === 'wishlist') renderWishlistDash();
}
window.showDashSection = showDashSection;

// ============================================================
// ADMIN NAV & ACTIONS
// ============================================================
function showAdminSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  const sec = document.getElementById('admin-' + name);
  if (sec) sec.classList.add('active');
  if (event && event.currentTarget) event.currentTarget.classList.add('active');
}
function toggleAddProductForm() {
  const f = document.getElementById('add-product-form');
  f.style.display = f.style.display === 'none' ? 'block' : 'none';
}
function addProduct() {
  const name  = document.getElementById('ap-name').value.trim();
  const cat   = document.getElementById('ap-cat').value;
  const price = parseInt(document.getElementById('ap-price').value) || 0;
  const orig  = parseInt(document.getElementById('ap-orig').value)  || 0;
  const size  = document.getElementById('ap-size').value;
  const emoji = document.getElementById('ap-emoji').value || '👶';
  const badge = document.getElementById('ap-badge').value;
  if (!name || !price) { showToast('Please fill required fields'); return; }
  const bgs  = ['p1','p2','p3','p4','p5','p6','p7','p8'];
  const newP = { id:Date.now(), name, cat, size, price, orig:orig||undefined, emoji, bg:bgs[adminProducts.length%8], badge, stars:5 };
  adminProducts.push(newP);
  renderAdminProducts();
  toggleAddProductForm();
  showToast('Product added successfully! 🌸');
  document.getElementById('ap-name').value  = '';
  document.getElementById('ap-price').value = '';
  document.getElementById('ap-orig').value  = '';
  document.getElementById('ap-emoji').value = '';
}
function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  adminProducts = adminProducts.filter(p => p.id !== id);
  renderAdminProducts();
  showToast('Product deleted');
}
function updateOrderStatus(select) {
  showToast('Order status updated to: ' + select.value + ' ✓');
}
window.showAdminSection     = showAdminSection;
window.toggleAddProductForm = toggleAddProductForm;
window.addProduct           = addProduct;
window.deleteProduct        = deleteProduct;
window.updateOrderStatus    = updateOrderStatus;

// ============================================================
// SEARCH
// ============================================================
let searchOpen = false;
function toggleSearch(forceClose = false) {
  const ov = document.getElementById('search-overlay');
  if (forceClose) { ov.classList.remove('open'); searchOpen = false; return; }
  searchOpen = !searchOpen;
  ov.classList.toggle('open', searchOpen);
  if (searchOpen) setTimeout(() => document.getElementById('search-input').focus(), 50);
}
window.toggleSearch = toggleSearch;

// ============================================================
// FILTER TABS
// ============================================================
function filterTab(el) {
  const siblings = el.closest('div').querySelectorAll('.tab');
  siblings.forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
window.filterTab = filterTab;

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}
window.showToast = showToast;

// ============================================================
// SCROLL REVEAL
// ============================================================
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, {threshold: 0.1});
  document.querySelectorAll('.reveal').forEach(el => { el.classList.remove('visible'); io.observe(el); });
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
    toggleSearch(true);
  }
  // Ctrl + Shift + A = open admin login
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    openModal('login-modal');
    showAdminLogin();
  }
});

// ============================================================
// INIT
// ============================================================
window.addEventListener('load', () => {
  renderHomeProducts();
  updateCartBadge();
  initReveal();
});

// ================= HERO SLIDER =================
window.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".hero-image");

  function showNextSlide(){
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  setInterval(showNextSlide, 3000);
});