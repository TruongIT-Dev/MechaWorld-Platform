import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext.jsx"; // Import CartProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID_SECRET}>
          <CartProvider> {/* Bọc App bằng CartProvider */}
            <App />
          </CartProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);