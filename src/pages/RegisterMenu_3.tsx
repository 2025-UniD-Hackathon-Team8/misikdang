// src/registerMenu_3.tsx
import { useState, useRef, type ChangeEvent, useEffect } from "react";
import Button from "../components/Button.tsx";
import TopNavigator from "../components/TopNavigator.tsx";
import { createRoot } from "react-dom/client";
//import TabBar from "./components/TabBar";
import { colors } from "../constants/colors.ts";
import {
  getMenuData,
  saveMenuData,
  validateStep3,
  clearMenuData,
  addMenuToList,
  type MenuRegistrationData,
} from "../utils/menuDataManager.ts";
import {
  getFoodItems,
  setFoodItems,
  getOwnerMenus,
  setOwnerMenus,
} from "../utils/localStorage.ts";

export default function RegisterMenu_3() {
  // 1. 이미지 미리보기 URL을 저장할 state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  // 2. 숨겨진 file input에 접근하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function for random color
  const getRandomColor = () => {
    const colors = [
      "#ffe3d5",
      "#e6f6ff",
      "#f5e6ff",
      "#ffe1e0",
      "#ffecc1",
      "#cdf2ff",
      "#e4f7e4",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Load existing data on mount
  useEffect(() => {
    const savedData = getMenuData();
    setImagePreview(savedData.imagePreview);
    setCategory(savedData.category);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 선택된 파일

    if (file) {
      // FileReader를 사용해 이미지 파일을 읽고 data URL로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        // 읽기가 완료되면 state에 data URL을 저장
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // 파일 선택이 취소된 경우 미리보기 제거
      setImagePreview(null);
    }
  };

  /**
   * 4. '파일 선택' 버튼 클릭 시 숨겨진 input을 클릭시키는 핸들러
   */
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click(); // ref를 통해 숨겨진 input 클릭
  };

  /**삭제 함수 */
  const handleDeleteButtonClick = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleBack = async () => {
    try {
      const mod = await import("./registerMenu_2");
      const Page = mod && mod.default ? mod.default : null;
      const root = document.getElementById("root");
      if (root && Page) {
        createRoot(root).render(<Page />);
      } else {
        // fallback to history back if dynamic load fails
        window.history.back();
      }
    } catch (e) {
      console.error("Failed to navigate to registerMenu_2:", e);
      window.history.back();
    }
  };

  const handleComplete = async () => {
    // Validate step 3 data
    const validation = validateStep3(imagePreview, category);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      // Build an explicit final payload (don't rely on getMenuData to carry
      // transient image data). This ensures menuName and imagePreview are
      // present in the payload we send to the server, download, and store.
      const persisted = getMenuData();
      const finalPayload: MenuRegistrationData = {
        location: persisted.location ?? null,
        menuName: persisted.menuName ?? "",
        menuPrice: persisted.menuPrice ?? "",
        discount: persisted.discount ?? "",
        description: persisted.description ?? "",
        // include the in-memory image preview (data URL)
        imagePreview: imagePreview ?? null,
        imageFile: null,
        category: category ?? "",
      };

      console.log("Final payload to be saved:", finalPayload);
      // Save non-image fields to localStorage
      saveMenuData(finalPayload);

      // Persist the final payload to localStorage (owner-visible list).
      // We intentionally do NOT send this to any local filesystem server; all
      // data is stored in the browser's localStorage under the menus list key.
      try {
        addMenuToList(finalPayload);

        // Also save to FOOD_ITEMS for food list
        const currentFoodItems = getFoodItems();
        const newFoodItem = {
          id: String(Date.now()),
          name: finalPayload.menuName || "unknown",
          category: finalPayload.category || "",
          price: finalPayload.menuPrice || "",
          discount: finalPayload.discount || "",
          description: finalPayload.description || "",
          image: finalPayload.imagePreview || "",
          location: finalPayload.location,
          createdAt: new Date().toISOString(),
        };
        setFoodItems([...currentFoodItems, newFoodItem]);

        // Also save to OWNER_MENUS
        const currentOwnerMenus = getOwnerMenus();
        const newOwnerMenu = {
          id: `menu-${Date.now()}`,
          name: finalPayload.menuName || "unknown",
          thumbnail: finalPayload.imagePreview || getRandomColor(),
          count: 0,
        };
        setOwnerMenus([...currentOwnerMenus, newOwnerMenu]);
      } catch (err) {
        console.warn("Failed to append menu to local list:", err);
      }

      // Clear the data after submission
      clearMenuData();

      // Show success message
      alert("메뉴 등록이 완료되었습니다!");

      // Navigate to OwnerRegisteredMenuPage
      try {
        const mod = await import("./OwnerRegisteredMenuPage");
        const Page = mod && mod.default ? mod.default : null;
        const root = document.getElementById("root");
        if (root && Page) {
          createRoot(root).render(<Page />);
          return;
        }
      } catch (e) {
        console.warn(
          "Could not dynamically load OwnerRegisteredMenuPage, falling back to home:",
          e
        );
      }
      // fallback
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to complete registration:", error);
      setValidationError("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* 1. 헤더 */}
      <TopNavigator title="이미지 등록" onBackClick={handleBack} />
      {/* 2. 프로그레스 바 */}
      <div className="w-full px-4 py-3">
        <div className="flex h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="h-1.5 rounded-full bg-black transition-all duration-1000 ease-out"
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
      </div>

      {/* 3. 메인 컨텐츠*/}
      <div className="flex flex-grow flex-col p-4">
        {/* Error message display */}
        {validationError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm font-medium text-red-800">
              {validationError}
            </p>
          </div>
        )}

        {/* 3-1. 사진업로드*/}
        <form className="relative mb-4 w-full">
          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              이미지 등록
            </label>

            <div className="h-100 flex items-center justify-center w-full h-48 rounded-lg border border-gray-300 bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="이미지 미리보기"
                  className="h-full w-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400">이미지 미리보기</span>
              )}
            </div>
            <input
              id="imageUpload"
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <div className="w-full">
              <button
                type="button"
                onClick={handleUploadButtonClick}
                className="w-1/2 mt-2  rounded-lg border border-gray-300 py-2 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                파일 선택
              </button>
              <button
                type="button"
                onClick={handleDeleteButtonClick}
                className="w-1/2 mt-2 rounded-lg border border-gray-300 py-2 px-4 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                삭제하기
              </button>
            </div>
          </div>

          <div className="flex space-x-2 padding-top-3 mt-4 mb-2">
            {/* 카테고리 설정 */}
            <div className="w-2/3">
              <label
                htmlFor="menuCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                카테고리
              </label>
              <div className="relative">
                <input
                  id="menuCategory"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="예) 햄버거"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 text-base focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>
        </form>
        {/* 3-2. 완료 버튼 */}
        <div className="mt-4 w-full">
          <Button
            onClick={handleComplete}
            disabled={isSubmitting}
            bgColor={colors.primary}
            fgColor={colors.secondary}
            className="w-full border border-gray-400 py-3 text-base font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "처리 중..." : "완료"}
          </Button>
        </div>
      </div>

      {/* 4. 하단 탭바 */}
      {/* <TabBar /> */}
    </div>
  );
}
