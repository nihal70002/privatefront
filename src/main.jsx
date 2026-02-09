import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./context/CartContext"; // ✅ make sure path & name match
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster
      position="top-right"
      containerStyle={{ zIndex: 2147483647 }}
      toastOptions={{ style: { zIndex: 2147483647 } }}
    />

    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
);

