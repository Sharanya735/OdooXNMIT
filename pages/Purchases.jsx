// src/pages/Purchases.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Stack,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import purchaseService from "../services/purchaseService";
import "@fontsource/poppins";

/**
 * Purchases.jsx
 * - Lists previous purchases grouped by order
 * - Calls purchaseService.getPurchases() (backend: GET /purchases)
 * - Responsive layout, consistent square product images
 */

export default function Purchases() {
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await purchaseService.getPurchases();
        if (!mounted) return;
        // assume backend returns array of { id, date, items: [ {id, title, category, price, qty, image} ], total }
        setPurchases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load purchases", err);
        if (mounted) {
          setPurchases([]);
          setSnack({ open: true, message: "Could not load purchases", severity: "error" });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  function closeSnack() {
    setSnack((s) => ({ ...s, open: false }));
  }

  return (
    <Box sx={{ pt: 2, pb: 6, fontFamily: "Poppins, Inter, sans-serif" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            My Purchases
          </Typography>
        </Box>

        {loading ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Paper>
        ) : purchases.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6">No purchases yet</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Your completed purchases will appear here.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {purchases.map((order) => (
              <Paper key={order.id} sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Order #{order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {order.items.map((it) => (
                    <Grid item xs={12} sm={6} md={4} key={it.id}>
                      <Paper sx={{ p: 1.5, display: "flex", flexDirection: "row", gap: 2 }}>
                        <Box
                          sx={{
                            width: 88,
                            aspectRatio: "1 / 1",
                            background: "#f1f5f9",
                            borderRadius: 1,
                            overflow: "hidden",
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {it.image ? (
                            <img
                              src={it.image}
                              alt={it.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                              No image
                            </Typography>
                          )}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                            {it.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {it.category}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                            ₹{it.price} × {it.qty}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ mt: 2, mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, textAlign: "right" }}>
                  Total: ₹{order.total}
                </Typography>
              </Paper>
            ))}
          </Stack>
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
