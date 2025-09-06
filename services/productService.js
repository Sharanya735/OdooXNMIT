// src/services/productService.js
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function listProducts(params = {}) {
  // params optional: { search, category, page, limit }
  const res = await axios.get(`${API_BASE}/products`, { params });
  return res.data;
}

async function getProduct(id) {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
}

async function createProduct(formData) {
  const res = await axios.post(`${API_BASE}/products`, formData, { headers: { "Content-Type": "multipart/form-data" }});
  return res.data;
}

async function myProducts() {
  const res = await axios.get(`${API_BASE}/my-products`);
  return res.data;
}

async function updateProduct(id, payload) {
  // payload may be FormData or JSON
  const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
  const res = await axios.patch(`${API_BASE}/products/${id}`, payload, { headers });
  return res.data;
}

async function deleteProduct(id) {
  const res = await axios.delete(`${API_BASE}/products/${id}`);
  return res.data;
}

export default { listProducts, getProduct, createProduct, myProducts, updateProduct, deleteProduct };
