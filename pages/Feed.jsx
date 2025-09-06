// src/pages/Feed.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  TextField,
  Chip,
  Typography,
  Stack,
  Paper,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "../components/ProductCard";
import productService from "../services/productService";
import cartService from "../services/cartService";
import { useNavigate } from "react-router-dom";
import "@fontsource/poppins";

/**
 * Feed.jsx - Original-style UI (hero + content) with mock data fallback.
 * Backend-ready: tries productService.listProducts(), falls back to MOCK.
 */

/* --- Mock demo products (12 items) --- */
const MOCK = [
  { id: 101, title: "Denim Jacket", category: "Clothing", price: 899, description: "Lightly used, size M." },
  { id: 102, title: "Wooden Coffee Table", category: "Furniture", price: 2499, description: "Solid teak, good condition." },
  { id: 103, title: "Mountain Bike", category: "Sports", price: 5499, description: "Well maintained, 21-speed." },
  { id: 104, title: "Ceramic Vase", category: "Home", price: 399, description: "Handmade, minor chip." },
  { id: 105, title: "Laptop Bag", category: "Accessories", price: 599, description: "Waterproof, fits 15-inch." },
  { id: 106, title: "Bluetooth Speaker", category: "Electronics", price: 1299, description: "Portable, 10hrs battery." },
  { id: 107, title: "Formal Shoes", category: "Clothing", price: 799, description: "Genuine leather, size 9." },
  { id: 108, title: "Standing Lamp", category: "Home", price: 699, description: "Warm light, wood base." },
  { id: 109, title: "Yoga Mat", category: "Sports", price: 299, description: "Non-slip, 6mm thick." },
  { id: 110, title: "Wireless Mouse", category: "Electronics", price: 399, description: "Ergonomic, USB receiver." },
  { id: 111, title: "Cookware Set", category: "Home", price: 2199, description: "5-piece, non-stick." },
  { id: 112, title: "Backpack", category: "Accessories", price: 749, description: "Multiple pockets, durable." },
];

const CATEGORIES = ["All", "Clothing", "Furniture", "Sports", "Home", "Accessories", "Electronics"];

export default function Feed() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Snackbar
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        // Attempt to fetch from backend
        const data = await productService.listProducts();
        const items = Array.isArray(data) ? data : data?.items || [];
        if (!mounted) return;
        // if backend returns nothing, fallback to MOCK
        setProducts(items.length ? items : MOCK);
      } catch (err) {
        // fallback to demo products
        console.warn("productService.listProducts() failed — falling back to MOCK", err);
        if (!mounted) return;
        setErrMsg("Showing demo products (no backend).");
        setProducts(MOCK);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  // client-side filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" || (p.category || "Other") === activeCategory;
      const matchesQuery = !q || (p.title || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, query, activeCategory]);
  <Grid container spacing={2}>
  {filtered.map((p) => (
    <Grid item key={p.id} xs={12} sm={12} md={4}>
      <ProductCard product={p} onAddToCart={handleAddToCart} onView={handleView} />
    </Grid>
  ))}
</Grid>

  // actions
  async function handleAddToCart(product) {
    try {
      await cartService.addItem({ id: product.id, title: product.title, category: product.category, price: product.price, qty: 1 });
      setSnack({ open: true, message: `${product.title} added to cart`, severity: "success" });
    } catch (err) {
      console.error("Add to cart failed", err);
      setSnack({ open: true, message: `Failed to add ${product.title}`, severity: "error" });
    }
  }

  function handleView(product) {
    navigate(`/product/${product.id}`);
  }

  function closeSnack() {
    setSnack((s) => ({ ...s, open: false }));
  }

  return (
    <Box sx={{ pb: 8, fontFamily: "Poppins, Inter, sans-serif" }}>
      <Box sx={{ height: 56 }} />

      <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 } }}>
        <Paper elevation={3} sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          {/* Left hero (desktop) */}
          <Box sx={{ display: { xs: "none", md: "block" }, width: "35%", background: "linear-gradient(180deg,#1976D2,#1565C0)", color: "#fff", p: 4, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Explore EcoFinds
            </Typography>
            <Typography sx={{ opacity: 0.95, mb: 2 }}>
              Browse sustainable, pre-loved items from your community. Add items to cart and checkout securely.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/add-product")}>Sell an item</Button>
          </Box>

          {/* Right content */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, gap: 2, flexWrap: "wrap" }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Explore</Typography>

              <TextField
                size="small"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 220, maxWidth: 420 }}
              />
            </Box>

            <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: "auto", pb: 1 }}>
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} clickable color={c === activeCategory ? "primary" : "default"} onClick={() => setActiveCategory(c)} sx={{ flex: "0 0 auto" }} />
              ))}
            </Stack>

            {loading ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {errMsg && (
                  <Box sx={{ mb: 2 }}>
                    <Typography color="text.secondary">{errMsg}</Typography>
                  </Box>
                )}

                <Grid container spacing={2}>
                  {filtered.length === 0 ? (
                    <Grid item xs={12}>
                      <Box sx={{ py: 6, textAlign: "center" }}>
                        <Typography variant="h6">No products found</Typography>
                        <Typography variant="body2" className="text-muted">Try a different search or category</Typography>
                      </Box>
                    </Grid>
                  ) : (
                    filtered.map((p) => (
                      <Grid item key={p.id} xs={12} sm={6} md={4}>
                        <ProductCard product={p} onAddToCart={handleAddToCart} onView={handleView} />
                      </Grid>
                    ))
                  )}
                </Grid>
              </>
            )}
          </Box>
        </Paper>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={2200} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnack} severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
