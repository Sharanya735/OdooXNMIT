// src/components/NavBar.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import "@fontsource/poppins";

/**
 * Polished NavBar:
 * - Desktop: spaced buttons, active underline, avatar/login on right
 * - Mobile: hamburger opens Drawer with same links
 * - Links: Products, Sell, My Listings, Purchases, Cart, Dashboard
 */

const NAV_ITEMS = [
  { title: "Feed", path: "/feed", icon: <HomeIcon /> },
  { title: "Sell", path: "/add-product", icon: <AddCircleOutlineIcon /> },
  { title: "My Listings", path: "/my-listings", icon: <Inventory2Icon /> },
  { title: "Purchases", path: "/purchases", icon: <ReceiptLongIcon /> },
  { title: "Cart", path: "/cart", icon: <ShoppingCartIcon /> },
  { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
];

export default function NavBar() {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = authService.getUser();
  const isLoggedIn = !!authService.getToken();

  function toggleDrawer(next) {
    setDrawerOpen(next);
  }

  function handleLogout() {
    authService.logout();
    navigate("/login");
  }

  // helper to detect active route (simple startsWith)
  function isActive(path) {
    if (!path) return false;
    // exact root handling: /feed and /
    if (path === "/feed" && (location.pathname === "/" || location.pathname.startsWith("/feed"))) return true;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  const drawerList = (
    <Box sx={{ width: 260 }} role="presentation" onClick={() => toggleDrawer(false)} onKeyDown={() => toggleDrawer(false)}>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "#1976D2" }}>{(user?.username || "G").charAt(0).toUpperCase()}</Avatar>
        <Box>
          <Typography sx={{ fontWeight: 700 }}>{user?.username || "Guest"}</Typography>
          <Typography variant="caption" color="text.secondary">
            {isLoggedIn ? user?.email : "Not signed in"}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <List>
        {NAV_ITEMS.map((it) => (
          <ListItem key={it.path} disablePadding>
            <ListItemButton component={Link} to={it.path} selected={isActive(it.path)}>
              <ListItemIcon>{it.icon}</ListItemIcon>
              <ListItemText primary={it.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {!isLoggedIn ? (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login / Signup" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1} sx={{ fontFamily: "Poppins, Inter, sans-serif" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isSmUp && (
              <IconButton edge="start" onClick={() => toggleDrawer(true)} aria-label="open menu">
                <MenuIcon />
              </IconButton>
            )}

            <Box component={Link} to="/feed" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit" }}>
              <Box sx={{ width: 36, height: 36, bgcolor: "#1976D2", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center", mr: 1 }}>
                <Typography sx={{ color: "#fff", fontWeight: 800 }}>E</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
                EcoFinds
              </Typography>
            </Box>
          </Box>

          {isSmUp ? (
            // Desktop links
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, justifyContent: "center" }}>
              {NAV_ITEMS.map((it) => (
                <Button
                  key={it.path}
                  component={Link}
                  to={it.path}
                  startIcon={it.icon}
                  sx={{
                    textTransform: "none",
                    mx: 0.5,
                    px: 2,
                    color: isActive(it.path) ? "primary.main" : "text.primary",
                    borderBottom: isActive(it.path) ? "3px solid" : "3px solid transparent",
                    borderColor: isActive(it.path) ? "primary.main" : "transparent",
                    borderRadius: 0,
                    fontWeight: isActive(it.path) ? 700 : 500,
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  {it.title}
                </Button>
              ))}
            </Box>
          ) : (
            <Box sx={{ flex: 1 }} />
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isSmUp ? (
              <>
                {!isLoggedIn ? (
                  <Button component={Link} to="/login" variant="outlined" sx={{ textTransform: "none" }}>
                    Login
                  </Button>
                ) : (
                  <>
                    <Tooltip title={user?.username || "Account"}>
                      <IconButton component={Link} to="/dashboard" aria-label="account">
                        <Avatar sx={{ bgcolor: "#1976D2" }}>{(user?.username || "U").charAt(0).toUpperCase()}</Avatar>
                      </IconButton>
                    </Tooltip>
                    <Button onClick={handleLogout} variant="text" startIcon={<LogoutIcon />} sx={{ textTransform: "none" }}>
                      Logout
                    </Button>
                  </>
                )}
              </>
            ) : (
              // mobile quick icons
              <>
                <IconButton component={Link} to="/cart" aria-label="cart">
                  <ShoppingCartIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
}
