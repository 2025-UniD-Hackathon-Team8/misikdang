// src/registerMenu_2.tsx
import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Button from "../components/Button.tsx"; 
import TopNavigator from "../components/TopNavigator.tsx"; 
//import TabBar from "./components/TabBar"; 
import { colors } from "../constants/colors.ts"; 
import { getMenuData, saveMenuData, validateStep2} from "../utils/menuDataManager.ts";

const discountOptions = ["10%", "20%", "30%", "무료"];

export default function RegisterMenu1() {
  const [selectedDiscount, setSelectedDiscount] = useState<string>("무료");
  const [menuName, setMenuName] = useState<string>("");
  const [menuPrice, setMenuPrice] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Load existing data on mount
  useEffect(() => {

    const savedData = getMenuData();
    setMenuName(savedData.menuName);
    setMenuPrice(savedData.menuPrice);
    setSelectedDiscount(savedData.discount);
    setDescription(savedData.description);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(66.66);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = async () => {
    try {
      // Clear stored menu data so that when user goes back to the very first
      // step (step 1) all inputs are clean.

      const mod = await import("./registerMenu_1");
      const Page = mod && mod.default ? mod.default : null;
      const root = document.getElementById("root");
      if (root && Page) {
        createRoot(root).render(<Page />);
      } else {
        // fallback to history back if dynamic load fails
        window.history.back();
      }
    } catch (e) {
      console.error("Failed to navigate to registerMenu_1:", e);
      window.history.back();
    }
  };
  const handleNext = async () => {
    // Validate step 2 data
    const validation = validateStep2(menuName, menuPrice, selectedDiscount, description);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    // Save menu data before moving to next page
    const currentData = getMenuData();
    saveMenuData({
      ...currentData,
      menuName,
      menuPrice,
      discount: selectedDiscount,
      description,
    });

    try {
      const mod = await import("./RegisterMenu_3");
      const Page = mod && mod.default ? mod.default : null;
      const root = document.getElementById("root");
      if (root && Page) {
        createRoot(root).render(<Page />);
      } else {
        // fallback: navigate forward using history or location
        window.location.href = "/";
      }
    } catch (e) {
      console.error("Failed to navigate to registerMenu_3:", e);
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* 1. 헤더 */}
  <TopNavigator title="메뉴 등록" onBackClick={handleBack} />

      {/* 2. 프로그레스 바 */}
      <div className="w-full px-4 py-3">
        <div className="flex h-1.5 w-full rounded-full bg-gray-200">
          {/* 현재 단계 (2/3) */}
          <div 
            className="h-1.5 rounded-full bg-black transition-all duration-1000 ease-out" 
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
      </div>
      {/* 3. 메인 컨텐츠  */}
      <div className="flex flex-grow flex-col p-4">
        {/* Error message display */}
        {validationError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm font-medium text-red-800">{validationError}</p>
          </div>
        )}

        {/* 3-1. 메뉴정보 입력 폼*/}
        <form className="relative mb-4 w-full">
          <div>
            <label
              htmlFor="menuName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              메뉴 이름
            </label>
            <input
              id="menuName"
              type="text"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="예) 아메리카노"
              className="w-full rounded-lg border border-gray-300 py-3 px-4 text-base focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>

          <div className="flex space-x-2 padding-top-3 mt-4 mb-2">
            {/* 가격 설정 */}
            <div className="w-2/3">
              <label
                htmlFor="menuPrice"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                가격 설정
              </label>
              <div className="relative">
                <input
                  id="menuPrice"
                  type="text"
                  value={menuPrice}
                  onChange={(e) => setMenuPrice(e.target.value)}
                  placeholder="예) 4500"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 text-base focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                  원
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-4">
            {/* 할인 정보 설정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                할인 정보 설정
              </label>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <div className="grid grid-cols-4 gap-2 w-full">
              {discountOptions.map((option) => (
                <div key={option}>
                  <input
                    type="radio"
                    id={`discount-${option}`}
                    name="discount"
                    value={option}
                    checked={selectedDiscount === option}
                    onChange={() => setSelectedDiscount(option)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={`discount-${option}`}
                    className={`
                        flex cursor-pointer items-center justify-center
                        rounded-lg border border-gray-300 py-2 px-3
                        text-sm font-medium text-gray-700
                        transition-colors duration-150
                        peer-checked:border-transparent peer-checked:bg-black peer-checked:text-white
                        hover:bg-gray-100
                      `}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* 상세 정보 입력 */}
          <div className="mt-4 w-full">
            <label
              htmlFor="des"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              상세 정보
            </label>
            <textarea
              id="des"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="메뉴에 대한 상세 정보를 입력하세요"
              className="w-full h-60 rounded-lg border border-gray-300 py-3 pl-4 pr-4 text-base focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
            />
          </div>
        </form>

        {/* 3-2. 다음 버튼 */}
        <div className="mt-4 w-full">
          <Button
            onClick={handleNext}
            bgColor={colors.secondary}
            fgColor={colors.primary}
            className="w-full border border-gray-400 py-3 text-base font-semibold hover:bg-gray-100" 
          >
            다음
          </Button>
        </div>
      </div>

      {/* 4. 하단 탭바 */}
      {/* <TabBar /> */}
    </div>
  );
}