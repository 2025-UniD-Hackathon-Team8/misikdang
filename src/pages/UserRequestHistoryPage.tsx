import { useMemo, useState } from "react";
import Button from "../components/Button";

const TABS = ["내가 한 요청", "받은 요청"] as const;

type TabLabel = (typeof TABS)[number];

type RequestItem = {
  id: string;
  type: "sent" | "received";
  title: string;
  subtitle: string;
  thumbnail: string;
};

const REQUESTS: RequestItem[] = [
  {
    id: "received-1",
    type: "received",
    title: "점심 추천 부탁!",
    subtitle: "4.9(343) 1.7km",
    thumbnail: "#ffe1e0",
  },
  {
    id: "received-2",
    type: "received",
    title: "단체 예약 가능?",
    subtitle: "4.9(343) 1.7km",
    thumbnail: "#ffecc1",
  },
  {
    id: "received-3",
    type: "received",
    title: "야식 뭐가 좋을까?",
    subtitle: "4.9(343) 1.7km",
    thumbnail: "#cdf2ff",
  },
  {
    id: "sent-1",
    type: "sent",
    title: "예약 확인 요청",
    subtitle: "4.9(343) 1.7km",
    thumbnail: "#e3ddff",
  },
] as const;

export default function UserRequestHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabLabel>("받은 요청");
  const [requests, setRequests] = useState<RequestItem[]>(REQUESTS);

  const visibleRequests = useMemo(
    () =>
      requests.filter((request) =>
        activeTab === "받은 요청"
          ? request.type === "received"
          : request.type === "sent",
      ),
    [activeTab, requests],
  );

  const handleRemoveRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== requestId));
  };

  const handleAcceptRequest = (title: string) => {
    alert(`${title} 요청 수락 기능이 곧 준비될 예정입니다.`);
  };

  return (
    <div className="flex min-h-dvh justify-center bg-[var(--color-background)] px-4 py-6 text-left">
      <main className="relative flex w-full max-w-[393px] flex-col items-center gap-[15px] px-4 pb-10 pt-[111px]">
        <button
          type="button"
          className="absolute left-[10px] top-[55px] h-[26px] w-[15px]"
          aria-label="이전 화면으로 이동"
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

        <div className="flex h-[50px] w-[330px] items-center gap-2 rounded-[10px] bg-[#F8F8FA] p-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                className={`h-[40px] w-[155px] rounded-[8px] text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--color-secondary)] text-[var(--color-primary)] shadow-[0_6px_16px_rgba(0,0,0,0.18)]"
                    : "text-[var(--color-primary)]/70"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-[15px]">
          {visibleRequests.map((request) => {
            const isReceived = request.type === "received";

            return (
              <article
                key={request.id}
                className={`w-[345px] rounded-[10px] bg-white px-4 shadow-[0_6px_18px_rgba(0,0,0,0.06)] ${
                  isReceived
                    ? "flex h-[150px] flex-col justify-between py-4"
                    : "flex h-[77px] items-center gap-4 py-3"
                }`}
              >
                <div className="flex flex-1 items-center gap-4">
                  <div
                    className="h-[45px] w-[45px] rounded-[10px]"
                    style={{ backgroundColor: request.thumbnail }}
                  />
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <h2 className="truncate text-base font-semibold text-[var(--color-primary)]">
                      {request.title}
                    </h2>
                    <p className="flex items-center gap-1 text-sm text-[var(--color-gray-1)]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="13"
                        viewBox="0 0 14 13"
                        fill="none"
                      >
                        <path
                          d="M6.77736 10.8458L3.49194 12.825C3.3468 12.9174 3.19507 12.9569 3.03674 12.9437C2.8784 12.9306 2.73986 12.8778 2.62111 12.7854C2.50236 12.6931 2.41 12.5777 2.34403 12.4395C2.27805 12.3012 2.26486 12.146 2.30444 11.974L3.17528 8.23333L0.265902 5.71979C0.133957 5.60104 0.0516239 5.46567 0.0189017 5.31367C-0.0138206 5.16167 -0.00405671 5.01336 0.0481933 4.86875C0.100443 4.72414 0.17961 4.60539 0.285693 4.5125C0.391777 4.41961 0.536915 4.36024 0.72111 4.33438L4.56069 3.99792L6.04507 0.475C6.11104 0.316667 6.21343 0.197917 6.35224 0.11875C6.49104 0.0395832 6.63275 0 6.77736 0C6.92197 0 7.06368 0.0395832 7.20249 0.11875C7.34129 0.197917 7.44368 0.316667 7.50965 0.475L8.99403 3.99792L12.8336 4.33438C13.0183 4.36076 13.1635 4.42014 13.269 4.5125C13.3746 4.60486 13.4537 4.72361 13.5065 4.86875C13.5593 5.01389 13.5693 5.16246 13.5366 5.31446C13.5039 5.46646 13.4213 5.60157 13.2888 5.71979L10.3794 8.23333L11.2503 11.974C11.2899 12.1455 11.2767 12.3007 11.2107 12.4395C11.1447 12.5783 11.0524 12.6936 10.9336 12.7854C10.8149 12.8772 10.6763 12.93 10.518 12.9437C10.3597 12.9575 10.2079 12.9179 10.0628 12.825L6.77736 10.8458Z"
                          fill="#FFBF00"
                        />
                      </svg>
                      <span className="truncate">{request.subtitle}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xl text-[#cccccc] transition hover:text-[var(--color-gray-2)]"
                    aria-label={`${request.title} 요청 닫기`}
                    onClick={() => handleRemoveRequest(request.id)}
                  >
                    ×
                  </button>
                </div>

                {isReceived && (
                  <div className="flex w-full justify-between pt-3">
                    <Button
                      bgColor="#ffffff"
                      fgColor="var(--color-primary)"
                      className="h-[40px] w-[155px] border border-[var(--color-gray-2)] text-sm"
                      onClick={() => handleRemoveRequest(request.id)}
                    >
                      거절하기
                    </Button>
                    <Button
                      className="h-[40px] w-[155px] text-sm"
                      onClick={() => handleAcceptRequest(request.title)}
                    >
                      수락하기
                    </Button>
                  </div>
                )}
              </article>
            );
          })}
          {visibleRequests.length === 0 && (
            <p className="text-sm text-[var(--color-gray-2)]">
              표시할 요청이 아직 없어요.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
