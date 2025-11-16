import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import RequestCardLarge from "../components/RequestCardLarge";
import ToggleTabs from "../components/ToggleTabs";
import {
  getCandidatesByCategory,
  sendRequestToGourmet,
  getOwnerProfile,
  getFoodItems,
} from "../utils/localStorage";
import {
  getMenusList,
  type StoredMenuListItem,
} from "../utils/menuDataManager";

type MenuItem = {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
};

type CommentItem = {
  id: string;
  nickname: string;
  temperature: number;
  thumbnail: string;
};

const TABS = [
  { id: "category", label: "카테고리" },
  { id: "submenu", label: "세부 메뉴" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function OwnerRegisteredMenuPage() {
  const [activeTab, setActiveTab] = useState<TabId>("category");
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [submenuItems, setSubmenuItems] = useState<StoredMenuListItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuItem | null>(
    null
  );
  const [selectedSubmenu, setSelectedSubmenu] =
    useState<StoredMenuListItem | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>(
    {}
  );
  const [modalComment, setModalComment] = useState<CommentItem | null>(null);

  // localStorage에서 메뉴 아이템 및 후보 로드
  useEffect(() => {
    loadMenuData();
  }, []);

  // 선택된 메뉴가 변경될 때 해당 카테고리의 후보 로드
  useEffect(() => {
    if (selectedCategory) {
      loadCandidates(selectedCategory.name);
    }
  }, [selectedCategory]);

  // 선택된 세부 메뉴 변경 시 후보 로드
  useEffect(() => {
    if (selectedSubmenu) {
      loadCandidates(selectedSubmenu.name);
    }
  }, [selectedSubmenu]);

  useEffect(() => {
    if (activeTab === "category") {
      setSelectedSubmenu(null);
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tabId as TabId);
      setIsAnimating(false);
    }, 150);
  };

  const loadMenuData = () => {
    const allFoodItems = getFoodItems();
    const storedSubmenus = getMenusList();

    // 카테고리 목록 생성 (중복 제거)
    const categoryMap = new Map<string, MenuItem>();

    allFoodItems.forEach((item: any) => {
      if (item.category && !categoryMap.has(item.category)) {
        categoryMap.set(item.category, {
          id: `category-${item.category}`,
          name: item.category,
          thumbnail: item.image || getRandomColor(),
          category: item.category,
        });
      }
    });

    const categories = Array.from(categoryMap.values());
    setMenuItems(categories);
    setSubmenuItems(storedSubmenus);

    // 각 카테고리의 후보 수를 commentsMap에 로드
    const newCommentsMap: Record<string, CommentItem[]> = {};
    categories.forEach((menu) => {
      const candidates = getCandidatesByCategory(menu.name);

      // nickname 기준으로 중복 제거
      const uniqueCandidates = candidates.filter(
        (candidate: any, index: number, self: any[]) =>
          index === self.findIndex((c) => c.nickname === candidate.nickname)
      );

      newCommentsMap[menu.name] = uniqueCandidates.map((c: any) => ({
        id: c.id,
        nickname: c.nickname,
        temperature: c.temperature,
        thumbnail: c.thumbnail,
      }));
    });
    setCommentsMap(newCommentsMap);
  };

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

  const loadCandidates = (categoryName: string) => {
    const candidates = getCandidatesByCategory(categoryName);

    // nickname 기준으로 중복 제거
    const uniqueCandidates = candidates.filter(
      (candidate: any, index: number, self: any[]) =>
        index === self.findIndex((c) => c.nickname === candidate.nickname)
    );

    setCommentsMap((prev) => ({
      ...prev,
      [categoryName]: uniqueCandidates.map((c: any) => ({
        id: c.id,
        nickname: c.nickname,
        temperature: c.temperature,
        thumbnail: c.thumbnail,
      })),
    }));
  };

  const handleAddMenu = async () => {
    try {
      // 페이드 아웃 애니메이션 시작
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.style.transition = "opacity 0.3s ease-out";
        mainElement.style.opacity = "0";
      }

      // 애니메이션 완료 후 페이지 전환
      await new Promise((resolve) => setTimeout(resolve, 300));

      const mod = await import("./registerMenu_1");
      const Page = mod && mod.default ? mod.default : null;
      const root = document.getElementById("root");
      if (root && Page) {
        createRoot(root).render(<Page />);
      }
    } catch (error) {
      console.error("registerMenu_1 로 이동하지 못했습니다:", error);
      alert("메뉴 등록 화면으로 이동할 수 없어요. 잠시 후 다시 시도해주세요.");

      // 에러 발생 시 원래 상태로 복원
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.style.opacity = "1";
      }
    }
  };

  return (
    <div className="flex min-h-dvh justify-center bg-[var(--color-background)] px-4 py-2 text-left">
      <main className="relative flex w-full max-w-[393px] flex-col items-center gap-[15px] px-4 pb-24 pt-[125px]">
        <h1 className="self-start text-2xl font-semibold text-[var(--color-primary)]">
          카테고리별 등록 현황
        </h1>

        <ToggleTabs
          tabs={TABS}
          activeTabId={activeTab}
          onTabSelect={handleTabChange}
          className="self-start"
        />

        {activeTab === "category" ? (
          <div
            className={`flex w-full flex-col items-center gap-[15px] transition-all duration-300 ${
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            {menuItems.map((menu) => {
              const commentCount = commentsMap[menu.name]?.length ?? 0;
              const isActive = selectedCategory?.id === menu.id;
              return (
                <button
                  key={menu.id}
                  type="button"
                  className={`flex h-[75px] w-[345px] items-center gap-4 rounded-[10px] px-4 text-left shadow-[0_8px_20px_rgba(0,0,0,0.05)] ${
                    isActive ? "bg-[var(--color-secondary)]" : "bg-white"
                  }`}
                  onClick={() => setSelectedCategory(menu)}
                >
                  <div
                    className="h-[44px] w-[44px] rounded-[10px]"
                    style={{ backgroundColor: menu.thumbnail }}
                  />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-base font-semibold text-[var(--color-primary)]">
                      {menu.name}
                    </span>
                    <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-semibold text-[var(--color-secondary)]">
                      {commentCount}
                    </span>
                  </div>
                </button>
              );
            })}

            {selectedCategory && (
              <div className="flex w-full flex-col items-center gap-[12px] animate-[fadeIn_0.4s_ease-out]">
                <div className="self-start">
                  <h2 className="text-xl font-semibold text-[var(--color-primary)]">
                    {selectedCategory.name} 테스트 후보
                  </h2>
                </div>
                {(commentsMap[selectedCategory.name] ?? []).length === 0 && (
                  <p className="text-sm text-[var(--color-gray-2)]">
                    아직 코멘트가 없어요.
                  </p>
                )}
                {commentsMap[selectedCategory.name]?.map((comment, index) => (
                  <RequestCardLarge
                    key={comment.id}
                    className="animate-[slideIn_0.4s_ease-out] opacity-0"
                    style={
                      {
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: "forwards",
                      } as React.CSSProperties
                    }
                    title={comment.nickname}
                    subtitle={`리뷰온도 ${comment.temperature.toFixed(1)} ℃`}
                    thumbnailColor={comment.thumbnail}
                    showRatingIcon={false}
                    onCardClick={() => setModalComment(comment)}
                    onClose={() =>
                      setCommentsMap((prev) => ({
                        ...prev,
                        [selectedCategory.name]: (
                          prev[selectedCategory.name] ?? []
                        ).filter((item) => item.id !== comment.id),
                      }))
                    }
                    leftAction={{
                      label: "삭제하기",
                      variant: "secondary",
                      onClick: (event) => {
                        event.stopPropagation();
                        setCommentsMap((prev) => ({
                          ...prev,
                          [selectedCategory.name]: (
                            prev[selectedCategory.name] ?? []
                          ).filter((item) => item.id !== comment.id),
                        }));
                      },
                    }}
                    rightAction={{
                      label: "요청보내기",
                      onClick: (event) => {
                        event.stopPropagation();

                        // owner 정보 가져오기
                        const ownerProfile = getOwnerProfile();
                        if (ownerProfile && selectedCategory) {
                          // gourmet에게 요청 보내기
                          sendRequestToGourmet(
                            comment.nickname,
                            selectedCategory.name,
                            {
                              name: ownerProfile.nickname || "음식점",
                              rating: 4.9,
                              reviewCount: 343,
                              distance: "1.7km",
                            }
                          );

                          alert(`${comment.nickname}님에게 요청을 보냈습니다!`);
                        } else {
                          alert("요청을 보내려면 owner 프로필이 필요합니다.");
                        }
                      },
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`flex w-full flex-col items-center gap-[15px] transition-all duration-300 ${
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            {submenuItems.map((menu) => {
              const isActive = selectedSubmenu?.id === menu.id;
              const price = menu.raw?.menuPrice || "";
              const category = menu.raw?.category || "";
              const discount = menu.raw?.discount || "";
              return (
                <button
                  key={menu.id}
                  type="button"
                  className={`flex h-[75px] w-[345px] items-center gap-4 rounded-[10px] px-4 text-left shadow-[0_8px_20px_rgba(0,0,0,0.05)] ${
                    isActive ? "bg-[var(--color-secondary)]" : "bg-white"
                  }`}
                >
                  <div
                    className="h-[44px] w-[44px] rounded-[10px]"
                    style={{ backgroundColor: menu.thumbnail || "#ffecc1" }}
                  />
                  <div className="flex flex-1 flex-col items-start justify-center">
                    <span className="text-base font-semibold text-[var(--color-primary)]">
                      {menu.name}
                    </span>
                    <span className="text-xs text-[var(--color-gray-2)] mt-1">
                      가격: {price ? `${price}원` : "-"} | 카테고리:{" "}
                      {category || "-"} | 할인: {discount || "-"}
                    </span>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              className="flex h-[75px] w-[345px] items-center justify-center rounded-[10px] bg-white text-[36px] font-normal text-[#000000] shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
              onClick={handleAddMenu}
            >
              +
            </button>
          </div>
        )}
      </main>
      {modalComment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          onClick={() => setModalComment(null)}
        >
          <div
            className="w-full max-w-[320px] rounded-[20px] bg-white p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              {modalComment.nickname}님
            </p>
            <p className="mt-1 text-xs text-[var(--color-gray-1)]">
              리뷰온도 {modalComment.temperature.toFixed(1)} ℃
            </p>
            <button
              type="button"
              className="mt-6 w-full rounded-[12px] bg-[var(--color-primary)] py-3 text-sm font-semibold text-[var(--color-secondary)]"
              onClick={() => setModalComment(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
