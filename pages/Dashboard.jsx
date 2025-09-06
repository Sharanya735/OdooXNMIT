// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Stack,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Link, useNavigate } from "react-router-dom";
import productService from "../services/productService";
import purchaseService from "../services/purchaseService";
import cartService from "../services/cartService";
import authService from "../services/authService";
import "@fontsource/poppins";

/**
 * Dashboard.jsx (updated)
 * - Poppins font retained
 * - Removed "Messages" stat card
 * - Right column: Recent purchases and Quick links are side-by-side on larger screens,
 *   and stack on small screens (responsive).
 * - Stats cards: 5 cards (quickAdd retained), laid out with consistent minHeight for alignment
 */

const STAT_CARDS = [
  { id: "myListings", title: "My listings", subtitle: "Manage your active listings", icon: <Inventory2Icon />, bg: "#1976D2" },
  { id: "purchases", title: "Purchases", subtitle: "Items you bought", icon: <ShoppingCartIcon />, bg: "#0F172A" },
  { id: "available", title: "Available", subtitle: "Listings shown", icon: <ReceiptLongIcon />, bg: "#22C55E" },
  { id: "saved", title: "Saved items", subtitle: "Saved by you", icon: <LocalOfferIcon />, bg: "#F59E0B" },
  { id: "quickAdd", title: "Quick add", subtitle: "Create new listing", icon: <AddIcon />, bg: "#EF4444" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalProducts: 0,
    myListings: 0,
    purchases: 0,
    saved: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        // defensive requests with fallbacks
        let productsRes = [];
        try {
          productsRes = await productService.listProducts({ limit: 8 });
          productsRes = Array.isArray(productsRes) ? productsRes : productsRes?.items || [];
        } catch (err) {
          console.warn("productService.listProducts failed", err);
          productsRes = [];
        }

        let myListings = [];
        try {
          myListings = await productService.myProducts();
          myListings = Array.isArray(myListings) ? myListings : myListings?.items || [];
        } catch (err) {
          console.warn("productService.myProducts failed", err);
          myListings = [];
        }

        let purchasesRes = [];
        try {
          purchasesRes = await purchaseService.getPurchases();
          purchasesRes = Array.isArray(purchasesRes) ? purchasesRes : purchasesRes?.items || [];
        } catch (err) {
          console.warn("purchaseService.getPurchases failed", err);
          purchasesRes = [];
        }

        if (!mounted) return;

        setRecentProducts(productsRes.slice(0, 8));
        setRecentPurchases(purchasesRes.slice(0, 6));
        setCounts({
          totalProducts: (productsRes && productsRes.length) || 0,
          myListings: (myListings && myListings.length) || 0,
          purchases: (purchasesRes && purchasesRes.length) || 0,
          saved: 0,
        });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  function StatCard({ keyId, title, subtitle, icon, bg }) {
    const value =
      keyId === "myListings"
        ? counts.myListings
        : keyId === "purchases"
        ? counts.purchases
        : keyId === "available"
        ? counts.totalProducts
        : keyId === "saved"
        ? counts.saved
        : "";

    return (
      <Paper
        elevation={1}
        sx={{
          p: 2,
          minHeight: 120,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Avatar sx={{ bgcolor: bg, width: 48, height: 48 }}>{icon}</Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        </Box>

        {keyId === "quickAdd" ? (
          <Button variant="contained" onClick={() => navigate("/add-product")}>
            Add
          </Button>
        ) : null}
      </Paper>
    );
  }

  return (
    <Box sx={{ pt: 2, pb: 6, fontFamily: "Poppins, Inter, sans-serif" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Welcome{user?.username ? `, ${user.username}` : ""}. Quick overview of your account and recent activity.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<AddIcon />} component={Link} to="/add-product">
              Add product
            </Button>
            <Button variant="contained" startIcon={<Inventory2Icon />} component={Link} to="/my-listings">
              My listings
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Paper>
        ) : (
          <>
            {/* Stat cards: 5 cards (arranged 3 per row on desktop => 2 rows) */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {STAT_CARDS.map((c) => (
                <Grid item key={c.id} xs={12} sm={6} md={4}>
                  <StatCard keyId={c.id} title={c.title} subtitle={c.subtitle} icon={c.icon} bg={c.bg} />
                </Grid>
              ))}
            </Grid>

            {/* Main content: left = recent products, right = recent purchases + quick links side-by-side on wide screens */}
            <Grid container spacing={2}>
              {/* Left: Recent products */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Recent products
                    </Typography>
                    <Chip label={`${recentProducts.length} shown`} size="small" />
                  </Box>

                  {recentProducts.length === 0 ? (
                    <Box sx={{ py: 6, textAlign: "center" }}>
                      <Typography color="text.secondary">No recent products to show.</Typography>
                      <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate("/feed")}>
                        Browse products
                      </Button>
                    </Box>
                  ) : (
                    <Grid container spacing={2}>
                      {recentProducts.map((p) => (
                        <Grid item key={p.id} xs={12} sm={6}>
                          <Paper sx={{ display: "flex", gap: 2, p: 1.25, alignItems: "center" }}>
                            <Box
                              component={Link}
                              to={`/product/${p.id}`}
                              sx={{
                                width: 88,
                                aspectRatio: "1 / 1",
                                display: "block",
                                overflow: "hidden",
                                borderRadius: 1,
                                bgcolor: "#f1f5f9",
                                textDecoration: "none",
                              }}
                            >
                              {p.image || p.imageUrl ? (
                                <img src={p.image || p.imageUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", px: 1 }}>
                                    No image
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography noWrap sx={{ fontWeight: 700 }}>
                                {p.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {p.category} • ₹{p.price}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Button size="small" component={Link} to={`/product/${p.id}`} variant="outlined">
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={async () => {
                                    try {
                                      await cartService.addItem({ id: p.id, title: p.title, category: p.category, price: p.price, qty: 1 });
                                      setSnack({ open: true, message: "Added to cart", severity: "success" });
                                    } catch (err) {
                                      console.error(err);
                                      setSnack({ open: true, message: "Failed to add to cart", severity: "error" });
                                    }
                                  }}
                                >
                                  Add
                                </Button>
                              </Stack>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>

              {/* Right: split into two columns on md+ so purchases and quick links sit side-by-side */}
              <Grid item xs={12} md={5}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: "100%" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          Recent purchases
                        </Typography>
                        <Chip label={`${recentPurchases.length} shown`} size="small" />
                      </Box>

                      {recentPurchases.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: "center" }}>
                          <Typography color="text.secondary">No purchases yet.</Typography>
                          <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate("/feed")}>
                            Browse products
                          </Button>
                        </Box>
                      ) : (
                        <List>
                          {recentPurchases.map((o) => (
                            <React.Fragment key={o.id}>
                              <ListItem alignItems="flex-start" sx={{ gap: 2 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: "#1976D2" }}>
                                    <PersonIcon />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
                                      <Typography sx={{ fontWeight: 700 }}>Order #{o.id}</Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {new Date(o.date).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                  }
                                  secondary={
                                    <Box sx={{ mt: 0.5 }}>
                                      <Typography variant="body2" color="text.secondary" noWrap>
                                        {o.items?.slice(0, 2).map((it) => it.title).join(", ")}
                                        {o.items && o.items.length > 2 ? ` +${o.items.length - 2} more` : ""}
                                      </Typography>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 0.5 }}>
                                        ₹{o.total}
                                      </Typography>
                                    </Box>
                                  }
                                />
                              </ListItem>
                              <Divider component="li" />
                            </React.Fragment>
                          ))}
                        </List>
                      )}
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: "100%" }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Quick links
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Button component={Link} to="/my-listings" variant="outlined" startIcon={<Inventory2Icon />}>
                          Manage listings
                        </Button>
                        <Button component={Link} to="/purchases" variant="outlined" startIcon={<ReceiptLongIcon />}>
                          View all purchases
                        </Button>
                        <Button component={Link} to="/add-product" variant="text" startIcon={<AddIcon />}>
                          Create new listing
                        </Button>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Container>

      <Snackbar open={snack.open} autoHideDuration={2200} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnack} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
