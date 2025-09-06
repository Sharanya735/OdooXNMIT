// src/services/purchaseService.js
import axios from "axios";
import authService from "./authService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function getPurchases() {
  const res = await axios.get(`${API_BASE}/purchases`, {
    headers: authService.authHeaders(),
  });
  return res.data;
}

export default { getPurchases };
