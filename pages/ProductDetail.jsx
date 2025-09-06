// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import productService from "../services/productService";
import cartService from "../services/cartService";
import { useParams, useNavigate } from "react-router-dom";
import "@fontsource/poppins";

/**
 * ProductDetail.jsx
 * - Backend-ready: calls productService.getProduct(id)
 * - Add-to-cart via cartService.addItem(...)
 * - Responsive layout: image left / details right on desktop; stacked on mobile
 * - Shows loading / not-found / error states
 * - Uses snackbar for feedback
 */

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const data = await productService.getProduct(id);
        if (!mounted) return;
        // backend might return null/404 handling; treat falsy as not found
        if (!data) {
          setProduct(null);
          setErrMsg("Product not found.");
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to load product", err);
        // do not expose raw error; show friendly message
        setErrMsg("Unable to load product details right now.");
        setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  async function handleAddToCart() {
    if (!product) return;
    setActionLoading(true);
    try {
      await cartService.addItem({ id: product.id, title: product.title, category: product.category, price: product.price, qty: 1 });
      setSnack({ open: true, message: "Added to cart", severity: "success" });
      // Optionally navigate to cart after a short delay:
      // setTimeout(() => navigate("/cart"), 700);
    } catch (err) {
      console.error("Add to cart failed", err);
      setSnack({ open: true, message: "Failed to add to cart", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  }

  function handleBuyNow() {
    // simple buy flow: add to cart then go to checkout/cart
    handleAddToCart();
    setTimeout(() => navigate("/cart"), 650);
  }

  function closeSnack() {
    setSnack((s) => ({ ...s, open: false }));
  }

  if (loading) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ pt: 2, pb: 6 }}>
        <Container maxWidth="md">
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6">Product not found</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {errMsg || "This product may have been removed."}
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
              <Button variant="contained" onClick={() => navigate("/feed")}>Back to feed</Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2, pb: 8, fontFamily: "Poppins, Inter, sans-serif" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {product.title}
          </Typography>
        </Box>

        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={3}>
            {/* Image column */}
            <Grid item xs={12} md={5}>
              <Box sx={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 2, overflow: "hidden", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {product.image || product.imageUrl ? (
                  <img src={product.image || product.imageUrl} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <Typography color="text.secondary" sx={{ textAlign: "center", px: 2 }}>
                    No image available
                  </Typography>
                )}
              </Box>

              {/* small info row below image */}
              <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary">Category: {product.category || "Other"}</Typography>
                <IconButton aria-label="favorite"><FavoriteBorderIcon /></IconButton>
              </Stack>
            </Grid>

            {/* Details column */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A" }}>{product.title}</Typography>

                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1976D2", mt: 1 }}>₹{product.price}</Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {product.description || "No description provided."}
                </Typography>

                {/* seller / meta info if present */}
                <Box sx={{ mt: 2 }}>
                  {product.sellerName && <Typography variant="body2">Seller: <strong>{product.sellerName}</strong></Typography>}
                  {product.location && <Typography variant="body2" color="text.secondary">Location: {product.location}</Typography>}
                  {product.condition && <Typography variant="body2" color="text.secondary">Condition: {product.condition}</Typography>}
                </Box>

                {/* action buttons */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                  <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={handleAddToCart} disabled={actionLoading}>
                    {actionLoading ? "Adding..." : "Add to cart"}
                  </Button>
                  <Button variant="outlined" onClick={handleBuyNow} disabled={actionLoading}>Buy now</Button>
                  <Button variant="text" onClick={() => navigate(`/seller/${product.sellerId || ""}`)} disabled={!product.sellerId}>
                    View seller
                  </Button>
                </Stack>

                {/* small helpful text */}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  Payments and checkout simulated in demo mode. Real payment flow will be handled by the backend.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={2400} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnack} severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}

