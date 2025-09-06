// src/pages/AddProduct.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Container,
  Stack,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import productService from "../services/productService";
import "@fontsource/poppins";

/**
 * AddProduct.jsx
 * - Long-form responsive UI consistent with other pages
 * - Uses productService.createProduct(formData) (multipart/form-data)
 * - Shows image preview; preview area is square for consistency with ProductCard
 * - Snackbar feedback for success/error
 */

const CATEGORIES = ["Clothing", "Furniture", "Electronics", "Home", "Accessories", "Sports", "Other"];

export default function AddProduct() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  function handleImageChange(e) {
    const f = e.target.files?.[0];
    if (!f) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }
    // simple client-side validation
    if (!f.type.startsWith("image/")) {
      setSnack({ open: true, message: "Please upload a valid image file", severity: "error" });
      return;
    }
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(f);
  }

  function validate() {
    if (!title.trim()) { setError("Title is required"); return false; }
    if (!category) { setError("Select a category"); return false; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { setError("Enter a valid price"); return false; }
    setError(""); return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("category", category);
      formData.append("price", Number(price));
      formData.append("description", description.trim());
      if (imageFile) formData.append("image", imageFile);

      await productService.createProduct(formData);
      setSnack({ open: true, message: "Product created successfully", severity: "success" });
      // short delay so user sees snackbar, then navigate
      setTimeout(() => navigate("/my-listings"), 900);
    } catch (err) {
      console.error("Create product failed", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to create product";
      setError(msg);
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  return (
    <Box sx={{ minHeight: "100vh", pb: 8, fontFamily: "Poppins, Inter, sans-serif" }}>
      <Box sx={{ height: 56 }} />

      <Container maxWidth="md" sx={{ pt: { xs: 2, md: 4 } }}>
        <Paper
          elevation={isMdUp ? 4 : 0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            overflow: "hidden",
            borderRadius: 2,
            p: { xs: 2, md: 0 },
          }}
        >
          {/* Hero panel on desktop */}
          {isMdUp && (
            <Box sx={{ width: "38%", background: "linear-gradient(180deg,#1976D2,#1565C0)", color: "#fff", p: 4, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Create a listing</Typography>
              <Typography sx={{ opacity: 0.95 }}>List your item with photos, description & price. Help it find a new home.</Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={() => navigate("/my-listings")}>My listings</Button>
              </Box>
            </Box>
          )}

          {/* Form panel */}
          <Box sx={{ flex: 1, p: { xs: 2.5, md: 4 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Add New Product</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Fill out the details below to create your listing.</Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ maxLength: 120 }}
              />

              <TextField
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
                required
                margin="normal"
              >
                <MenuItem value="">-- select category --</MenuItem>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>

              <TextField
                label="Price (INR)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                required
                margin="normal"
                type="number"
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />

              {/* Image upload + preview */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 2, alignItems: "start" }}>
                <Button variant="outlined" component="label">
                  {imageFile ? "Change Image" : "Upload Image (optional)"}
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                </Button>

                <Box sx={{ width: 130, aspectRatio: "1 / 1", borderRadius: 1, overflow: "hidden", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", px: 1 }}>Square preview</Typography>
                  )}
                </Box>
              </Stack>

              {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? "Creating..." : "Create listing"}
                </Button>
                <Button variant="outlined" onClick={() => navigate("/feed")} disabled={loading}>Cancel</Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={2600} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnack} severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
