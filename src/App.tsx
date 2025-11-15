import "./App.css";
import OnboardingPage from "./pages/OnboardingPage";
import OwnerRegisteredMenuPage from "./pages/OwnerRegisteredMenuPage";
import Home from "./pages/Home";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Home />
    </>
  );
  // const [currentPage, setCurrentPage] = useState<"onboarding" | "owner-registered-menu">(
  //   "onboarding",
  // );

  // if (currentPage === "owner-registered-menu") {
  //   return <OwnerRegisteredMenuPage />;
  // }

  // return <OnboardingPage onStartChef={() => setCurrentPage("owner-registered-menu")} />;
}

export default App;
