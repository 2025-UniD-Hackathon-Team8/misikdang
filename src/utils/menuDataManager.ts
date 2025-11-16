/**
 * Menu Registration Data Manager
 * Manages state and persistence of menu registration data across multiple pages
 */
// Dev-time reset: clear persisted menu data once per browser session while
// developing. This helps when the dev server is restarted during work.
if (typeof window !== "undefined" && import.meta.env.DEV) {
  const DEV_INIT_FLAG = "dev_localstorage_initialized";
  if (!sessionStorage.getItem(DEV_INIT_FLAG)) {
    try {
      localStorage.removeItem("menuRegistrationData");
      localStorage.removeItem("menusList");
      console.log("[DEV] menu storage cleared for fresh session");
    } catch {
      // ignore
    }
    sessionStorage.setItem(DEV_INIT_FLAG, "true");
  }
}


export interface MenuRegistrationData {
  location: {
    lat: number;
    lng: number;
    formatted?: string;
    address?: string;
  } | null;
  menuName: string;
  menuPrice: string;
  discount: string;
  description: string;
  imagePreview: string | null;
  imageFile: File | null;
  category: string;
}

const STORAGE_KEY = "menuRegistrationData";
const MENUS_LIST_KEY = "menusList";

/* Small storage helpers to avoid repeated try/catch and JSON handling. */
const storage = {
  getRaw: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.error(`localStorage.getItem failed for ${key}:`, err);
      return null;
    }
  },
  setRaw: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.error(`localStorage.setItem failed for ${key}:`, err);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.error(`localStorage.removeItem failed for ${key}:`, err);
    }
  },
  getJson: <T = unknown>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      console.error(`Failed to parse JSON from ${key}:`, err);
      return null;
    }
  },
  setJson: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to stringify JSON for ${key}:`, err);
    }
  },
};

/**
 * Initialize empty menu data
 */
export const getEmptyMenuData = (): MenuRegistrationData => ({
  location: null,
  menuName: "",
  menuPrice: "",
  discount: "무료",
  description: "",
  imagePreview: null,
  imageFile: null,
  category: "",
});

/**
 * Get current menu data from localStorage
 */
export const getMenuData = (): MenuRegistrationData => {
  const parsed = storage.getJson<Partial<MenuRegistrationData>>(STORAGE_KEY);
  if (!parsed) return getEmptyMenuData();
  return {
    ...getEmptyMenuData(),
    ...parsed,
    // never restore File objects from storage
    imageFile: null,
    imagePreview: parsed.imagePreview ?? null,
  };
};

/**
 * Save menu data to localStorage
 * Stores all provided fields; merges with existing data to preserve unmodified fields
 */
export const saveMenuData = (data: MenuRegistrationData): void => {
  try {
    const existing = (storage.getJson<Partial<MenuRegistrationData>>(STORAGE_KEY) || {}) as Partial<MenuRegistrationData>;

    const dataToStore: Partial<MenuRegistrationData> = {
      location: data.location ?? existing.location ?? null,
      menuName: data.menuName ?? existing.menuName ?? "",
      menuPrice: data.menuPrice ?? existing.menuPrice ?? "",
      discount: data.discount ?? existing.discount ?? "무료",
      description: data.description ?? existing.description ?? "",
      imagePreview: data.imagePreview ?? existing.imagePreview ?? null,
      category: data.category ?? existing.category ?? "",
    };

    storage.setJson(STORAGE_KEY, dataToStore);
  } catch (error) {
    console.error("Failed to save menu data to localStorage:", error);
  }
};



export const clearMenuData = (): void => {
  try {
    storage.remove(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear menu data:", error);
  }
};

/**
 * Validate Step 1 (Location)
 */
export const validateStep1 = (
  location: MenuRegistrationData["location"]
): { valid: boolean; error: string | null } => {
  if (!location || !location.lat || !location.lng) {
    return { valid: false, error: "위치를 선택해주세요." };
  }
  return { valid: true, error: null };
};

/**
 * Validate Step 2 (Menu Details)
 */
export const validateStep2 = (
  menuName: string,
  menuPrice: string,
  discount: string,
  description: string
): { valid: boolean; error: string | null } => {
  if (!menuName || !menuName.trim()) {
    return { valid: false, error: "메뉴 이름을 입력해주세요." };
  }
  if (!menuPrice || !menuPrice.trim()) {
    return { valid: false, error: "메뉴 가격을 입력해주세요." };
  }
  if (isNaN(Number(menuPrice)) || Number(menuPrice) < 0) {
    return { valid: false, error: "유효한 가격을 입력해주세요." };
  }
  if (!discount || !discount.trim()) {
    return { valid: false, error: "할인 정보를 선택해주세요." };
  }
  if (!description || !description.trim()) {
    return { valid: false, error: "상세 정보를 입력해주세요." };
  }
  return { valid: true, error: null };
};

/**
 * Validate Step 3 (Image & Category)
 */
export const validateStep3 = (
  imagePreview: string | null,
  category: string
): { valid: boolean; error: string | null } => {
  if (!imagePreview) {
    return { valid: false, error: "이미지를 업로드해주세요." };
  }
  if (!category || !category.trim()) {
    return { valid: false, error: "카테고리를 입력해주세요." };
  }
  return { valid: true, error: null };
};

/** Keys and helpers for persisting a list of registered menus (for owner UI) */
export type StoredMenuListItem = {
  id: string;
  name: string;
  thumbnail?: string; // data URL or color placeholder
  category?: string; // category
  createdAt?: string;
  raw?: Partial<MenuRegistrationData>;
};

/**
 * Get list of registered menus saved in localStorage.
 * Filters out items with invalid/incomplete data.
 */
export const getMenusList = (): StoredMenuListItem[] => {
  try {
    const parsed = storage.getJson<StoredMenuListItem[]>(MENUS_LIST_KEY);
    if (!parsed) return [];
    if (Array.isArray(parsed)) {
      // Filter: only return items with valid name and category
      return parsed.filter(item => 
        item.name && item.name.trim() && item.category && item.category.trim()
      );
    }
  } catch (err) {
    console.error("Failed to read menus list from localStorage:", err);
  }
  return [];
};

/**
 * Add a completed registration to the menus list in localStorage.
 * Returns the stored item.
 * Filters out null/empty values to avoid storing incomplete data.
 */
export const addMenuToList = (data: MenuRegistrationData): StoredMenuListItem => {
  try {
    const list = getMenusList();
    const now = Date.now();
    
    // Filter raw data to only include non-null, non-empty values
    const filteredRaw: Partial<MenuRegistrationData> = {};
    if (data.location) filteredRaw.location = data.location;
    if (data.menuName && data.menuName.trim()) filteredRaw.menuName = data.menuName;
    if (data.menuPrice && data.menuPrice.trim()) filteredRaw.menuPrice = data.menuPrice;
    if (data.discount && data.discount.trim()) filteredRaw.discount = data.discount;
    if (data.description && data.description.trim()) filteredRaw.description = data.description;
    if (data.category && data.category.trim()) filteredRaw.category = data.category;
    
    const item: StoredMenuListItem = {
      id: String(now),
      name: data.menuName || "무명 메뉴",
      thumbnail: data.imagePreview || undefined,
      category: data.category || "",
      createdAt: new Date(now).toISOString(),
      raw: filteredRaw,
    };
    list.unshift(item);
    storage.setJson(MENUS_LIST_KEY, list);
    return item;
  } catch (err) {
    console.error("Failed to add menu to list:", err);
    // fall back to minimal item
    const item: StoredMenuListItem = {
      id: String(Date.now()),
      name: data.menuName || "무명 메뉴",
    };
    return item;
  }
};

export const clearMenusList = (): void => {
  try {
    storage.remove(MENUS_LIST_KEY);
  } catch (err) {
    console.error("Failed to clear menus list:", err);
  }
};
