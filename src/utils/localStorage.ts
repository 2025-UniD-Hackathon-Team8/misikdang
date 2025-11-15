// localStorage 키 상수
const STORAGE_KEYS = {
  FOOD_CATEGORIES: "misikdang_food_categories",
  FOOD_ITEMS: "misikdang_food_items",
  USER_MODE: "misikdang_user_mode",
  USER_REQUESTS: "misikdang_user_requests",
  OWNER_MENUS: "misikdang_owner_menus",
  GOURMET_PROFILE: "misikdang_gourmet_profile",
  OWNER_PROFILE: "misikdang_owner_profile",
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
  return getLocalStorage(STORAGE_KEYS.GOURMET_PROFILE, null);
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
    setOwnerMenus([]);
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
