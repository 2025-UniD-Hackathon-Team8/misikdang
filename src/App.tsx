import { useState } from "react";
import "./App.css";
import OnboardingPage from "./pages/OnboardingPage";
import OwnerRegisteredMenuPage from "./pages/OwnerRegisteredMenuPage";
import Home from "./pages/Home";

function App() {
  return <Home />;
  // const [currentPage, setCurrentPage] = useState<"onboarding" | "owner-registered-menu">(
  //   "onboarding",
  // );

  // if (currentPage === "owner-registered-menu") {
  //   return <OwnerRegisteredMenuPage />;
  // }

  // return <OnboardingPage onStartChef={() => setCurrentPage("owner-registered-menu")} />;
}

export default App;
