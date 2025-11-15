import { useMemo, useState } from "react";
import RequestCardLarge from "../components/RequestCardLarge";
import RequestCardSmall from "../components/RequestCardSmall";
import ToggleTabs from "../components/ToggleTabs";

const TABS = [
  { id: "sent", label: "내가 한 요청" },
  { id: "received", label: "받은 요청" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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
    title: "모몽가모몽가",
    subtitle: "리뷰온도 50℃",
    thumbnail: "#ffe1e0",
  },
  {
    id: "received-2",
    type: "received",
    title: "푸드파이터",
    subtitle: "리뷰온도 50℃",
    thumbnail: "#ffecc1",
  },
  {
    id: "received-3",
    type: "received",
    title: "야식 뭐가 좋을까?",
    subtitle: "리뷰온도 50℃",
    thumbnail: "#cdf2ff",
  },
  {
    id: "sent-1",
    type: "sent",
    title: "고독한 미식가",
    subtitle: "리뷰온도 50℃",
    thumbnail: "#e3ddff",
  },
] as const;

export default function OwnerRequestHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("received");
  const [requests, setRequests] = useState<RequestItem[]>(REQUESTS);

  const visibleRequests = useMemo(
    () =>
      requests.filter((request) =>
        activeTab === "received" ? request.type === "received" : request.type === "sent",
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

        <ToggleTabs
          tabs={TABS}
          activeTabId={activeTab}
          onTabSelect={(id) => setActiveTab(id as TabId)}
        />

        <div className="flex flex-col items-center gap-[15px]">
          {visibleRequests.map((request) => {
            const isReceived = request.type === "received";
            return (
              <div key={request.id} className="w-full">
                {isReceived ? (
                  <RequestCardLarge
                    title={request.title}
                    subtitle={request.subtitle}
                    thumbnailColor={request.thumbnail}
                    showRatingIcon={false}
                    onClose={() => handleRemoveRequest(request.id)}
                    leftAction={{
                      label: "거절하기",
                      variant: "secondary",
                      onClick: () => handleRemoveRequest(request.id),
                    }}
                    rightAction={{
                      label: "수락하기",
                      onClick: () => handleAcceptRequest(request.title),
                    }}
                  />
                ) : (
                  <RequestCardSmall
                    title={request.title}
                    subtitle={request.subtitle}
                    thumbnailColor={request.thumbnail}
                    showRatingIcon={false}
                    onClose={() => handleRemoveRequest(request.id)}
                  />
                )}
              </div>
            );
          })}
          {visibleRequests.length === 0 && (
            <p className="text-sm text-[var(--color-gray-2)]">표시할 요청이 아직 없어요.</p>
          )}
        </div>
      </main>
    </div>
  );
}
