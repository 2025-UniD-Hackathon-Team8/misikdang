import { useState } from "react";
import type { ReactNode } from "react";
import "./App.css";
// import Button from "./components/Button"; // Button 컴포넌트는 사용하지 않으므로 주석 처리하거나 제거 가능

// 1. components 폴더에서 Profile 컴포넌트를 import 합니다.
import Profile from "./pages/Profile";
import OwnerProfile from "./pages/OwnerProfile";
import OnboardingPage from "./pages/OnboardingPage";
import OwnerRegisteredMenuPage from "./pages/OwnerRegisteredMenuPage";
import OwnerRequestHistoryPage from "./pages/OwnerRequestHistoryPage";
import UserRequestHistoryPage from "./pages/UserRequestHistoryPage";
import Home from "./pages/Home";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

type PageKey = "home" | "onboarding" | "owner-registered-menu" | "user-request-history" | "owner-request-history";
type UserMode = "gourmet" | "chef" | null;

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("onboarding");
  const [userMode, setUserMode] = useState<UserMode>(null);
  const showBottomNav = currentPage !== "onboarding";

  const handleStartChef = () => {
    setUserMode("chef");
    setCurrentPage("owner-registered-menu");
  };
  const handleStartGourmet = () => {
    setUserMode("gourmet");
    setCurrentPage("home");
  };
  const handleNotImplemented = () => {
    alert("해당 기능은 아직 구현되지 않았습니다.");
  };

  const handleNavLeft = () => {
    if (userMode === "gourmet") {
      setCurrentPage("home");
    } else if (userMode === "chef") {
      setCurrentPage("owner-registered-menu");
    }
  };

  const handleNavMiddle = () => {
    if (userMode === "gourmet") {
      setCurrentPage("user-request-history");
    } else if (userMode === "chef") {
      setCurrentPage("owner-request-history");
    }
  };

  let content: ReactNode;
  if (currentPage === "onboarding") {
    content = <OnboardingPage onStartChef={handleStartChef} onStartGourmet={handleStartGourmet} />;
  } else if (currentPage === "owner-registered-menu") {
    content = <OwnerRegisteredMenuPage />;
  } else if (currentPage === "user-request-history") {
    content = <UserRequestHistoryPage />;
  } else if (currentPage === "owner-request-history") {
    content = <OwnerRequestHistoryPage />;
  } else {
    content = (
      <>
        <Header />
        <Home />
      </>
    );
  }

  return (
    <>
      {showBottomNav && <BottomNav onLeftClick={handleNavLeft} onMiddleClick={handleNavMiddle} onRightClick={handleNotImplemented} />}
      {content}
    </>
  );
}

export default App;
