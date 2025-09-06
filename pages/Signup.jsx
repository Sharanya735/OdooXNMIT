// src/pages/Signup.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link as MuiLink,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "@fontsource/poppins";

export default function Signup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !email.trim() || !password || !confirm) {
      setError("Please fill all the fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register({ username: username.trim(), email: email.trim(), password });
      if (res?.token) {
        navigate("/feed");
      } else {
        navigate("/login");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Registration failed — try again.";
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
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        pt: { xs: 3, sm: 4, md: 8 },
        pb: { xs: 4, md: 8 },
        fontFamily: "Poppins, Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <Container maxWidth={isMdUp ? "md" : false} sx={{ px: 0, width: "100%" }}>
        <Paper
          elevation={isMdUp ? 6 : 0}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            maxWidth: { md: 980 },
            borderRadius: { xs: 0, md: 2 },
            overflow: "hidden",
            boxShadow: isMdUp ? "0 8px 24px rgba(20,30,60,0.08)" : "none",
            background: "#fff",
            mx: "auto",
          }}
          square={!isMdUp}
        >
          {isMdUp && (
            <Box
              sx={{
                width: "45%",
                p: 6,
                background: "linear-gradient(180deg,#1976D2,#1565C0)",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Join EcoFinds
              </Typography>
              <Typography sx={{ opacity: 0.95 }}>
                Create an account to start listing and buying pre-loved items.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <MuiLink component={Link} to="/login" underline="hover" sx={{ color: "#fff", fontWeight: 600 }}>
                  Already have an account? Sign in
                </MuiLink>
              </Box>
            </Box>
          )}

          <Box
            sx={{
              width: isMdUp ? "55%" : "100%",
              px: { xs: 3, sm: 4, md: 6 },
              py: { xs: 3.5, sm: 4.5, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ mb: { xs: 1.5, sm: 2.5, md: 3 } }}>
              <Typography sx={{ color: "#0F62FF", fontWeight: 700, fontSize: { xs: 20, sm: 22, md: 24 } }}>
                Create account
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: { xs: 13, sm: 14 } }}>
                Register to buy or sell on EcoFinds
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ style: { fontSize: 15, padding: 10 } }}
              />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ style: { fontSize: 15, padding: 10 } }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ style: { fontSize: 15, padding: 10 } }}
              />

              <TextField
                label="Confirm Password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ style: { fontSize: 15, padding: 10 } }}
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
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: 15,
                  backgroundColor: "#1976D2",
                  ":hover": { backgroundColor: "#1565C0" },
                }}
              >
                {loading ? "Creating..." : "Create account"}
              </Button>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Typography sx={{ fontSize: 14 }}>
                  Already have an account?{" "}
                  <MuiLink component={Link} to="/login" underline="hover" sx={{ color: "#1976D2", fontWeight: 600 }}>
                    Sign in
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
