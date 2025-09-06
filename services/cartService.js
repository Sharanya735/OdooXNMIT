// src/services/cartService.js
// Abstraction over cart storage:
// - Tries backend API (axios) first
// - If API fails/unavailable, falls back to localStorage
// - Designed so backend devs can implement matching endpoints:
//   GET  /cart
//   POST /cart/:productId  (or POST /cart with body { productId, qty })
//   PATCH /cart/:productId  (body { qty })
//   DELETE /cart/:productId
//   POST /checkout

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TIMEOUT_MS = 3000; // short timeout so UI falls back quickly
const LS_KEY = "cart";
const PURCHASES_KEY = "purchases";

function safeJsonParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const ls = {
  get: (key, fallback = []) => safeJsonParse(localStorage.getItem(key), fallback),
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

/* ---------- Helpers ---------- */

function buildAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function tryApi(fn) {
  try {
    const res = await fn();
    return { ok: true, data: res.data, res };
  } catch (err) {
    // treat network / server errors as fallback signal
    return { ok: false, error: err };
  }
}

/* ---------- Local Storage fallback implementations ---------- */

function lsGetCart() {
  return ls.get(LS_KEY, []);
}

function lsWriteCart(cart) {
  ls.set(LS_KEY, cart);
  return cart;
}

function lsAddItem(product) {
  const cart = lsGetCart();
  const idx = cart.findIndex((c) => c.id === product.id);
  if (idx >= 0) {
    cart[idx].qty = (Number(cart[idx].qty) || 1) + (Number(product.qty) || 1);
  } else {
    cart.push({ ...product, qty: Number(product.qty) || 1 });
  }
  lsWriteCart(cart);
  return cart;
}

function lsUpdateQty(productId, qty) {
  const cart = lsGetCart().map((it) => (it.id === productId ? { ...it, qty: Math.max(1, Number(qty) || 1) } : it));
  lsWriteCart(cart);
  return cart;
}

function lsRemoveItem(productId) {
  const cart = lsGetCart().filter((it) => it.id !== productId);
  lsWriteCart(cart);
  return cart;
}

function lsClearCart() {
  lsWriteCart([]);
  return [];
}

function lsCheckout() {
  const cart = lsGetCart();
  if (!cart || cart.length === 0) return { success: false, message: "Cart empty" };
  const purchases = ls.get(PURCHASES_KEY, []);
  const subtotal = cart.reduce((s, it) => s + Number(it.price || 0) * (Number(it.qty) || 1), 0);
  const shipping = subtotal > 0 ? Math.min(100, Math.round(subtotal * 0.05)) : 0;
  const total = subtotal + shipping;
  const purchase = { id: Date.now(), items: cart, date: new Date().toISOString(), subtotal, shipping, total };
  purchases.unshift(purchase);
  ls.set(PURCHASES_KEY, purchases);
  lsClearCart();
  return { success: true, purchase };
}

/* ---------- Service API ---------- */

const cartService = {
  // Get current cart (tries backend GET /cart)
  async getCart() {
    const apiCall = () => axios.get(`${API_BASE}/cart`, { headers: buildAuthHeaders(), timeout: TIMEOUT_MS });
    const attempt = await tryApi(apiCall);
    if (attempt.ok) return attempt.data;
    // fallback
    return lsGetCart();
  },

  // Add item: product minimal shape: { id, title, category, price, qty }
  async addItem(product) {
    // try API: POST /cart or POST /cart/:productId
    const apiCall = () =>
      axios.post(
        `${API_BASE}/cart`,
        { productId: product.id, qty: product.qty || 1 },
        { headers: buildAuthHeaders(), timeout: TIMEOUT_MS }
      );
    const attempt = await tryApi(apiCall);
    if (attempt.ok) {
      // assume backend returns updated cart
      return attempt.data;
    }
    // fallback to localStorage
    return lsAddItem(product);
  },

  // Update quantity
  async updateQty(productId, qty) {
    const apiCall = () =>
      axios.patch(`${API_BASE}/cart/${productId}`, { qty }, { headers: buildAuthHeaders(), timeout: TIMEOUT_MS });
    const attempt = await tryApi(apiCall);
    if (attempt.ok) return attempt.data;
    return lsUpdateQty(productId, qty);
  },

  // Remove an item
  async removeItem(productId) {
    const apiCall = () =>
      axios.delete(`${API_BASE}/cart/${productId}`, { headers: buildAuthHeaders(), timeout: TIMEOUT_MS });
    const attempt = await tryApi(apiCall);
    if (attempt.ok) return attempt.data;
    return lsRemoveItem(productId);
  },

  // Clear cart
  async clearCart() {
    const apiCall = () => axios.delete(`${API_BASE}/cart`, { headers: buildAuthHeaders(), timeout: TIMEOUT_MS });
    const attempt = await tryApi(apiCall);
    if (attempt.ok) return attempt.data;
    return lsClearCart();
  },

  // Checkout: try backend POST /checkout or POST /purchases, else local fallback
  async checkout() {
    const apiCall = () =>
      axios.post(`${API_BASE}/checkout`, {}, { headers: buildAuthHeaders(), timeout: TIMEOUT_MS });
    const attempt = await tryApi(apiCall);
    if (attempt.ok) return attempt.data;
    // fallback local
    return lsCheckout();
  },
};

export default cartService;
