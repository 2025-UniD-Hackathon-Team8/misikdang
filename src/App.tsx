import { useState } from "react";
import "./App.css";
// import Button from "./components/Button"; // Button 컴포넌트는 사용하지 않으므로 주석 처리하거나 제거 가능

// 1. components 폴더에서 Profile 컴포넌트를 import 합니다.
import Profile from "./pages/Profile";
import OwnerProfile from "./pages/OwnerProfile";
import OnboardingPage from "./pages/OnboardingPage";
import OwnerRegisteredMenuPage from "./pages/OwnerRegisteredMenuPage";
import Home from "./pages/Home";
import OwnerRequestHistoryPage from "./pages/OwnerRequestHistoryPage";

function App() {
  return <OwnerProfile />;
  // const [currentPage, setCurrentPage] = useState<"onboarding" | "owner-registered-menu">(
  //   "onboarding",
  // );

  // if (currentPage === "owner-registered-menu") {
  //   return <OwnerRegisteredMenuPage />;
  // }

  // return <OnboardingPage onStartChef={() => setCurrentPage("owner-registered-menu")} />;
}

export default App;
