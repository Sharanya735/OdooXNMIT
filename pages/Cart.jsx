// src/pages/Cart.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Grid,
  Divider,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Link, useNavigate } from "react-router-dom";
import cartService from "../services/cartService";
import "@fontsource/poppins";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await cartService.getCart();
        if (!mounted) return;
        setCart(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load cart failed", err);
        if (mounted) setCart([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((s, it) => s + Number(it.price || 0) * (Number(it.qty) || 1), 0),
    [cart]
  );
  const shipping = useMemo(() => (subtotal > 0 ? Math.min(100, Math.round(subtotal * 0.05)) : 0), [subtotal]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  const showSnack = (message, severity = "success") => setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  async function handleChangeQty(id, nextQtyRaw) {
    const nextQty = Math.max(1, Number(nextQtyRaw) || 1);
    setCart((c) => c.map((it) => (it.id === id ? { ...it, qty: nextQty } : it)));
    setActionLoading(true);
    try {
      const updated = await cartService.updateQty(id, nextQty);
      if (Array.isArray(updated)) setCart(updated);
      showSnack("Quantity updated", "success");
    } catch (err) {
      console.error("Update qty failed", err);
      setError("Could not update quantity.");
      showSnack("Failed to update quantity", "error");
      try {
        const fresh = await cartService.getCart();
        setCart(Array.isArray(fresh) ? fresh : []);
      } catch {}
    } finally {
      setActionLoading(false);
    }
  }

  const handleIncrement = (id) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    handleChangeQty(id, (Number(item.qty) || 1) + 1);
  };

  const handleDecrement = (id) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    const next = Math.max(1, (Number(item.qty) || 1) - 1);
    handleChangeQty(id, next);
  };

  async function handleRemove(id) {
    if (!confirm("Remove this item from cart?")) return;
    setActionLoading(true);
    try {
      const updated = await cartService.removeItem(id);
      if (Array.isArray(updated)) setCart(updated);
      else setCart((c) => c.filter((it) => it.id !== id));
      showSnack("Item removed", "info");
    } catch (err) {
      console.error("Remove failed", err);
      setError("Could not remove item.");
      showSnack("Failed to remove item", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleClear() {
    if (!confirm("Clear cart?")) return;
    setActionLoading(true);
    try {
      const updated = await cartService.clearCart();
      if (Array.isArray(updated)) setCart(updated);
      else setCart([]);
      showSnack("Cart cleared", "info");
    } catch (err) {
      console.error("Clear cart failed", err);
      setError("Could not clear cart.");
      showSnack("Failed to clear cart", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckout() {
    if (cart.length === 0) {
      showSnack("Cart is empty", "warning");
      return;
    }
    setActionLoading(true);
    try {
      const res = await cartService.checkout();
      const ok =
        (res && (res.success || res.purchase || res.id || (Array.isArray(res) && res.length === 0))) ||
        res === undefined;
      if (ok) {
        showSnack("Purchase successful!", "success");
        try {
          const fresh = await cartService.getCart();
          setCart(Array.isArray(fresh) ? fresh : []);
        } catch {
          setCart([]);
        }
        setTimeout(() => navigate("/purchases"), 600);
      } else {
        throw new Error("Checkout failure");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      setError("Checkout failed. Try again.");
      showSnack("Checkout failed", "error");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <Box sx={{ pt: 2, pb: 6, fontFamily: "Poppins, Inter, sans-serif" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <IconButton component={Link} to="/feed" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Your Cart
          </Typography>
        </Box>

        {loading ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Paper>
        ) : cart.length === 0 ? (
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6">Your cart is empty</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Add items from the feed to see them here.
            </Typography>
            <Button component={Link} to="/feed" variant="contained" sx={{ mt: 3 }}>
              Browse products
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={1}>
            <Grid item xs={12} md={8}>
              <Stack spacing={1}>
                {cart.map((it) => (
                  <Paper
                    key={it.id}
                    sx={{
                      p: 2,
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", sm: 120 },
                        aspectRatio: { xs: "5 / 2", sm: "1 / 1" },
                        background: "#f1f5f9",
                        borderRadius: 1,
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {it.image || it.imageUrl ? (
                        <img
                          src={it.image || it.imageUrl}
                          alt={it.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Typography color="text.secondary" sx={{ p: 1, textAlign: "center" }}>
                          {it.title}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }}>{it.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {it.category}
                      </Typography>
                      <Typography sx={{ mt: 1, fontWeight: 700 }}>₹{it.price}</Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <IconButton size="small" onClick={() => handleDecrement(it.id)} aria-label="decrement">
                          <RemoveIcon />
                        </IconButton>
                        <TextField
                          size="small"
                          value={it.qty || 1}
                          onChange={(e) => handleChangeQty(it.id, e.target.value)}
                          inputProps={{ style: { textAlign: "center" }, min: 1 }}
                          sx={{ width: 88 }}
                          type="number"
                        />
                        <IconButton size="small" onClick={() => handleIncrement(it.id)} aria-label="increment">
                          <AddIcon />
                        </IconButton>
                        <Button
                          variant="text"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleRemove(it.id)}
                          sx={{ ml: 2 }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, position: { md: "sticky" }, top: { md: 96 } }}>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Order summary</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>₹{subtotal}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography>₹{shipping}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 700 }}>₹{total}</Typography>
                </Box>

                <Button variant="contained" fullWidth onClick={handleCheckout} disabled={actionLoading}>
                  {actionLoading ? "Processing..." : "Checkout"}
                </Button>

                <Button variant="text" fullWidth onClick={handleClear} sx={{ mt: 1 }}>
                  Clear cart
                </Button>

                {error && (
                  <Typography color="error" sx={{ mt: 2, fontSize: 13 }}>
                    {error}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      <Snackbar
        open={snack.open}
        autoHideDuration={2600}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnack} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
