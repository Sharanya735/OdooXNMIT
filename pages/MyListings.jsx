// src/pages/MyListings.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import productService from "../services/productService";
import "@fontsource/poppins";
import { useNavigate } from "react-router-dom";

/**
 * MyListings.jsx
 * - Backend-ready: uses productService.myProducts(), updateProduct(), deleteProduct()
 * - Responsive: mobile = 1 column, tablet/desktop = 2-3 columns
 * - Edit & Delete dialogs, image preview, snackbars
 * - If backend fails, shows friendly "No listings available" empty state instead of an error message.
 */

const CATEGORIES = ["Clothing", "Furniture", "Electronics", "Home", "Accessories", "Sports", "Other"];

export default function MyListings() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  // edit dialog state
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  // delete dialog state
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchMyListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMyListings() {
    setLoading(true);
    try {
      const data = await productService.myProducts();
      const items = Array.isArray(data) ? data : data?.items || [];
      // If backend returns items use them; otherwise show empty list
      setProducts(items);
    } catch (err) {
      // IMPORTANT: If backend fails, we show empty state (no listings available)
      // instead of exposing a technical error to the user.
      console.warn("Could not fetch listings; showing empty state.", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // snack helpers
  const showSnack = (message, severity = "success") => setSnack({ open: true, message, severity });
  const closeSnack = () => setSnack((s) => ({ ...s, open: false }));

  // Edit modal handlers
  function openEditModal(product) {
    setEditing({
      id: product.id,
      title: product.title || "",
      category: product.category || "",
      price: product.price ?? "",
      description: product.description || "",
      imageUrl: product.image || product.imageUrl || null,
    });
    setEditImagePreview(product.image || product.imageUrl || null);
    setEditImageFile(null);
    setOpenEdit(true);
  }
  function closeEditModal() {
    setOpenEdit(false);
    setEditing(null);
    setEditImagePreview(null);
    setEditImageFile(null);
  }

  function handleEditImageChange(e) {
    const f = e.target.files?.[0];
    if (!f) {
      setEditImageFile(null);
      setEditImagePreview(editing?.imageUrl || null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      showSnack("Upload a valid image file", "error");
      return;
    }
    setEditImageFile(f);
    const reader = new FileReader();
    reader.onload = () => setEditImagePreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function handleSaveEdit() {
    if (!editing) return;
    if (!editing.title.trim()) {
      showSnack("Title required", "error");
      return;
    }
    if (!editing.category) {
      showSnack("Category required", "error");
      return;
    }
    if (!editing.price || Number(editing.price) <= 0) {
      showSnack("Valid price required", "error");
      return;
    }

    setActionLoading(true);
    try {
      // If an image file was chosen, send multipart; otherwise send JSON
      if (editImageFile) {
        const fd = new FormData();
        fd.append("title", editing.title.trim());
        fd.append("category", editing.category);
        fd.append("price", Number(editing.price));
        fd.append("description", editing.description || "");
        fd.append("image", editImageFile);
        await productService.updateProduct(editing.id, fd);
      } else {
        const payload = {
          title: editing.title.trim(),
          category: editing.category,
          price: Number(editing.price),
          description: editing.description || "",
        };
        await productService.updateProduct(editing.id, payload);
      }

      // optimistic update locally
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...editing, image: editImagePreview || p.image } : p))
      );
      showSnack("Listing updated", "success");
      closeEditModal();
    } catch (err) {
      console.error("Save edit failed", err);
      showSnack("Failed to save changes", "error");
    } finally {
      setActionLoading(false);
    }
  }

  // Delete modal handlers
  function openDeleteConfirm(product) {
    setDeleting(product);
    setOpenDelete(true);
  }
  function closeDeleteConfirm() {
    setDeleting(null);
    setOpenDelete(false);
  }

  async function handleConfirmDelete() {
    if (!deleting) return;
    setActionLoading(true);
    try {
      await productService.deleteProduct(deleting.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
      showSnack("Listing deleted", "info");
      closeDeleteConfirm();
    } catch (err) {
      console.error("Delete failed", err);
      showSnack("Failed to delete listing", "error");
    } finally {
      setActionLoading(false);
    }
  }

  // UI render helpers
  function ProductTile({ p }) {
    return (
      <Paper sx={{ height: "100%", display: "flex", flexDirection: "column", p: 0, overflow: "hidden" }}>
        <Box sx={{ width: "100%", aspectRatio: "1 / 1", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {p.image || p.imageUrl ? (
            <img src={p.image || p.imageUrl} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: "center", px: 1 }}>
              No image
            </Typography>
          )}
        </Box>

        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
            {p.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {p.category}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976D2", mt: 1 }}>
            ₹{p.price}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: "auto", alignSelf: "flex-end" }}>
            <IconButton aria-label="edit" size="small" onClick={() => openEditModal(p)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" size="small" onClick={() => openDeleteConfirm(p)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ pt: 2, pb: 6, fontFamily: "Poppins, Inter, sans-serif" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            My Listings
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/add-product")}>
              Add Product
            </Button>
          </Stack>
        </Box>

        {loading ? (
          <Paper sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress />
          </Paper>
        ) : products.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography>No listings available.</Typography>
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/add-product")}>
              Create your first listing
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {products.map((p) => (
              <Grid item key={p.id} xs={12} sm={6} md={4}>
                <ProductTile p={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Edit dialog */}
      <Dialog open={openEdit} onClose={closeEditModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit listing</DialogTitle>
        <DialogContent>
          {editing && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField label="Title" value={editing.title} onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))} fullWidth />
              <TextField select label="Category" value={editing.category} onChange={(e) => setEditing((s) => ({ ...s, category: e.target.value }))} fullWidth>
                <MenuItem value="">-- select --</MenuItem>
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Price (INR)" type="number" value={editing.price} onChange={(e) => setEditing((s) => ({ ...s, price: e.target.value }))} fullWidth />
              <TextField label="Description" value={editing.description} onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))} fullWidth multiline rows={3} />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="outlined" component="label">
                  {editImageFile ? "Change Image" : "Upload Image"}
                  <input hidden accept="image/*" type="file" onChange={handleEditImageChange} />
                </Button>

                <Box sx={{ width: 120, aspectRatio: "1 / 1", borderRadius: 1, overflow: "hidden", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {editImagePreview ? <img src={editImagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Typography color="text.secondary">No image</Typography>}
                </Box>
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeEditModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={actionLoading}>
            {actionLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <Dialog open={openDelete} onClose={closeDeleteConfirm}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{deleting?.title}"?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={actionLoading}>
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={2600} onClose={closeSnack} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={closeSnack} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
