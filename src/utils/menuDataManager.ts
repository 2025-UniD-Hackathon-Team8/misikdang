/**
 * Menu Registration Data Manager
 * Manages state and persistence of menu registration data across multiple pages
 */

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
  quantity: string;
}

const STORAGE_KEY = "menuRegistrationData";

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
  quantity: "",
});

/**
 * Get current menu data from localStorage
 */
export const getMenuData = (): MenuRegistrationData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Note: imageFile and imagePreview won't be in localStorage, reset them
      return {
        ...parsed,
        imageFile: null,
        imagePreview: null,
      };
    }
  } catch (error) {
    console.error("Failed to retrieve menu data from localStorage:", error);
  }
  return getEmptyMenuData();
};

/**
 * Save menu data to localStorage
 */
export const saveMenuData = (data: MenuRegistrationData): void => {
  try {
    // We exclude imageFile and imagePreview from storage as they can't be serialized
    const dataToStore = {
      location: data.location,
      menuName: data.menuName,
      menuPrice: data.menuPrice,
      discount: data.discount,
      description: data.description,
      quantity: data.quantity,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  } catch (error) {
    console.error("Failed to save menu data to localStorage:", error);
  }
};

/**
 * Save complete registration data as JSON file (download)
 */
export const downloadMenuDataAsJSON = (data: MenuRegistrationData): void => {
  try {
    const dataToDownload = {
      location: data.location,
      menuName: data.menuName,
      menuPrice: data.menuPrice,
      discount: data.discount,
      description: data.description,
      quantity: data.quantity,
      createdAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `menu_registration_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download menu data:", error);
    throw error;
  }
};

/**
 * Clear all stored data
 */
export const clearMenuData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
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
 * Validate Step 3 (Image & Quantity)
 */
export const validateStep3 = (
  imagePreview: string | null,
  quantity: string
): { valid: boolean; error: string | null } => {
  if (!imagePreview) {
    return { valid: false, error: "이미지를 업로드해주세요." };
  }
  if (!quantity || !quantity.trim()) {
    return { valid: false, error: "수량을 입력해주세요." };
  }
  if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
    return { valid: false, error: "유효한 수량을 입력해주세요." };
  }
  return { valid: true, error: null };
};
