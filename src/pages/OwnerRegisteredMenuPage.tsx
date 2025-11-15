import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import RequestCardLarge from "../components/RequestCardLarge";
import ToggleTabs from "../components/ToggleTabs";
import {
  getOwnerMenus,
  getCandidatesByCategory,
  sendRequestToGourmet,
  getOwnerProfile,
} from "../utils/localStorage";
import { getMenusList, type StoredMenuListItem } from "../utils/menuDataManager";

type MenuItem = {
  id: string;
  name: string;
  thumbnail: string;
  count: number;
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

  const loadMenuData = () => {
    const storedMenus = getOwnerMenus();
    const storedSubmenus = getMenusList();
    setMenuItems(storedMenus);
    setSubmenuItems(storedSubmenus);

    // 각 메뉴/세부 메뉴의 후보 수를 commentsMap에 로드
    const newCommentsMap: Record<string, CommentItem[]> = {};
    [...storedMenus, ...storedSubmenus].forEach((menu: { name: string }) => {
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
      const mod = await import("./registerMenu_1");
      const Page = mod && mod.default ? mod.default : null;
      const root = document.getElementById("root");
      if (root && Page) {
        createRoot(root).render(<Page />);
      }
    } catch (error) {
      console.error("registerMenu_1 로 이동하지 못했습니다:", error);
      alert("메뉴 등록 화면으로 이동할 수 없어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex min-h-dvh justify-center bg-[var(--color-background)] px-4 py-6 text-left">
      <main className="relative flex w-full max-w-[393px] flex-col items-center gap-[15px] px-4 pb-24 pt-[125px]">
        <h1 className="self-start text-2xl font-semibold text-[var(--color-primary)]">
          등록한 메뉴
        </h1>

        <ToggleTabs
          tabs={TABS}
          activeTabId={activeTab}
          onTabSelect={(id) => setActiveTab(id as TabId)}
          className="self-start"
        />

        {activeTab === "category" ? (
          <div className="flex w-full flex-col items-center gap-[15px]">
            {menuItems.map((menu) => {
              const commentCount = commentsMap[menu.name]?.length ?? 0;
              const isActive = selectedCategory?.id === menu.id;
              return (
                <button
                  key={menu.id}
                  type="button"
                  className={`flex h-[75px] w-[345px] items-center gap-4 rounded-[10px] px-4 text-left shadow-[0_8px_20px_rgba(0,0,0,0.05)] ${
                    isActive
                      ? "bg-[var(--color-secondary)]"
                      : "bg-white"
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
              <div className="flex w-full flex-col items-center gap-[12px]">
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
                {commentsMap[selectedCategory.name]?.map((comment) => (
                  <RequestCardLarge
                    key={comment.id}
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
          <div className="flex w-full flex-col items-center gap-[15px]">
            {submenuItems.map((menu) => {
              const commentCount = commentsMap[menu.name]?.length ?? 0;
              const isActive = selectedSubmenu?.id === menu.id;
              return (
                <button
                  key={menu.id}
                  type="button"
                  className={`flex h-[75px] w-[345px] items-center gap-4 rounded-[10px] px-4 text-left shadow-[0_8px_20px_rgba(0,0,0,0.05)] ${
                    isActive
                      ? "bg-[var(--color-secondary)]"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedSubmenu(menu)}
                >
                  <div
                    className="h-[44px] w-[44px] rounded-[10px]"
                    style={{ backgroundColor: menu.thumbnail || "#ffecc1" }}
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

            <button
              type="button"
              className="flex h-[75px] w-[345px] items-center justify-center rounded-[10px] bg-white text-[36px] font-normal text-[#000000] shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
              onClick={handleAddMenu}
            >
              +
            </button>

            {selectedSubmenu && (
              <div className="flex w-full flex-col items-center gap-[12px]">
                <div className="self-start">
                  <h2 className="text-xl font-semibold text-[var(--color-primary)]">
                    {selectedSubmenu.name} 테스트 후보
                  </h2>
                </div>

                {(commentsMap[selectedSubmenu.name] ?? []).length === 0 && (
                  <p className="text-sm text-[var(--color-gray-2)]">
                    아직 코멘트가 없어요.
                  </p>
                )}
                {commentsMap[selectedSubmenu.name]?.map((comment) => (
                  <RequestCardLarge
                    key={comment.id}
                    title={comment.nickname}
                    subtitle={`리뷰온도 ${comment.temperature.toFixed(1)} ℃`}
                    thumbnailColor={comment.thumbnail}
                    showRatingIcon={false}
                    onCardClick={() => setModalComment(comment)}
                    onClose={() =>
                      setCommentsMap((prev) => ({
                        ...prev,
                        [selectedSubmenu.name]: (
                          prev[selectedSubmenu.name] ?? []
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
                          [selectedSubmenu.name]: (
                            prev[selectedSubmenu.name] ?? []
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
                        if (ownerProfile && selectedSubmenu) {
                          // gourmet에게 요청 보내기
                          sendRequestToGourmet(
                            comment.nickname,
                            selectedSubmenu.name,
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
