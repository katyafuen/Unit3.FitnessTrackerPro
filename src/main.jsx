import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./auth/AuthContext";
import { ApiProvider } from "./api/ApiContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ApiProvider>
      <App />
    </ApiProvider>
  </AuthProvider>
);
