import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import RequestCardLarge from "../components/RequestCardLarge";
import {
  getOwnerMenus,
  getCandidatesByCategory,
  sendRequestToGourmet,
  getOwnerProfile,
} from "../utils/localStorage";

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

export default function OwnerRegisteredMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
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
    if (selectedMenu) {
      loadCandidates(selectedMenu.name);
    }
  }, [selectedMenu]);

  const loadMenuData = () => {
    const storedMenus = getOwnerMenus();
    setMenuItems(storedMenus);

    // 각 메뉴의 후보 수를 commentsMap에 로드
    const newCommentsMap: Record<string, CommentItem[]> = {};
    storedMenus.forEach((menu: MenuItem) => {
      const candidates = getCandidatesByCategory(menu.name);
      newCommentsMap[menu.name] = candidates.map((c: any) => ({
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
    setCommentsMap((prev) => ({
      ...prev,
      [categoryName]: candidates.map((c: any) => ({
        id: c.id,
        nickname: c.nickname,
        temperature: c.temperature,
        thumbnail: c.thumbnail,
      })),
    }));
  };

  const handleBackClick = () => {
    if (selectedMenu) {
      setSelectedMenu(null);
      return;
    }
    alert("뒤로가기 기능은 곧 구현될 예정입니다.");
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
        {selectedMenu && (
          <button
            type="button"
            className="absolute left-[10px] top-[55px] h-[26px] w-[15px]"
            aria-label="이전 화면으로 이동"
            onClick={handleBackClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="26"
              viewBox="0 0 15 26"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.62068 12.7275L14.2272 23.334L12.1062 25.455L0.43918 13.788C0.157973 13.5067 0 13.1252 0 12.7275C0 12.3298 0.157973 11.9483 0.43918 11.667L12.1062 0L14.2272 2.121L3.62068 12.7275Z"
                fill="var(--color-primary)"
              />
            </svg>
          </button>
        )}

        {!selectedMenu ? (
          <>
            <h1 className="self-start text-2xl font-semibold text-[var(--color-primary)]">
              등록한 메뉴
            </h1>

            <div className="flex flex-col items-center gap-[15px]">
              {menuItems.map((menu) => {
                const commentCount = commentsMap[menu.name]?.length ?? 0;
                return (
                  <button
                    key={menu.id}
                    type="button"
                    className="flex h-[75px] w-[345px] items-center gap-4 rounded-[10px] bg-white px-4 text-left shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                    onClick={() => setSelectedMenu(menu)}
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

              <button
                type="button"
                className="flex h-[75px] w-[345px] items-center justify-center rounded-[10px] bg-white text-[36px] font-normal text-[#000000] shadow-[0_8px_20px_rgba(0,0,0,0.05)]"
                onClick={handleAddMenu}
              >
                +
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="self-start">
              <h1 className="text-2xl font-normal text-[var(--color-primary)]">
                <span className="font-semibold">{selectedMenu.name}</span>{" "}
                테스트 후보
              </h1>
            </div>

            <div className="flex flex-col items-center gap-[15px]">
              {(commentsMap[selectedMenu.name] ?? []).length === 0 && (
                <p className="text-sm text-[var(--color-gray-2)]">
                  아직 코멘트가 없어요.
                </p>
              )}
              {commentsMap[selectedMenu.name]?.map((comment) => (
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
                      [selectedMenu.name]: (
                        prev[selectedMenu.name] ?? []
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
                        [selectedMenu.name]: (
                          prev[selectedMenu.name] ?? []
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
                      if (ownerProfile && selectedMenu) {
                        // gourmet에게 요청 보내기
                        sendRequestToGourmet(
                          comment.nickname,
                          selectedMenu.name,
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
          </>
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
