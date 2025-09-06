// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "@fontsource/poppins";

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm")); // >=600
  const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // >=900

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      await authService.login({ email, password });
      navigate("/feed");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Login failed — check credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "transparent",
        fontFamily: "Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        pb: 4,
      }}
    >
      <Box sx={{ height: 56 }} />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          px: { xs: 0, sm: 2, md: 3 },
        }}
      >
        <Paper
          elevation={isMdUp ? 6 : 0}
          sx={{
            width: "100%",
            maxWidth: isMdUp ? 980 : isSmUp ? 520 : "100%",
            borderRadius: isSmUp ? 12 : 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: isMdUp ? "row" : "column",
            boxShadow: isMdUp ? "0 8px 24px rgba(20,30,60,0.08)" : "none",
            background: "#fff",
            mx: isSmUp ? "auto" : 0,
          }}
        >
          {isMdUp && (
            <Box
              sx={{
                width: "45%",
                background: "linear-gradient(180deg,#1976D2,#1565C0)",
                color: "#fff",
                p: 6,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                EcoFinds
              </Typography>
              <Typography sx={{ opacity: 0.95, fontSize: 14 }}>
                Buy & sell pre-loved items sustainably.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <MuiLink component={Link} to="/signup" underline="hover" sx={{ color: "#fff", fontWeight: 600 }}>
                  Create an account
                </MuiLink>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              width: isMdUp ? "55%" : "100%",
              p: { xs: 3, sm: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ color: "#0F62FF", fontWeight: 700, fontSize: { xs: 20, sm: 22, md: 24 } }}>
                EcoFinds
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: { xs: 13, sm: 14 } }}>
                Buy & sell pre-loved items — sustainable & simple
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ style: { fontSize: 16, padding: 12 } }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ style: { fontSize: 16, padding: 12 } }}
              />

              {error && (
                <Typography color="error" sx={{ mt: 1, mb: 1, fontSize: 13 }}>
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1.5,
                  mb: 1,
                  py: { xs: 1.4, sm: 1.2 },
                  fontWeight: 600,
                  fontSize: { xs: 16, sm: 15 },
                  backgroundColor: "#1976D2",
                  ":hover": { backgroundColor: "#1565C0" },
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, gap: 2, flexWrap: "wrap" }}>
                <MuiLink component={Link} to="/signup" underline="hover" sx={{ color: "#1976D2", fontSize: 14 }}>
                  Create account
                </MuiLink>
                <MuiLink href="#" underline="hover" sx={{ color: "#1976D2", fontSize: 14 }}>
                  Forgot password?
                </MuiLink>
              </Box>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  By continuing you agree to our Terms.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
