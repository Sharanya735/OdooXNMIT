// src/components/ProductCard.jsx
import React from "react";
import { Card, CardContent, Box, CardMedia, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ProductCard({ product, onAddToCart, onView }) {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
      <Box component={Link} to={`/product/${product.id}`} sx={{ display: "block", textDecoration: "none", color: "inherit" }}>
        <Box sx={{ width: "100%", aspectRatio: "1 / 1", background: "#f1f5f9", overflow: "hidden" }}>
          {product.image || product.imageUrl ? (
            <CardMedia component="img" image={product.image || product.imageUrl} alt={product.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography color="text.secondary">No image</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
        <Box component={Link} to={`/product/${product.id}`} sx={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>{product.title}</Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" noWrap>{product.category}</Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976D2" }}>₹{product.price}</Typography>

        <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
          <Button size="small" variant="outlined" startIcon={<VisibilityIcon />} onClick={() => onView?.(product)}>View</Button>
          <Button size="small" variant="contained" startIcon={<AddShoppingCartIcon />} onClick={() => onAddToCart?.(product)}>Add</Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
