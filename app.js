/* ============================================
   LUXE E-COMMERCE — APP.JS
   ============================================ */

// ===== DATA =====
const PRODUCTS = [
  { id: 1, name: 'Wireless Earbuds Pro', category: 'Electronics', price: 3499, oldPrice: 4999, emoji: '🎧', rating: 4.8, reviews: 2341, badge: 'hot', desc: 'Premium sound quality with active noise cancellation, 30-hour battery life, and ultra-comfortable fit for all-day wear.' },
  { id: 2, name: 'Smart Watch Series 5', category: 'Electronics', price: 8999, oldPrice: 12999, emoji: '⌚', rating: 4.7, reviews: 1892, badge: 'sale', desc: 'Track health metrics, notifications, and more. Water-resistant with a stunning AMOLED display and 7-day battery.' },
  { id: 3, name: 'Linen Blazer', category: 'Fashion', price: 2299, oldPrice: null, emoji: '🧥', rating: 4.9, reviews: 456, badge: 'new', desc: 'Premium linen blend blazer with a modern slim cut. Perfect for both casual and business occasions.' },
  { id: 4, name: 'Leather Sneakers', category: 'Fashion', price: 3799, oldPrice: 4500, emoji: '👟', rating: 4.6, reviews: 987, badge: 'sale', desc: 'Handcrafted genuine leather sneakers with memory foam insole. A timeless silhouette for every wardrobe.' },
  { id: 5, name: 'Aromatherapy Diffuser', category: 'Home', price: 1299, oldPrice: 1899, emoji: '🕯️', rating: 4.8, reviews: 734, badge: null, desc: 'Ultrasonic essential oil diffuser with 7 LED colors, whisper-quiet operation and 12-hour timer.' },
  { id: 6, name: 'Ceramic Pour-Over Set', category: 'Home', price: 1599, oldPrice: null, emoji: '☕', rating: 4.9, reviews: 312, badge: 'new', desc: 'Handmade ceramic pour-over coffee set. Includes dripper, server, and two cups. Microwave and dishwasher safe.' },
  { id: 7, name: 'Vitamin C Serum', category: 'Beauty', price: 849, oldPrice: 1200, emoji: '✨', rating: 4.7, reviews: 2109, badge: 'hot', desc: 'Brightening vitamin C serum with hyaluronic acid and niacinamide. Clinically proven to reduce dark spots in 4 weeks.' },
  { id: 8, name: 'Facial Roller Kit', category: 'Beauty', price: 599, oldPrice: 899, emoji: '💎', rating: 4.5, reviews: 1203, badge: 'sale', desc: 'Rose quartz facial roller and gua sha set. Reduces puffiness, improves circulation, and enhances product absorption.' },
  { id: 9, name: 'Yoga Mat Pro', category: 'Sports', price: 1799, oldPrice: 2499, emoji: '🧘', rating: 4.8, reviews: 876, badge: null, desc: '6mm thick non-slip yoga mat with alignment lines. Eco-friendly natural rubber with carrying strap included.' },
  { id: 10, name: 'Resistance Band Set', category: 'Sports', price: 699, oldPrice: null, emoji: '💪', rating: 4.6, reviews: 543, badge: 'new', desc: '5-piece resistance band set with handles, door anchor, and ankle straps. Perfect for home workouts.' },
  { id: 11, name: 'Portable Speaker', category: 'Electronics', price: 2499, oldPrice: 3299, emoji: '🔊', rating: 4.7, reviews: 1567, badge: null, desc: '360° surround sound with IP67 waterproof rating and 24-hour playtime. Connect two for stereo pairing.' },
  { id: 12, name: 'Silk Sleep Set', category: 'Fashion', price: 2999, oldPrice: null, emoji: '🌙', rating: 4.9, reviews: 289, badge: 'new', desc: '100% mulberry silk pillowcase and eye mask set. Reduces hair frizz and helps skin hydration overnight.' },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('luxe_cart') || '[]');
let currentFilter = 'All';
let users = JSON.parse(localStorage.getItem('luxe_users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('luxe_user') || 'null');

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(PRODUCTS);
  updateCartUI();
  updateUserBtn();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  });
});

// ===== RENDER PRODUCTS =====
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!products.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gray);font-size:18px;">No products found in this category.</div>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <div class="product-card" onclick="openModal(${p.id})">
      <div class="product-img-wrap" style="background: ${getBg(p.category)}">
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : ''}
        <button class="product-wishlist" onclick="wishlist(event,${p.id})">♡</button>
        <div class="product-emoji">${p.emoji}</div>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars">${getStars(p.rating)}</span>
          <span class="rating-count">(${p.reviews.toLocaleString()})</span>
        </div>
        <div class="product-price-row">
          <div class="price-wrap">
            <span class="price">₹${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="price-old">₹${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <button class="add-cart-btn" onclick="addToCart(event,${p.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getBg(category) {
  const map = {
    'Electronics': 'linear-gradient(135deg,#e8f4fd,#bee3f8)',
    'Fashion': 'linear-gradient(135deg,#fde8f4,#f8b3e0)',
    'Home': 'linear-gradient(135deg,#e8fde8,#b3f8b3)',
    'Beauty': 'linear-gradient(135deg,#fdf5e8,#f8e0b3)',
    'Sports': 'linear-gradient(135deg,#fde8e8,#f8b3b3)',
  };
  return map[category] || 'linear-gradient(135deg,#f0ebe4,#e8c99a)';
}

function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

// ===== FILTER =====
function filterProducts(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = cat === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
  renderProducts(filtered);
}

function filterByCategory(cat) {
  scrollToProducts();
  setTimeout(() => {
    const btn = [...document.querySelectorAll('.filter-btn')].find(b => b.textContent.trim() === cat || (cat === 'All' && b.textContent.trim() === 'All'));
    if (btn) filterProducts(cat, btn);
  }, 500);
}

function scrollToProducts() {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ===== CART =====
function addToCart(e, id) {
  e.stopPropagation();
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`${product.emoji} ${product.name} added to cart!`);

  // Animate button
  const btn = e.currentTarget;
  btn.style.transform = 'rotate(180deg) scale(1.3)';
  btn.style.background = 'var(--green)';
  setTimeout(() => { btn.style.transform = ''; btn.style.background = ''; }, 500);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

function saveCart() {
  localStorage.setItem('luxe_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById('cartCount');
  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString();

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><span>🛍️</span><p>Your cart is empty</p></div>`;
    footerEl.style.display = 'none';
  } else {
    footerEl.style.display = 'flex';
    itemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="cart-item-img">${i.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-price">₹${(i.price * i.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
            <span class="qty-num">${i.qty}</span>
            <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${i.id})">✕</button>
      </div>
    `).join('');
  }
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}
document.getElementById('cartBtn').addEventListener('click', openCart);

function checkout() {
  if (!currentUser) {
    closeCart();
    setTimeout(() => openLogin(), 300);
    showToast('Please login to checkout 🔐');
    return;
  }
  showToast('🎉 Order placed successfully! Thank you, ' + currentUser.name.split(' ')[0] + '!');
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}

// ===== PRODUCT MODAL =====
function openModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-img-side" style="background:${getBg(p.category)}">${p.emoji}</div>
    <div class="modal-info-side">
      <div class="modal-category">${p.category}</div>
      <h2 class="modal-name">${p.name}</h2>
      <div class="modal-rating">
        <span class="stars">${getStars(p.rating)}</span>
        <span class="rating-count">${p.rating} · ${p.reviews.toLocaleString()} reviews</span>
      </div>
      <p class="modal-desc">${p.desc}</p>
      <div class="modal-price-row">
        <span class="modal-price">₹${p.price.toLocaleString()}</span>
        ${p.oldPrice ? `<span class="modal-price-old">₹${p.oldPrice.toLocaleString()}</span>` : ''}
        ${discount ? `<span class="product-badge badge-sale" style="position:static">${discount}% off</span>` : ''}
      </div>
      <div class="modal-actions">
        <button class="btn-primary" onclick="addToCartModal(${p.id})">Add to Cart</button>
        <button class="btn-ghost" onclick="wishlist(event,${p.id})">♡ Wishlist</button>
      </div>
    </div>
  `;
  document.getElementById('productModal').classList.add('open');
  document.getElementById('modalOverlay').classList.add('open');
}
function closeModal() {
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
}
function addToCartModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...p, qty: 1 });
  saveCart();
  updateCartUI();
  closeModal();
  showToast(`${p.emoji} Added to cart!`);
  setTimeout(openCart, 400);
}

// ===== WISHLIST =====
function wishlist(e, id) {
  e.stopPropagation();
  const p = PRODUCTS.find(x => x.id === id);
  showToast(`${p.emoji} Saved to wishlist!`);
}

// ===== AUTH =====
function openLogin() {
  document.getElementById('loginModal').classList.add('open');
  document.getElementById('loginOverlay').classList.add('open');
  document.getElementById('registerModal').style.display = 'none';
}
function closeLogin() {
  document.getElementById('loginModal').classList.remove('open');
  document.getElementById('loginOverlay').classList.remove('open');
  document.getElementById('registerModal').style.display = 'none';
  document.getElementById('registerModal').classList.remove('open');
}
function showRegister() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('registerModal').style.display = 'block';
  setTimeout(() => document.getElementById('registerModal').classList.add('open'), 10);
}
function showLogin() {
  document.getElementById('registerModal').classList.remove('open');
  document.getElementById('registerModal').style.display = 'none';
  document.getElementById('loginModal').style.display = 'block';
  document.getElementById('loginModal').classList.add('open');
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  if (!email || !pass) { showToast('Please fill all fields ⚠️'); return; }
  const user = users.find(u => u.email === email && u.password === pass);
  if (!user) { showToast('Invalid credentials ❌'); return; }
  currentUser = user;
  localStorage.setItem('luxe_user', JSON.stringify(user));
  closeLogin();
  updateUserBtn();
  showToast(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
}

function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;
  if (!name || !email || !pass) { showToast('Please fill all fields ⚠️'); return; }
  if (users.find(u => u.email === email)) { showToast('Email already registered ❌'); return; }
  const user = { name, email, password: pass };
  users.push(user);
  localStorage.setItem('luxe_users', JSON.stringify(users));
  currentUser = user;
  localStorage.setItem('luxe_user', JSON.stringify(user));
  closeLogin();
  updateUserBtn();
  showToast(`Welcome to LUXE, ${name.split(' ')[0]}! 🎉`);
}

function updateUserBtn() {
  const btn = document.getElementById('userBtn');
  if (currentUser) {
    btn.title = `Logged in as ${currentUser.name}`;
    btn.style.color = 'var(--brown)';
  } else {
    btn.title = 'Login / Register';
    btn.style.color = '';
  }
}

document.getElementById('userBtn').addEventListener('click', () => {
  if (currentUser) {
    if (confirm(`Logged in as ${currentUser.name}\n\nClick OK to logout.`)) {
      currentUser = null;
      localStorage.removeItem('luxe_user');
      updateUserBtn();
      showToast('Logged out successfully');
    }
  } else {
    openLogin();
  }
});
document.getElementById('loginOverlay').addEventListener('click', closeLogin);

// ===== SEARCH =====
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = prompt('Search products:');
  if (!q) return;
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  );
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    renderProducts(results);
    if (!results.length) showToast(`No results for "${q}" 🔍`);
    else showToast(`Found ${results.length} result${results.length > 1 ? 's' : ''} for "${q}" 🔍`);
  }, 400);
});

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}