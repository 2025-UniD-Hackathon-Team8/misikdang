import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import OwnerRegisteredMenuPage from "./pages/OwnerRegisteredMenuPage.tsx";
import OnboardingPage from "./pages/OnboardingPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
