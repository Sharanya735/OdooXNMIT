// src/services/authService.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "token";
const USER_KEY = "user";

function setToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
}
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
function clearAuth() {
  try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); } catch {}
}
function setUser(user) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user || {})); } catch {}
}
function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || "{}"); } catch { return {}; }
}

async function login({ email, password }) {
  const res = await axios.post(`${API_BASE}/login`, { email, password });
  // expected: { token, user } or { token }
  if (res?.data?.token) {
    setToken(res.data.token);
    if (res.data.user) setUser(res.data.user);
    return { token: res.data.token, user: res.data.user };
  }
  throw new Error(res?.data?.message || "Login failed");
}

async function register({ username, email, password }) {
  const res = await axios.post(`${API_BASE}/register`, { username, email, password });
  // prefer returning token, but accept success redirect
  if (res?.data?.token) {
    setToken(res.data.token);
    if (res.data.user) setUser(res.data.user);
    return { token: res.data.token, user: res.data.user };
  }
  return res.data;
}

function logout() {
  clearAuth();
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default {
  login,
  register,
  logout,
  getToken,
  setToken,
  getUser,
  setUser,
  authHeaders,
};
