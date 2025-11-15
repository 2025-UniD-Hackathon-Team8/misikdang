import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // 현재 페이지에 따라 활성 탭 결정
  const getActiveTab = (): "left" | "middle" | "right" | undefined => {
    if (currentPage === "home" || currentPage === "owner-registered-menu") {
      return "left";
    }
    if (
      currentPage === "user-request-history" ||
      currentPage === "owner-request-history"
    ) {
      return "middle";
    }
    if (currentPage === "profile" || currentPage === "owner-profile") {
      return "right";
    }
    return undefined;
  };

  let content: ReactNode;
  if (currentPage === "onboarding") {
    content = (
      <OnboardingPage
        onStartChef={handleStartChef}
        onStartGourmet={handleStartGourmet}
      />
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
        <Home />
      </>
    );
  }

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
      {showBottomNav && (
        <BottomNav
          activeTab={getActiveTab()}
          onLeftClick={handleNavLeft}
          onMiddleClick={handleNavMiddle}
          onRightClick={handleNotImplemented}
        />
      )}
    </>
  );
}

export default App;
