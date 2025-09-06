// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // if not present, create an empty file or remove this line

const root = createRoot(document.getElementById("root"));
root.render(<App />);
