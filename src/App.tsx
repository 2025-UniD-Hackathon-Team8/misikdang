import { useState } from "react";
import type { ReactNode } from "react";
import "./App.css";
import OnboardingPage from "./pages/OnboardingPage";
import OwnerRegisteredMenuPage from "./pages/OwnerRegisteredMenuPage";
import OwnerRequestHistoryPage from "./pages/OwnerRequestHistoryPage";
import UserRequestHistoryPage from "./pages/UserRequestHistoryPage";
import Home from "./pages/Home";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Profile from "./pages/Profile";
import OwnerProfile from "./pages/OwnerProfile";

type PageKey =
  | "home"
  | "onboarding"
  | "owner-registered-menu"
  | "user-request-history"
  | "owner-request-history"
  | "profile"
  | "owner-profile";
type UserMode = "gourmet" | "chef" | null;

type AppProps = {
  initialPage?: PageKey;
};

function App({ initialPage = "onboarding" }: AppProps) {
  const [currentPage, setCurrentPage] = useState<PageKey>(initialPage);
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
    if (userMode === "gourmet") {
      setCurrentPage("profile");
    } else if (userMode === "chef") {
      setCurrentPage("owner-profile");
    } else {
      alert("사용자 모드를 먼저 선택하세요.");
    }
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
    content = (
      <OnboardingPage onStartChef={handleStartChef} onStartGourmet={handleStartGourmet} />
    );
  } else if (currentPage === "owner-registered-menu") {
    content = <OwnerRegisteredMenuPage />;
  } else if (currentPage === "user-request-history") {
    content = <UserRequestHistoryPage />;
  } else if (currentPage === "owner-request-history") {
    content = <OwnerRequestHistoryPage />;
  } else if (currentPage === "profile") {
    content = <Profile />;
  } else if (currentPage === "owner-profile") {
    content = <OwnerProfile />;
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
      {showBottomNav && (
        <BottomNav
          onLeftClick={handleNavLeft}
          onMiddleClick={handleNavMiddle}
          onRightClick={handleNotImplemented}
        />
      )}
      {content}
    </>
  );
}

export default App;
