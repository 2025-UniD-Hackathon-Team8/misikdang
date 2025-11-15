// src/registerMenu_1.tsx
import { createRoot } from "react-dom/client";
import React, { useState, useEffect} from "react";
import { Search } from "lucide-react"; 
import Button from "../components/Button.tsx"; 
import TopNavigator from "../components/TopNavigator.tsx"; 
//import TabBar from "./components/TabBar"; 
import { colors } from "../constants/colors.ts"; 
import { getMenuData, saveMenuData, validateStep1, clearMenuData } from "../utils/menuDataManager.ts";


export default function RegisterMenu1() {
  const [addressQuery, setAddressQuery] = useState<string>("");
  const [location, setLocation] = useState<{ lat: number; lng: number; formatted?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  // Load existing data on mount. If this is a full page reload, clear stored
  // data first so inputs are refreshed on reload.
  useEffect(() => {
    const isReload = (() => {
      try {
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[] | undefined;
        if (navEntries && navEntries.length > 0) {
          return navEntries[0].type === "reload";
        }
        const nav = (performance as unknown as { navigation?: { type?: number } }).navigation;
        return !!(nav && nav.type === 1); // TYPE_RELOAD
      } catch {
        return false;
      }
    })();

    if (isReload) {
      clearMenuData();
      return;
    }

    const savedData = getMenuData();
    if (savedData.location) {
      setLocation(savedData.location);
    }
  }, []);

  // Progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(33.33);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!addressQuery.trim()) {
      setError("주소를 입력하세요.");
      return;
    }

    // Obtain API key from environment (Vite uses import.meta.env)
    // Fall back to REACT_APP_* if present in .env
    const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
    const GOOGLE_API_KEY = env.VITE_GOOGLE_MAPS_API_KEY || env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

      console.log("Google API Key:", GOOGLE_API_KEY);
    setLoading(true);
    try {
      const q = encodeURIComponent(addressQuery);
      if (GOOGLE_API_KEY) {
        // Use Google Geocoding API when key is available
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${GOOGLE_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "OK" && data.results && data.results.length > 0) {
          const r = data.results[0];
          setLocation({ lat: r.geometry.location.lat, lng: r.geometry.location.lng, formatted: r.formatted_address });
        } else {
          setError("주소를 찾을 수 없습니다. 다른 검색어를 시도하세요.");
          setLocation(null);
        }
      } else {
        // Fallback: use OpenStreetMap Nominatim when no Google API key configured
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`;
        const res = await fetch(nomUrl);
        const data = await res.json();
        if (data && data.length > 0) {
          const r = data[0];
          setLocation({ lat: parseFloat(r.lat), lng: parseFloat(r.lon), formatted: r.display_name });
        } else {
          setError("주소를 찾을 수 없습니다. 다른 검색어를 시도하세요.");
          setLocation(null);
        }
      }
    } catch (err) {
      console.error(err);
      setError("검색 중 오류가 발생했습니다.");
      setLocation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    // Validate location data
    const validation = validateStep1(location);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    // Save location data before moving to next page
    const currentData = getMenuData();
    saveMenuData({
      ...currentData,
      location: location!,
    });

    try {
      const mod = await import("./registerMenu_2");
      const Page = mod && mod.default ? mod.default : null;
      const root = document.getElementById("root");
      if (root && Page) {
        createRoot(root).render(<Page />);
      } else {
        // fallback: navigate forward using history or location
        window.location.href = "/";
      }
    } catch (e) {
      console.error("Failed to navigate to registerMenu_2:", e);
      window.location.href = "/";
    }
  };

  const handleBack = async () => {
    try {
      const mod = await import("../App");
      const AppPage = mod && mod.default ? mod.default : null;
      const root = document.getElementById("root");
      if (root && AppPage) {
        createRoot(root).render(<AppPage initialPage="owner-registered-menu" />);
        return;
      }
    } catch (error) {
      console.error("이전 화면으로 돌아가지 못했습니다:", error);
    }
    window.location.href = "/";
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* 1. 헤더 */}
      <TopNavigator title="위치 등록" onBackClick={handleBack} />

      {/* 2. 프로그레스 바 */}
      <div className="w-full px-4 py-3">
        <div className="flex h-1.5 w-full rounded-full bg-gray-200">
          {/* 현재 단계 (1/3) */}
          <div 
            className="h-1.5 rounded-full bg-black transition-all duration-1000 ease-out" 
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
      </div>

      {/* 3. 메인 컨텐츠 (지도 및 버튼) */}
      <div className="flex flex-grow flex-col p-4">
        {/* Error message display */}
        {validationError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm font-medium text-red-800">{validationError}</p>
          </div>
        )}

        {/* 3-1. 지번, 도로명 검색 폼 */}
        <form onSubmit={handleSearch} className="relative mb-4 w-full">
          <input
            type="text"
            value={addressQuery}
            onChange={(e) => setAddressQuery(e.target.value)}
            placeholder="동 또는 장소 입력"
            className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-12 text-base focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-gray-400 hover:text-gray-700"
            aria-label="검색"
          >
            {loading ? <span className="text-sm">검색중</span> : <Search size={20} />}
          </button>
        </form>

        {/* 3-2. 지도 API 영역 (검색 결과) */}
        <div className="flex flex-grow items-center justify-center rounded-lg bg-gray-200 text-gray-500 h-64">
          {error ? (
            <div className="p-4 text-red-600">{error}</div>
          ) : location ? (
            // Render embedded map using Google Maps Embed API
            (() => {
              const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
              const GOOGLE_API_KEY = env.VITE_GOOGLE_MAPS_API_KEY || env.REACT_APP_GOOGLE_MAPS_API_KEY || "";
              const src = GOOGLE_API_KEY
                ? `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_API_KEY}&center=${location.lat},${location.lng}&zoom=17&maptype=roadmap`
                : `https://maps.google.com/maps?q=${location.lat},${location.lng}&z=17&output=embed`;
              return (
                <div className="w-full h-full">
                  <iframe
                    title="검색된 위치"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={src}
                  />
                  <div className="p-2 text-sm text-gray-700">{location.formatted}</div>
                </div>
              );
            })()
          ) : (
            <div className="text-gray-500">지번 또는 도로명을 검색하세요.</div>
          )}
        </div>

        {/* 3-3. 다음 버튼 */}
        <div className="mt-4 w-full">
          <Button
            onClick={handleNext}
            disabled={loading}
            bgColor={colors.secondary}
            fgColor={colors.primary}
            className="w-full border border-gray-400 py-3 text-base font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
