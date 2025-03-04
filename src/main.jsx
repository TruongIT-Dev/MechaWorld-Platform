import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store.js";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading Redux...</div>} persistor={persistor}>
      <React.StrictMode>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID_SECRET}>
            <App />
          </GoogleOAuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);
