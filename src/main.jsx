// In your main entry file
import { createRoot } from "react-dom/client";
import { MovieProvider } from "./contexts/MovieContext";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <MovieProvider>
        <App />
      </MovieProvider>
    </BrowserRouter>
  </React.StrictMode>
);
