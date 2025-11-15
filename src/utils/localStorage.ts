// localStorage 키 상수
const STORAGE_KEYS = {
  FOOD_CATEGORIES: "misikdang_food_categories",
  FOOD_ITEMS: "misikdang_food_items",
  USER_MODE: "misikdang_user_mode",
  USER_REQUESTS: "misikdang_user_requests",
  OWNER_MENUS: "misikdang_owner_menus",
  GOURMET_PROFILE: "misikdang_gourmet_profile",
  OWNER_PROFILE: "misikdang_owner_profile",
  CATEGORY_CANDIDATES: "misikdang_category_candidates", // owner가 올린 메뉴별 테스트 후보 (gourmet가 오른쪽 스와이프한 사용자들)
} as const;

// 제네릭 localStorage 저장 함수
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// 제네릭 localStorage 읽기 함수
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

// localStorage 삭제 함수
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
}

// localStorage 전체 삭제 함수
export function clearAllLocalStorage(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

// 특정 키 접근 함수들
export function getFoodCategories() {
  return getLocalStorage(STORAGE_KEYS.FOOD_CATEGORIES, []);
}

export function setFoodCategories(categories: any[]) {
  setLocalStorage(STORAGE_KEYS.FOOD_CATEGORIES, categories);
}

export function getFoodItems() {
  return getLocalStorage(STORAGE_KEYS.FOOD_ITEMS, []);
}

export function setFoodItems(items: any[]) {
  setLocalStorage(STORAGE_KEYS.FOOD_ITEMS, items);
}

export function getUserMode() {
  return getLocalStorage<"gourmet" | "chef" | null>(
    STORAGE_KEYS.USER_MODE,
    null
  );
}

export function setUserMode(mode: "gourmet" | "chef" | null) {
  setLocalStorage(STORAGE_KEYS.USER_MODE, mode);
}

export function getUserRequests() {
  return getLocalStorage(STORAGE_KEYS.USER_REQUESTS, []);
}

export function setUserRequests(requests: any[]) {
  setLocalStorage(STORAGE_KEYS.USER_REQUESTS, requests);
}

export function getOwnerMenus() {
  return getLocalStorage(STORAGE_KEYS.OWNER_MENUS, []);
}

export function setOwnerMenus(menus: any[]) {
  setLocalStorage(STORAGE_KEYS.OWNER_MENUS, menus);
}

export function getGourmetProfile() {
  return getLocalStorage(STORAGE_KEYS.GOURMET_PROFILE, null) as {
    nickname: string;
    userId: string;
    joinDate: string;
    reviewTemperature: number;
    reviewCompletionRate: number;
    pendingReviews: { restaurantName: string; visitDate: string }[];
    recentReviews: { restaurantName: string; visitDate: string }[];
  } | null;
}

export function setGourmetProfile(profile: any) {
  setLocalStorage(STORAGE_KEYS.GOURMET_PROFILE, profile);
}

export function getOwnerProfile() {
  return getLocalStorage(STORAGE_KEYS.OWNER_PROFILE, null);
}

export function setOwnerProfile(profile: any) {
  setLocalStorage(STORAGE_KEYS.OWNER_PROFILE, profile);
}

// 카테고리 요청 추가 함수
export function addCategoryRequest(categoryTitle: string, userId: string) {
  const requests = getUserRequests();
  const newRequest = {
    id: `request-${Date.now()}`,
    categoryTitle,
    userId,
    timestamp: new Date().toISOString(),
    status: "pending" as const,
  };
  setUserRequests([...requests, newRequest]);
  return newRequest;
}

// 오너 메뉴 카운트 증가 함수
export function incrementMenuCount(menuName: string) {
  const menus = getOwnerMenus();
  const existingMenu = menus.find((m: any) => m.name === menuName);

  if (existingMenu) {
    const updatedMenus = menus.map((m: any) =>
      m.name === menuName ? { ...m, count: m.count + 1 } : m
    );
    setOwnerMenus(updatedMenus);
  } else {
    const newMenu = {
      id: `menu-${Date.now()}`,
      name: menuName,
      thumbnail: getRandomColor(),
      count: 1,
    };
    setOwnerMenus([...menus, newMenu]);
  }
}

// 카테고리 후보 추가 함수 (gourmet가 왼쪽 스와이프한 경우)
export function addCategoryCandidate(
  categoryName: string,
  userInfo: { nickname: string; temperature: number }
) {
  const candidates = getCategoryCandidates();
  console.log("[addCategoryCandidate] 기존 후보:", candidates);
  const newCandidate = {
    id: `candidate-${Date.now()}`,
    categoryName,
    nickname: userInfo.nickname,
    temperature: userInfo.temperature,
    thumbnail: getRandomColor(),
    timestamp: new Date().toISOString(),
  };
  console.log("[addCategoryCandidate] 새 후보:", newCandidate);
  setCategoryCandidates([...candidates, newCandidate]);
  const updatedCandidates = getCategoryCandidates();
  console.log("[addCategoryCandidate] 저장 후 후보:", updatedCandidates);
  return newCandidate;
}

// 메뉴 후보 가져오기
export function getCategoryCandidates() {
  return getLocalStorage(STORAGE_KEYS.CATEGORY_CANDIDATES, []);
}

// 메뉴 후보 설정
export function setCategoryCandidates(candidates: any[]) {
  setLocalStorage(STORAGE_KEYS.CATEGORY_CANDIDATES, candidates);
}

// 특정 카테고리의 후보만 가져오기
export function getCandidatesByCategory(categoryName: string) {
  const allCandidates = getCategoryCandidates();
  return allCandidates.filter((c: any) => c.categoryName === categoryName);
}

// 랜덤 색상 생성 (메뉴 썸네일용)
function getRandomColor() {
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
}

// Mock 데이터 초기화 함수
export function initializeMockData(
  foodCategories: any[],
  foodItems: any[],
  gourmetProfile?: any,
  ownerProfile?: any
) {
  // 이미 데이터가 있는지 확인
  const existingCategories = getFoodCategories();
  const existingItems = getFoodItems();

  // 데이터가 없으면 초기화
  if (existingCategories.length === 0) {
    setFoodCategories(foodCategories);
  }

  if (existingItems.length === 0) {
    setFoodItems(foodItems);
  }

  // 초기 사용자 요청 및 메뉴가 없으면 빈 배열로 초기화
  if (getUserRequests().length === 0) {
    setUserRequests([]);
  }

  if (getOwnerMenus().length === 0) {
    // 초기 메뉴 데이터 설정
    const initialMenus = [
      {
        id: "menu-1",
        name: "햄부기",
        thumbnail: "#ffe3d5",
        count: 0,
      },
      {
        id: "menu-2",
        name: "치킨",
        thumbnail: "#e6f6ff",
        count: 0,
      },
      {
        id: "menu-3",
        name: "피자",
        thumbnail: "#f5e6ff",
        count: 0,
      },
    ];
    setOwnerMenus(initialMenus);
  }

  // 프로필 데이터 초기화
  if (!getGourmetProfile() && gourmetProfile) {
    setGourmetProfile(gourmetProfile);
  }

  if (!getOwnerProfile() && ownerProfile) {
    setOwnerProfile(ownerProfile);
  }
}

export { STORAGE_KEYS };
