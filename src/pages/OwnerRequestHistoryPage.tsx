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
    id: "sent-1",
    type: "sent",
    title: "고독한 미식가",
    subtitle: "리뷰온도 50℃",
    thumbnail: "#e3ddff",
  },
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
] as const;

const DEFAULT_TAB: TabId = "sent";

export default function OwnerRequestHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>(DEFAULT_TAB);
  const [requests, setRequests] = useState<RequestItem[]>(REQUESTS);

  const visibleRequests = useMemo(
    () => requests.filter((request) => request.type === activeTab),
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
        <div className="absolute left-[10px] top-[55px] h-[26px] w-[15px]" aria-label="이전 화면으로 이동">
        </div>

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
