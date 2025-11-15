import { useMemo, useState } from "react";
import Button from "../components/Button";

type MenuItem = {
  id: string;
  name: string;
  thumbnail: string;
  count: number;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "menu-1",
    name: "햄버거",
    thumbnail: "#ffe3d5",
    count: 4,
  },
  {
    id: "menu-2",
    name: "치킨",
    thumbnail: "#e6f6ff",
    count: 2,
  },
  {
    id: "menu-3",
    name: "피자",
    thumbnail: "#f5e6ff",
    count: 1,
  },
] as const;

type CommentItem = {
  id: string;
  nickname: string;
  temperature: number;
  message: string;
  thumbnail: string;
};

const MENU_COMMENTS: Record<string, CommentItem[]> = {
  햄버거: [
    {
      id: "hamburger-1",
      nickname: "버거1러버",
      temperature: 65.8,
      message: "패티가 두툼해서 만족했어요.",
      thumbnail: "#ffe1e0",
    },
    {
      id: "hamburger-2",
      nickname: "감튀최고",
      temperature: 60.3,
      message: "사이드 감자튀김이 특히 맛있네요.",
      thumbnail: "#ffecc1",
    },
    {
      id: "hamburger-3",
      nickname: "아이맘",
      temperature: 58.4,
      message: "아이들이 잘 먹어서 자주 주문해요.",
      thumbnail: "#cdf2ff",
    },
    {
      id: "hamburger-4",
      nickname: "빵순이",
      temperature: 62.1,
      message: "번이 촉촉하고 버터 향이 좋아요.",
      thumbnail: "#e4f7e4",
    },
  ],
  치킨: [
    {
      id: "chicken-1",
      nickname: "바삭킹",
      temperature: 67.2,
      message: "튀김옷이 얇고 바삭해서 최고!",
      thumbnail: "#ffecc1",
    },
    {
      id: "chicken-2",
      nickname: "양념쟁이",
      temperature: 61.9,
      message: "달콤한 양념이 입에 착 붙어요.",
      thumbnail: "#ffe1e0",
    },
  ],
  피자: [
    {
      id: "pizza-1",
      nickname: "치즈광",
      temperature: 66.4,
      message: "치즈가 듬뿍 들어가서 늘 만족합니다.",
      thumbnail: "#f5e6ff",
    },
  ],
};

export default function OwnerRegisteredMenuPage() {
  const menuItems = useMemo(() => MENU_ITEMS, []);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [commentsMap, setCommentsMap] =
    useState<Record<string, CommentItem[]>>(MENU_COMMENTS);
  const [modalComment, setModalComment] = useState<CommentItem | null>(null);

  const handleBackClick = () => {
    if (selectedMenu) {
      setSelectedMenu(null);
      return;
    }
    alert("뒤로가기 기능은 곧 구현될 예정입니다.");
  };

  return (
    <div className="flex min-h-dvh justify-center bg-[var(--color-background)] px-4 py-6 text-left">
      <main className="relative flex w-full max-w-[393px] flex-col items-center gap-[15px] px-4 pb-12 pt-[125px]">
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
              >
                +
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="self-start">
              <h1 className="text-2xl font-normal text-[var(--color-primary)]">
                <span className="font-semibold">{selectedMenu.name}</span> 테스트 후보
              </h1>
            </div>

            <div className="flex flex-col items-center gap-[15px]">
              {(commentsMap[selectedMenu.name] ?? []).length === 0 && (
                <p className="text-sm text-[var(--color-gray-2)]">
                  아직 코멘트가 없어요.
                </p>
              )}
              {commentsMap[selectedMenu.name]?.map((comment) => (
                <article
                  key={comment.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setModalComment(comment)}
                  className="flex h-[150px] w-[345px] cursor-pointer flex-col justify-between rounded-[10px] bg-white px-4 py-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <div
                      className="h-[45px] w-[45px] rounded-[10px]"
                      style={{ backgroundColor: comment.thumbnail }}
                    />
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <h2 className="truncate text-base font-semibold text-[var(--color-primary)]">
                        {comment.nickname}
                      </h2>
                      <p className="text-sm text-[var(--color-gray-1)]">
                        리뷰온도 {comment.temperature.toFixed(1)} ℃
                      </p>
                    </div>
                    <button
                      type="button"
                      className="text-xl text-[#cccccc] transition hover:text-[var(--color-gray-2)]"
                      aria-label={`${comment.nickname} 코멘트 닫기`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setCommentsMap((prev) => ({
                          ...prev,
                          [selectedMenu.name]: (prev[selectedMenu.name] ?? []).filter(
                            (item) => item.id !== comment.id,
                          ),
                        }));
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex w-full justify-between pt-3">
                    <Button
                      bgColor="#ffffff"
                      fgColor="var(--color-primary)"
                      className="h-[40px] w-[155px] border border-[var(--color-gray-2)] text-sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        setCommentsMap((prev) => ({
                          ...prev,
                          [selectedMenu.name]: (prev[selectedMenu.name] ?? []).filter(
                            (item) => item.id !== comment.id,
                          ),
                        }));
                      }}
                    >
                      삭제하기
                    </Button>
                    <Button
                      className="h-[40px] w-[155px] text-sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        alert(
                          `${comment.nickname}님의 리뷰를 기반으로 요청을 보낼 예정입니다.`,
                        );
                      }}
                    >
                      요청보내기
                    </Button>
                  </div>
                </article>
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
              {modalComment.nickname}님의 리뷰
            </p>
            <p className="mt-1 text-xs text-[var(--color-gray-1)]">
              리뷰온도 {modalComment.temperature.toFixed(1)} ℃
            </p>
            <p className="mt-4 text-base text-[var(--color-primary)]">{modalComment.message}</p>
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
