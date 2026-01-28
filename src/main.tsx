import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ToastProvider from "./components/ToastProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <GoogleOAuthProvider clientId="<your_client_id>">
        <App />
      </GoogleOAuthProvider>
    </ToastProvider>
  </StrictMode>
);
